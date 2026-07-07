#!/usr/bin/env python3
"""Loop tick: verify tier/matchup meta layer, rebuild if missing, commit/push."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETUP = ROOT / "scripts" / "setup-character-meta.py"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
META_PAGE = ROOT / "src" / "app" / "meta" / "page.tsx"
TIER_BAND = ROOT / "src" / "components" / "TierBand.tsx"
HOME = ROOT / "src" / "app" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"
RESTORE_TAG = "before-character-meta"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", "pmx0032006-prog")
    env.setdefault("GIT_AUTHOR_EMAIL", "pmx0032006@gmail.com")
    env.setdefault("GIT_COMMITTER_NAME", "pmx0032006-prog")
    env.setdefault("GIT_COMMITTER_EMAIL", "pmx0032006@gmail.com")
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


def checks() -> dict[str, bool]:
    meta = META_TS.read_text(encoding="utf-8") if META_TS.is_file() else ""
    home = HOME.read_text(encoding="utf-8") if HOME.is_file() else ""
    return {
        "meta_data": "export const TIERS" in meta and "export const MATCHUPS" in meta,
        "meta_page": META_PAGE.is_file(),
        "tier_band": TIER_BAND.is_file() and "<TierBand />" in home,
        "restore_tag": git("rev-parse", RESTORE_TAG).returncode == 0,
    }


def main() -> int:
    c = checks()
    if not all(c[k] for k in ("meta_data", "meta_page", "tier_band")):
        if SETUP.is_file():
            subprocess.run([sys.executable, str(SETUP)], cwd=ROOT, check=False)
        c = checks()

    dirty = bool(git("status", "--porcelain").stdout.strip())
    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")

    if all(c[k] for k in ("meta_data", "meta_page", "tier_band")) and unpushed and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    all_ok = all(c[k] for k in ("meta_data", "meta_page", "tier_band")) and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        **c,
        "dirty": dirty,
        "unpushed": unpushed,
        "restore": f"git reset --hard {RESTORE_TAG}",
        "all_ok": all_ok,
    }
    print("META_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("META_LOOP_OK")
        return 0
    print("META_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
