#!/usr/bin/env python3
"""Rename meta UI labels to Character Rank / Matchup Chart."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUSH = ROOT / "scripts" / "push_to_github.py"

REPLACEMENTS: list[tuple[Path, list[tuple[str, str]]]] = [
    (
        ROOT / "src" / "components" / "SiteHeader.tsx",
        [
            ('label: "TIER"', 'label: "CHAR RANK"'),
            ('label: "MATCHUPS"', 'label: "MATCH CHART"'),
            ("            TIER\n", "            RANK\n"),
            ("            MATCH\n", "            CHART\n"),
        ],
    ),
    (
        ROOT / "src" / "components" / "HomeSidebar.tsx",
        [
            ("Tier List →", "Character Rank →"),
            ("Matchups →", "Matchup Chart →"),
            (
                "Community snapshot ({META_UPDATED})",
                "Character rank & matchup chart ({META_UPDATED})",
            ),
        ],
    ),
    (
        ROOT / "src" / "app" / "tier" / "page.tsx",
        [
            ("Character Tier List |", "Character Rank |"),
            (
                "Community SF6 character tier list snapshot with links to frame data.",
                "Community SF6 character rank snapshot with links to frame data.",
            ),
            ("Character Tier List", "Character Rank"),
            ("Matchup chart →", "Matchup Chart →"),
        ],
    ),
    (
        ROOT / "src" / "app" / "matchups" / "page.tsx",
        [
            ("← Tier list", "← Character Rank"),
        ],
    ),
    (
        ROOT / "src" / "components" / "TierBand.tsx",
        [
            ('aria-label="Character tier snapshot"', 'aria-label="Character rank snapshot"'),
            ("Community tier list — updated", "Character rank — updated"),
            ("Full tier list →", "Character rank →"),
        ],
    ),
]


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
    changed: list[str] = []
    for path, pairs in REPLACEMENTS:
        text = path.read_text(encoding="utf-8")
        original = text
        for old, new in pairs:
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))

    if not changed:
        print("[skip] labels already updated")
        return 0

    print("[done] renamed labels:", ", ".join(changed))

    git("add", *changed, "scripts/rename-meta-labels.py", "scripts/meta-loop-tick.py")
    commit = git("commit", "-m", "Use clearer Character Rank and Matchup Chart labels")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
