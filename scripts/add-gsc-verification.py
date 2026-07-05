#!/usr/bin/env python3
"""Copy Google Search Console HTML verification file into public/ and push."""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUSH = ROOT / "scripts" / "push_to_github.py"
FILENAME = "googlede03f6b47dc1b6f4.html"
DEST = ROOT / "public" / FILENAME
SEARCH_DIRS = [
    Path.home() / "Downloads",
    Path.home() / "Desktop",
    ROOT,
]
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return env


def find_source() -> Path | None:
    for directory in SEARCH_DIRS:
        candidate = directory / FILENAME
        if candidate.is_file():
            return candidate
    return None


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
    source = find_source()
    if source is None:
        print(f"[error] {FILENAME} not found in Downloads, Desktop, or project root")
        return 1

    DEST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, DEST)
    print(f"[done] copied {source} -> {DEST}")

    git("add", f"public/{FILENAME}", "scripts/add-gsc-verification.py")
    status = git("status", "--porcelain")
    if not status.stdout.strip():
        print("[info] already committed")
        return 0

    commit = git("commit", "-m", "Add Google Search Console ownership verification file")
    if commit.returncode != 0:
        print(commit.stderr or commit.stdout, file=sys.stderr)
        return commit.returncode
    print("[done] committed")

    if PUSH.is_file():
        result = subprocess.run([sys.executable, str(PUSH)], cwd=ROOT)
        return result.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
