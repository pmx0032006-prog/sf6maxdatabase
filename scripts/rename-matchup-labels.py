#!/usr/bin/env python3
"""Use Character Matchups labels (char compatibility, not match results)."""
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
            ('label: "MATCH CHART"', 'label: "CHAR MATCHUPS"'),
            ("            CHART\n", "            MATCH\n"),
        ],
    ),
    (
        ROOT / "src" / "components" / "HomeSidebar.tsx",
        [
            (
                "Character rank & matchup chart ({META_UPDATED})",
                "Character rank & matchups ({META_UPDATED})",
            ),
            ("Matchup Chart →", "Character Matchups →"),
        ],
    ),
    (
        ROOT / "src" / "app" / "tier" / "page.tsx",
        [
            ("Matchup Chart →", "Character Matchups →"),
        ],
    ),
    (
        ROOT / "src" / "app" / "matchups" / "page.tsx",
        [
            ("Matchup Chart |", "Character Matchups |"),
            (
                "Community SF6 matchup chart snapshot for core characters.",
                "Community SF6 character matchup snapshot — advantage between characters, not match results.",
            ),
            ("Matchup Chart", "Character Matchups"),
            (
                "Row vs column for 10 core characters. Pair with frame data on each character page.",
                "Who has the advantage when two characters meet. Row attacks into column. Pair with frame data on each character page.",
            ),
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
        print("[skip] matchup labels already updated")
        return 0

    print("[done] character matchups labels:", ", ".join(changed))

    git("add", *changed, "scripts/rename-matchup-labels.py", "scripts/meta-loop-tick.py")
    commit = git("commit", "-m", "Rename matchup chart to character matchups")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
