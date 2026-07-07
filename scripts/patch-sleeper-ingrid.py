#!/usr/bin/env python3
"""SLEEPER chip: Alex -> Ingrid (Alex is meta-strong now)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "src" / "components" / "HomeMetaSummary.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

OLD = '''    {
      href: "/characters/alex",
      kicker: "SLEEPER",
      value: "ALEX",
      note: "Underdogs win too",
    },'''

NEW = '''    {
      href: "/characters/ingrid",
      kicker: "SLEEPER",
      value: "INGRID",
      note: "Still sleeping on her?",
    },'''


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
    text = TARGET.read_text(encoding="utf-8")
    if OLD not in text:
        if NEW.splitlines()[1].strip() in text:
            print("[skip] sleeper already INGRID")
            return 0
        raise SystemExit("[error] HomeMetaSummary sleeper block not found")
    TARGET.write_text(text.replace(OLD, NEW, 1), encoding="utf-8")
    print("[done] SLEEPER: ALEX -> INGRID")

    git("add", "src/components/HomeMetaSummary.tsx", "scripts/patch-sleeper-ingrid.py")
    commit = git("commit", "-m", "Hero SLEEPER chip: Ingrid instead of Alex")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
