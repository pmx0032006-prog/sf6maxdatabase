#!/usr/bin/env python3
"""Use CHARACTER 相性 in nav so JP browser translate reads correctly."""
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
            ('label: "CHAR MATCHUPS"', 'label: "CHARACTER 相性"'),
            ('label: "CHAR AFFINITY"', 'label: "CHARACTER 相性"'),
            ("            MATCH\n", "            相性\n"),
            ("            AFFIN\n", "            相性\n"),
        ],
    ),
    (
        ROOT / "src" / "components" / "HomeSidebar.tsx",
        [
            (
                "Character rank & matchups ({META_UPDATED})",
                "Character rank & 相性 ({META_UPDATED})",
            ),
            (
                "Character rank & affinity ({META_UPDATED})",
                "Character rank & 相性 ({META_UPDATED})",
            ),
            ("Character Matchups →", "キャラクター相性 →"),
            ("Character Affinity →", "キャラクター相性 →"),
        ],
    ),
    (
        ROOT / "src" / "app" / "tier" / "page.tsx",
        [
            ("Character Matchups →", "キャラクター相性 →"),
            ("Character Affinity →", "キャラクター相性 →"),
        ],
    ),
    (
        ROOT / "src" / "app" / "matchups" / "page.tsx",
        [
            ("Character Matchups |", "Character Affinity |"),
            ("Character Affinity |", "Character Affinity |"),
            (
                "Community SF6 character matchup snapshot — advantage between characters, not match results.",
                "Community SF6 character affinity snapshot — roster advantage ratings, not tournament results.",
            ),
            (
                "Community SF6 character affinity snapshot — roster advantage ratings, not tournament results.",
                "Community SF6 character affinity snapshot — roster advantage ratings, not tournament results.",
            ),
            ("Character Matchups", "Character Affinity"),
            (
                "Who has the advantage when two characters meet. Row attacks into column. Pair with frame data on each character page.",
                "Who has the edge on paper when two characters meet (相性). Row into column. Pair with frame data on each character page.",
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
            if old in text:
                text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(str(path.relative_to(ROOT)))

    if not changed:
        print("[skip] 相性 labels already applied")
        return 0

    print("[done] 相性 labels:", ", ".join(changed))

    git("add", *changed, "scripts/fix-affinity-labels.py", "scripts/meta-loop-tick.py")
    commit = git("commit", "-m", "Use CHARACTER 相性 in nav to avoid 対戦 mistranslation")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
