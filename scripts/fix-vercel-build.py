#!/usr/bin/env python3
"""Vercel build fix: skip local image sync/watermark on deploy (CI/Vercel only runs next build)."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "package.json"
VERCEL = ROOT / "vercel.json"
PUSH = ROOT / "scripts" / "push_to_github.py"


def main() -> int:
    pkg = json.loads(PKG.read_text(encoding="utf-8"))
    scripts = pkg.setdefault("scripts", {})
    scripts["build"] = "next build"
    scripts["build:local"] = "npm run sync:images && next build"
    PKG.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
    print("[done] package.json build -> next build (Vercel-safe)")

    vercel = {
        "buildCommand": "next build",
        "framework": "nextjs",
    }
    VERCEL.write_text(json.dumps(vercel, indent=2) + "\n", encoding="utf-8")
    print("[done] vercel.json buildCommand -> next build")

    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", "pmx0032006-prog")
    env.setdefault("GIT_AUTHOR_EMAIL", "pmx0032006@gmail.com")
    env.setdefault("GIT_COMMITTER_NAME", "pmx0032006-prog")
    env.setdefault("GIT_COMMITTER_EMAIL", "pmx0032006@gmail.com")

    subprocess.run(["git", "add", "package.json", "vercel.json", str(Path(__file__).relative_to(ROOT))], cwd=ROOT, check=True, env=env)
    r = subprocess.run(
        ["git", "commit", "-m", "Fix Vercel deploy: skip image sync/watermark on production build"],
        cwd=ROOT,
        env=env,
        capture_output=True,
        text=True,
    )
    if r.returncode == 0:
        print("[done] committed")
        if PUSH.is_file():
            subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    else:
        print("[info] commit skipped:", r.stderr.strip() or r.stdout.strip())

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
