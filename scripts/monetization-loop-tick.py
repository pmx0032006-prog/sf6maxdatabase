#!/usr/bin/env python3
"""Loop tick: Amazon-3 + AdSense split — apply, verify, commit/push, report."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETUP = ROOT / "scripts" / "setup-monetization-split.py"
ADSENSE_TICK = ROOT / "scripts" / "adsense-loop-tick.py"
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
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


def fetch_ok(url: str, needle: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status == 200 and needle in body
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def local_ok() -> dict[str, bool]:
    rails = RAILS.read_text(encoding="utf-8") if RAILS.is_file() else ""
    layout = LAYOUT.read_text(encoding="utf-8") if LAYOUT.is_file() else ""
    rail_three = "const RAIL_COUNT = 3;" in rails
    asins_ok = all(a in rails for a in ASINS)
    adsense_meta = 'name="google-adsense-account"' in layout
    adsense_script = PUBLISHER in layout
    return {
        "rail_three_products": rail_three and asins_ok,
        "adsense_meta": adsense_meta,
        "adsense_script": adsense_script,
    }


def main() -> int:
    if SETUP.is_file():
        run_py(SETUP)

    checks = local_ok()
    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    monetization_dirty = any(
        "DesktopSideRails" in line
        or "layout.tsx" in line
        or "setup-monetization-split" in line
        or "monetization-loop-tick" in line
        for line in porcelain.stdout.splitlines()
    )

    if all(checks.values()) and monetization_dirty:
        git(
            "add",
            "src/components/DesktopSideRails.tsx",
            "src/app/layout.tsx",
            "scripts/setup-monetization-split.py",
            "scripts/monetization-loop-tick.py",
        )
        commit = git(
            "commit",
            "-m",
            "Split monetization: Amazon 3 gear picks, AdSense auto ads elsewhere",
        )
        if commit.returncode == 0:
            print("[done] committed monetization split")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            monetization_dirty = False

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")
    if all(checks.values()) and unpushed and PUSH_SCRIPT.is_file():
        run_py(PUSH_SCRIPT)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    live_ads_txt = fetch_ok("https://www.sf6maxdatabase.com/ads.txt", PUBLISHER)

    all_ok = all(checks.values()) and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        **checks,
        "live_ads_txt": live_ads_txt,
        "committed": all(checks.values()) and not monetization_dirty,
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
