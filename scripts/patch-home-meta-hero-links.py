#!/usr/bin/env python3
"""Replace home hero 名簿 block with big キャラランク / キャラ相性 links."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "app" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

OLD_IMPORT = 'import { CharacterGrid } from "@/components/CharacterGrid";'
NEW_IMPORT = '''import Link from "next/link";
import { CharacterGrid } from "@/components/CharacterGrid";'''

OLD_HERO_RIGHT = '''          <div className="min-w-0 border-l-0 border-accent pl-0 sm:border-l-4 sm:pl-4 lg:text-right">
            <h2
              className="text-sm font-semibold tracking-[0.2em] text-accent uppercase"
              translate="no"
            >
              名簿
            </h2>
            <p className="mt-1 text-[11px] leading-snug text-white/55 sm:text-xs">
              フレームデータとヒットボックス画像を表示するキャラクターを選択
            </p>
          </div>'''

NEW_HERO_RIGHT = '''          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:flex-col lg:items-end lg:gap-2">
            <Link
              href="/tier"
              className="font-display text-2xl font-black tracking-tight text-white transition hover:text-accent sm:text-3xl"
              translate="no"
            >
              キャラランク →
            </Link>
            <Link
              href="/matchups"
              className="font-display text-2xl font-black tracking-tight text-accent transition hover:text-white sm:text-3xl"
              translate="no"
            >
              キャラ相性 →
            </Link>
          </div>'''


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
    text = PAGE.read_text(encoding="utf-8")
    if OLD_HERO_RIGHT not in text:
        print("[error] hero right block not found", file=sys.stderr)
        return 1
    if OLD_IMPORT not in text:
        print("[error] import block not found", file=sys.stderr)
        return 1
    text = text.replace(OLD_IMPORT, NEW_IMPORT, 1).replace(OLD_HERO_RIGHT, NEW_HERO_RIGHT, 1)
    PAGE.write_text(text, encoding="utf-8")
    print("[done] home hero -> キャラランク / キャラ相性 links")

    git("add", "src/app/page.tsx", "scripts/patch-home-meta-hero-links.py")
    commit = git("commit", "-m", "Replace roster label with big tier/matchup links on home")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
