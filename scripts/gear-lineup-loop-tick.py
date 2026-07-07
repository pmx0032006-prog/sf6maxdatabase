#!/usr/bin/env python3
"""Loop tick: verify split rails (no left/right duplicate), apply fix, push."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
GEAR_DATA = ROOT / "src" / "data" / "affiliate-gear.ts"
FOOTER = ROOT / "src" / "components" / "AffiliateGearStrip.tsx"
SETUP = ROOT / "scripts" / "setup-fgc-gear-lineup.py"
PUSH = ROOT / "scripts" / "push_to_github.py"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return env


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


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


def unique_asins(text: str) -> list[str]:
    return re.findall(r'asin:\s*"([A-Z0-9]{10})"', text)


def rails_ok(rails: str, gear: str) -> bool:
    if "RAIL_PER_SIDE = 5" not in rails:
        return False
    if "startIndex={0}" not in rails or "startIndex={5}" not in rails:
        return False
    if "pickGear" in rails or "offset={1}" in rails:
        return False
    if "% AFFILIATE_GEAR.length" in rails:
        return False
    gear_asins = unique_asins(gear)
    if len(gear_asins) != len(set(gear_asins)):
        return False
    return True


def footer_ok(footer: str) -> bool:
    return "2xl:hidden" in footer


def main() -> int:
    if SETUP.is_file():
        rails = read(RAILS)
        gear = read(GEAR_DATA)
        footer = read(FOOTER)
        if not rails_ok(rails, gear) or not footer_ok(footer):
            subprocess.run([sys.executable, str(SETUP)], cwd=ROOT, check=False)

    rails = read(RAILS)
    gear = read(GEAR_DATA)
    footer = read(FOOTER)
    checks = {
        "rails_split": rails_ok(rails, gear),
        "footer_mobile_only": footer_ok(footer),
        "gear_count": len(unique_asins(gear)),
    }
    dirty = bool(git("status", "--porcelain").stdout.strip())
    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")

    if checks["rails_split"] and checks["footer_mobile_only"] and unpushed and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    all_ok = checks["rails_split"] and checks["footer_mobile_only"] and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        **checks,
        "dirty": dirty,
        "unpushed": unpushed,
        "all_ok": all_ok,
    }
    print("GEAR_LINEUP_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("GEAR_LINEUP_LOOP_OK")
        return 0
    print("GEAR_LINEUP_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
