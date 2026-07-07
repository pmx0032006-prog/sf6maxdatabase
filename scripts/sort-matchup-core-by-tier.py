#!/usr/bin/env python3
"""Sort MATCHUP_CORE strong (top) → weak (bottom) by tier rank."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META_JSON = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
MATCHUPS_PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_ORDER = ("S", "A", "B", "C")

ORDER_HINT = (
    "Rows and columns run strong → weak (tier rank: top = strong, bottom = weak)."
)
OLD_HINT = "++ strong / + slight edge / = even / - slight deficit / -- tough"


def tier_rank(slug: str, tiers: dict[str, list[str]]) -> tuple[int, int]:
    for tier_index, tier in enumerate(TIER_ORDER):
        bucket = tiers.get(tier, [])
        if slug in bucket:
            return tier_index, bucket.index(slug)
    return 99, 99


def sort_matchup_core(core: list[str], tiers: dict[str, list[str]]) -> list[str]:
    return sorted(core, key=lambda slug: tier_rank(slug, tiers))


def patch_meta_ts(core: list[str]) -> bool:
    text = META_TS.read_text(encoding="utf-8")
    core_line = "export const MATCHUP_CORE = [" + ", ".join(f'"{s}"' for s in core) + "] as const;"
    new_text, count = re.subn(
        r"export const MATCHUP_CORE = \[.*?\] as const;",
        core_line,
        text,
        count=1,
    )
    if count != 1:
        return False
    META_TS.write_text(new_text, encoding="utf-8")
    return True


def patch_matchups_page() -> bool:
    text = MATCHUPS_PAGE.read_text(encoding="utf-8")
    if ORDER_HINT in text:
        return False
    if OLD_HINT not in text:
        return False
    text = text.replace(
        OLD_HINT,
        f"{OLD_HINT}\n          </p>\n          <p className=\"mt-1 text-xs text-muted/80\">\n            {ORDER_HINT}",
        1,
    )
    MATCHUPS_PAGE.write_text(text, encoding="utf-8")
    return True


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


def main() -> int:
    data = json.loads(META_JSON.read_text(encoding="utf-8"))
    tiers = data["tiers"]
    core = list(data["matchup_core"])
    sorted_core = sort_matchup_core(core, tiers)

    if sorted_core == core:
        print("[info] matchup_core already tier-sorted:", ", ".join(sorted_core))
    else:
        data["matchup_core"] = sorted_core
        META_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print("[done] sorted matchup_core:", " → ".join(sorted_core))

    if not patch_meta_ts(sorted_core):
        print("[error] failed to patch character-meta.ts", file=sys.stderr)
        return 1

    patch_matchups_page()

    git(
        "add",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "src/app/matchups/page.tsx",
        "scripts/sort-matchup-core-by-tier.py",
        "scripts/meta-loop-tick.py",
    )
    commit = git("commit", "-m", "Sort matchup chart strong top to weak bottom by tier")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
