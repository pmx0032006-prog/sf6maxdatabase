#!/usr/bin/env python3
"""Loop tick: apply affiliate patch, commit/push if needed, report status."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ABOUT = ROOT / "src" / "app" / "about" / "page.tsx"
ADD_SCRIPT = ROOT / "scripts" / "add-amazon-affiliate.py"
PUSH_SCRIPT = ROOT / "scripts" / "push_to_github.py"
MARKER = 'id: "affiliate"'
TAG = "sf6maxdatabas-20"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return env


def run_py(script: Path) -> int:
    result = subprocess.run(
        [sys.executable, str(script)],
        cwd=ROOT,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.stdout:
        print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    return result.returncode


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
    status: dict[str, object] = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "local_ok": False,
        "committed": False,
        "dirty": False,
        "pushed_hint": "",
    }

    if ADD_SCRIPT.is_file():
        run_py(ADD_SCRIPT)

    text = ABOUT.read_text(encoding="utf-8") if ABOUT.is_file() else ""
    local_ok = MARKER in text and TAG in text
    status["local_ok"] = local_ok

    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    status["dirty"] = dirty

    about_dirty = any(
        line.endswith("about/page.tsx") or "about/page.tsx" in line
        for line in porcelain.stdout.splitlines()
    )

    if local_ok and about_dirty:
        add = git("add", "src/app/about/page.tsx")
        if add.returncode != 0:
            print(add.stderr, file=sys.stderr)
        commit = git(
            "commit",
            "-m",
            "Add Amazon affiliate disclosure and SF6 link to About page",
        )
        if commit.returncode == 0:
            print("[done] committed about page")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            status["dirty"] = dirty

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")
    status["committed"] = local_ok and not about_dirty

    if local_ok and unpushed and PUSH_SCRIPT.is_file():
        code = run_py(PUSH_SCRIPT)
        if code == 0:
            status["pushed_hint"] = "push attempted"
            unpushed = False

    all_ok = local_ok and not dirty and not unpushed
    status["all_ok"] = all_ok

    print("AFFILIATE_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("AFFILIATE_LOOP_OK")
        return 0
    print("AFFILIATE_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
