#!/usr/bin/env python3
"""Loop tick: Amazon-3 + AdSense split — apply, verify, commit/push, report."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PHASE_FILE = ROOT / "scripts" / "monetization_phase.json"
SETUP_DENSE = ROOT / "scripts" / "setup-amazon-dense-phase.py"
SETUP_SPLIT = ROOT / "scripts" / "setup-monetization-split.py"
ADSENSE_TICK = ROOT / "scripts" / "adsense-loop-tick.py"
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
GEAR_DATA = ROOT / "src" / "data" / "affiliate-gear.ts"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
PUSH_SCRIPT = ROOT / "scripts" / "push_to_github.py"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"
ASINS = ("B0BPJRGNSD", "B0BZQKCFSD", "B08GJC5WSS")
PUBLISHER = "ca-pub-8960641434315655"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return env


def run_py(script: Path) -> int:
    result = subprocess.run(
        [sys.executable, str(script)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    return result.returncode


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        env=git_env(),
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )


def checks_pass(checks: dict[str, object]) -> bool:
    return bool(checks.get("rails_ok")) and bool(checks.get("adsense_meta")) and bool(checks.get("adsense_script"))


def fetch_ok(url: str, needle: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status == 200 and needle in body
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def current_phase() -> str:
    if PHASE_FILE.is_file():
        try:
            data = json.loads(PHASE_FILE.read_text(encoding="utf-8"))
            return str(data.get("phase", "amazon_dense"))
        except json.JSONDecodeError:
            pass
    return "amazon_dense"


def local_ok() -> dict[str, bool]:
    rails = RAILS.read_text(encoding="utf-8") if RAILS.is_file() else ""
    gear = GEAR_DATA.read_text(encoding="utf-8") if GEAR_DATA.is_file() else ""
    layout = LAYOUT.read_text(encoding="utf-8") if LAYOUT.is_file() else ""
    phase = current_phase()
    asin_source = gear if gear else rails
    asins_ok = all(a in asin_source for a in ASINS)
    rail_dense = "RAIL_HALF" in rails and "startIndex={RAIL_HALF}" in rails and asins_ok
    rail_split = "const RAIL_COUNT = 3;" in rails and asins_ok
    rails_ok = rail_dense if phase == "amazon_dense" else rail_split
    adsense_meta = 'name="google-adsense-account"' in layout
    adsense_script = PUBLISHER in layout
    return {
        "phase": phase,
        "rails_ok": rails_ok,
        "adsense_meta": adsense_meta,
        "adsense_script": adsense_script,
    }


def main() -> int:
    phase = current_phase()
    setup = SETUP_DENSE if phase == "amazon_dense" else SETUP_SPLIT
    if setup.is_file():
        run_py(setup)

    checks = local_ok()
    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    monetization_dirty = any(
        "DesktopSideRails" in line
        or "layout.tsx" in line
        or "setup-monetization" in line
        or "setup-amazon-dense" in line
        or "monetization_phase.json" in line
        or "monetization-loop-tick" in line
        for line in porcelain.stdout.splitlines()
    )

    if checks_pass(checks) and monetization_dirty:
        git(
            "add",
            "src/components/DesktopSideRails.tsx",
            "src/app/layout.tsx",
            "scripts/setup-monetization-split.py",
            "scripts/setup-amazon-dense-phase.py",
            "scripts/monetization_phase.json",
            "scripts/monetization-loop-tick.py",
        )
        msg = (
            "Phase 1: restore dense Amazon side rails until AdSense is live"
            if phase == "amazon_dense"
            else "Phase 2: Amazon 3 picks, AdSense auto ads elsewhere"
        )
        commit = git("commit", "-m", msg)
        if commit.returncode == 0:
            print("[done] committed monetization split")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            monetization_dirty = False

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")
    if checks_pass(checks) and unpushed and PUSH_SCRIPT.is_file():
        run_py(PUSH_SCRIPT)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    live_ads_txt = fetch_ok("https://www.sf6maxdatabase.com/ads.txt", PUBLISHER)

    all_ok = checks_pass(checks) and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        **checks,
        "live_ads_txt": live_ads_txt,
        "committed": checks_pass(checks) and not monetization_dirty,
        "dirty": dirty,
        "all_ok": all_ok,
    }
    print("MONETIZATION_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("MONETIZATION_LOOP_OK")
        return 0
    print("MONETIZATION_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
