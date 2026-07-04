#!/usr/bin/env python3
"""Initialize git repo and push sf6_site to GitHub."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REMOTE = "https://github.com/pmx0032006-prog/sf6maxdatabase.git"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


def run(args: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    print(f">>> {' '.join(args)}", flush=True)
    result = subprocess.run(
        args,
        cwd=ROOT,
        env=env,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    if check and result.returncode != 0:
        raise subprocess.CalledProcessError(result.returncode, args, result.stdout, result.stderr)
    return result


def has_commits() -> bool:
    result = run(["git", "rev-parse", "HEAD"], check=False)
    return result.returncode == 0


def main() -> int:
    os.chdir(ROOT)
    print(f"project: {ROOT}")

    if not (ROOT / ".git").exists():
        run(["git", "init"])

    run(["git", "add", "."])

    if has_commits():
        status = run(["git", "status", "--porcelain"], check=False)
        if not status.stdout.strip():
            print("[info] no changes to commit")
        else:
            run(["git", "commit", "-m", "Update SF6 MAX DATABASE"])
    else:
        run(["git", "commit", "-m", "Initial commit: SF6 MAX DATABASE v1.0"])

    run(["git", "branch", "-M", "main"])

    remote = run(["git", "remote"], check=False)
    if "origin" in remote.stdout.split():
        run(["git", "remote", "set-url", "origin", REMOTE])
    else:
        run(["git", "remote", "add", "origin", REMOTE])

    print("[push] uploading to GitHub (may take a few minutes)...", flush=True)
    run(["git", "push", "-u", "origin", "main"])
    print("[done] pushed to", REMOTE)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as exc:
        print(f"[error] command failed: {exc}", file=sys.stderr)
        if "Authentication failed" in (exc.stderr or "") or "403" in (exc.stderr or ""):
            print(
                "\nGitHub login is required. Options:\n"
                "  1) Run: gh auth login\n"
                "  2) Or use GitHub Desktop / browser sign-in when prompted\n",
                file=sys.stderr,
            )
        raise SystemExit(2)
