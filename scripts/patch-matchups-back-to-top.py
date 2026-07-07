#!/usr/bin/env python3
"""Add back-to-top link on matchups page footer."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

OLD_H1 = '''          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクター相性表
          </h1>'''

NEW_H1 = '''          <h1
            id="page-top"
            className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl"
            translate="no"
          >
            キャラクター相性表
          </h1>'''

OLD_FOOTER = '''          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
          </p>'''

NEW_FOOTER = '''          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
            <a href="#page-top" className="font-semibold text-muted hover:text-accent">
              上へ戻る ↑
            </a>
          </p>'''


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
    if OLD_H1 not in text or OLD_FOOTER not in text:
        print("[error] matchups page pattern not found", file=sys.stderr)
        return 1
    text = text.replace(OLD_H1, NEW_H1, 1).replace(OLD_FOOTER, NEW_FOOTER, 1)
    PAGE.write_text(text, encoding="utf-8")
    print("[done] added 上へ戻る on matchups page")

    git("add", "src/app/matchups/page.tsx", "scripts/patch-matchups-back-to-top.py")
    commit = git("commit", "-m", "Add back-to-top link on matchups page")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
