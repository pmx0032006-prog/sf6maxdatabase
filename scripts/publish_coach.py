"""Commit and push only the SF6 coaching page. Uses Ollama Qwen for the commit message."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODEL = "qwen2.5:7b"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"
FILES = [
    "src/app/coach/page.tsx",
    "src/app/sitemap.ts",
    "src/components/SiteHeader.tsx",
    "src/components/SiteFooter.tsx",
    "scripts/owen_coach_now.py",
    "scripts/publish_coach.py",
]


def ollama_commit_message() -> str:
    prompt = (
        "English git commit subject only. One line. No quotes. "
        "Add public /coach SF6 coaching page with Arabic+English copy and Snapchat CTA."
    )
    body = json.dumps(
        {"model": MODEL, "prompt": prompt, "stream": False, "options": {"temperature": 0.1}},
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:11434/api/generate",
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        text = (json.loads(res.read().decode("utf-8")).get("response") or "").strip()
    line = text.splitlines()[0].strip().strip('"').strip("'")
    return line[:72] or "Add public SF6 coaching page with Snapchat booking"


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    print(">>>", " ".join(args), flush=True)
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return subprocess.run(
        args, cwd=ROOT, text=True, encoding="utf-8", errors="replace", env=env
    )


def main() -> int:
    os.chdir(ROOT)
    msg = ollama_commit_message()
    print("[commit message]", msg, flush=True)
    add = ["git", "add", "--"] + FILES
    if run(add).returncode != 0:
        return 1
    commit = run(["git", "commit", "-m", msg])
    if commit.returncode != 0:
        return commit.returncode
    push = run(["git", "push", "origin", "HEAD"])
    return push.returncode


if __name__ == "__main__":
    raise SystemExit(main())
