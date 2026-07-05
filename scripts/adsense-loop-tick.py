#!/usr/bin/env python3
"""Loop tick: ensure AdSense snippet + ads.txt, commit/push, report status."""
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
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
ADS_TXT = ROOT / "public" / "ads.txt"
ADD_SCRIPT = ROOT / "scripts" / "add-adsense-snippet.py"
PUSH_SCRIPT = ROOT / "scripts" / "push_to_github.py"
MARKER = "ca-pub-8960641434315655"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


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


def main() -> int:
    if ADD_SCRIPT.is_file():
        run_py(ADD_SCRIPT)

    layout = LAYOUT.read_text(encoding="utf-8") if LAYOUT.is_file() else ""
    ads = ADS_TXT.read_text(encoding="utf-8") if ADS_TXT.is_file() else ""
    local_ok = MARKER in layout and "pub-8960641434315655" in ads

    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    adsense_dirty = any(
        "layout.tsx" in line or "ads.txt" in line or "add-adsense" in line or "adsense-loop" in line
        for line in porcelain.stdout.splitlines()
    )

    if local_ok and adsense_dirty:
        git(
            "add",
            "src/app/layout.tsx",
            "public/ads.txt",
            "scripts/add-adsense-snippet.py",
            "scripts/adsense-loop-tick.py",
        )
        commit = git("commit", "-m", "Add Google AdSense verification snippet and ads.txt")
        if commit.returncode == 0:
            print("[done] committed AdSense files")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            adsense_dirty = False

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")

    if local_ok and unpushed and PUSH_SCRIPT.is_file():
        run_py(PUSH_SCRIPT)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    live_ads_txt = fetch_ok("https://www.sf6maxdatabase.com/ads.txt", "pub-8960641434315655")

    all_ok = local_ok and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "local_ok": local_ok,
        "live_ads_txt": live_ads_txt,
        "committed": local_ok and not adsense_dirty,
        "dirty": dirty,
        "all_ok": all_ok,
    }

    print("ADSENSE_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("ADSENSE_LOOP_OK")
        return 0
    print("ADSENSE_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
