#!/usr/bin/env python3
"""Loop tick: verify split /tier and /matchups pages."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETUP = ROOT / "scripts" / "split-meta-pages.py"
TIER_PAGE = ROOT / "src" / "app" / "tier" / "page.tsx"
MATCHUPS_PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
SIDEBAR = ROOT / "src" / "components" / "HomeSidebar.tsx"
HEADER = ROOT / "src" / "components" / "SiteHeader.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"
RESTORE_TAG = "before-character-meta"
SORT_SCRIPT = ROOT / "scripts" / "sort-matchup-core-by-tier.py"
EXPAND_SCRIPT = ROOT / "scripts" / "expand-full-roster-matchups.py"
TIER_ORDER = ("S", "A", "B", "C")
FULL_ROSTER = 30


def _parse_matchup_core(meta: str) -> list[str]:
    import re

    match = re.search(r"export const MATCHUP_CORE = \[(.*?)\] as const;", meta)
    if not match:
        return []
    return re.findall(r'"([^"]+)"', match.group(1))


def _parse_tiers(meta: str) -> dict[str, list[str]]:
    import re

    tiers: dict[str, list[str]] = {}
    for tier in TIER_ORDER:
        block = re.search(rf'"{re.escape(tier)}": \[(.*?)\],', meta, re.S)
        if block:
            tiers[tier] = re.findall(r'"([^"]+)"', block.group(1))
    return tiers


def _matchup_core_tier_sorted() -> bool:
    meta = META_TS.read_text(encoding="utf-8") if META_TS.is_file() else ""
    core = _parse_matchup_core(meta)
    tiers = _parse_tiers(meta)
    if not core or not tiers:
        return False

    def rank(slug: str) -> tuple[int, int]:
        for ti, tier in enumerate(TIER_ORDER):
            bucket = tiers.get(tier, [])
            if slug in bucket:
                return ti, bucket.index(slug)
        return 99, 99

    return core == sorted(core, key=rank)


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
    sidebar = SIDEBAR.read_text(encoding="utf-8") if SIDEBAR.is_file() else ""
    header = HEADER.read_text(encoding="utf-8") if HEADER.is_file() else ""
    return {
        "meta_data": "export const TIERS" in meta and "export const MATCHUPS" in meta,
        "tier_page": TIER_PAGE.is_file() and '"S+"' in META_TS.read_text(encoding="utf-8"),
        "matchups_page": MATCHUPS_PAGE.is_file()
        and "キャラクター相性表" in MATCHUPS_PAGE.read_text(encoding="utf-8"),
        "split_nav": 'label: "CHAR RANK"' in header and 'label: "CHARACTER 相性"' in header,
        "split_sidebar": "Character Rank →" in sidebar and "キャラクター相性 →" in sidebar,
        "matchup_sorted": _matchup_core_tier_sorted(),
        "full_roster": len(_parse_matchup_core(meta)) == FULL_ROSTER,
        "ja_labels": "キャラクター相性表" in (MATCHUPS_PAGE.read_text(encoding="utf-8") if MATCHUPS_PAGE.is_file() else ""),
        "restore_tag": git("rev-parse", RESTORE_TAG).returncode == 0,
    }


def main() -> int:
    c = checks()
    required = (
        "meta_data",
        "tier_page",
        "matchups_page",
        "split_nav",
        "split_sidebar",
        "matchup_sorted",
        "full_roster",
        "ja_labels",
    )
    if not all(c[k] for k in required):
        if (not c.get("full_roster") or not c.get("ja_labels")) and EXPAND_SCRIPT.is_file():
            subprocess.run([sys.executable, str(EXPAND_SCRIPT)], cwd=ROOT, check=False)
        elif not c.get("matchup_sorted") and SORT_SCRIPT.is_file():
            subprocess.run([sys.executable, str(SORT_SCRIPT)], cwd=ROOT, check=False)
        elif SETUP.is_file():
            subprocess.run([sys.executable, str(SETUP)], cwd=ROOT, check=False)
        c = checks()

    dirty = bool(git("status", "--porcelain").stdout.strip())
    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")

    if all(c[k] for k in required) and unpushed and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    all_ok = all(c[k] for k in required) and not dirty and not unpushed
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
