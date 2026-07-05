#!/usr/bin/env python3
"""Loop tick: ensure SEO basics exist, verify endpoints, commit/push."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SETUP = ROOT / "scripts" / "setup-seo-basics.py"
PUSH = ROOT / "scripts" / "push_to_github.py"
SITEMAP = ROOT / "src" / "app" / "sitemap.ts"
ROBOTS = ROOT / "src" / "app" / "robots.ts"
LAYOUT = ROOT / "src" / "app" / "layout.tsx"
AUTHOR_NAME = "pmx0032006-prog"
AUTHOR_EMAIL = "pmx0032006@gmail.com"


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", AUTHOR_NAME)
    env.setdefault("GIT_AUTHOR_EMAIL", AUTHOR_EMAIL)
    env.setdefault("GIT_COMMITTER_NAME", AUTHOR_NAME)
    env.setdefault("GIT_COMMITTER_EMAIL", AUTHOR_EMAIL)
    return env


def run_py(path: Path) -> int:
    result = subprocess.run(
        [sys.executable, str(path)],
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


def fetch_ok(url: str, needles: list[str]) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=12) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status == 200 and all(n in body for n in needles)
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def main() -> int:
    if SETUP.is_file():
        run_py(SETUP)

    layout = LAYOUT.read_text(encoding="utf-8") if LAYOUT.is_file() else ""
    local_ok = (
        SITEMAP.is_file()
        and ROBOTS.is_file()
        and "metadataBase" in layout
        and "openGraph" in layout
    )

    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    seo_dirty = any(
        "sitemap" in line or "robots" in line or "layout.tsx" in line or "setup-seo" in line
        for line in porcelain.stdout.splitlines()
    )

    if local_ok and seo_dirty:
        git(
            "add",
            "src/app/sitemap.ts",
            "src/app/robots.ts",
            "src/app/layout.tsx",
            "src/app/page.tsx",
            "src/app/characters/[slug]/page.tsx",
            "src/lib/site.ts",
            "scripts/setup-seo-basics.py",
            "scripts/seo-loop-tick.py",
        )
        commit = git("commit", "-m", "Add SEO basics: sitemap, robots, OG, canonical, rich metadata")
        if commit.returncode == 0:
            print("[done] committed SEO changes")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            seo_dirty = False

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")
    if local_ok and unpushed and PUSH.is_file():
        run_py(PUSH)
        unpushed = False
        dirty = bool(git("status", "--porcelain").stdout.strip())

    live_sitemap = fetch_ok("https://www.sf6maxdatabase.com/sitemap.xml", ["/characters/"])
    live_robots = fetch_ok("https://www.sf6maxdatabase.com/robots.txt", ["sitemap"])

    all_ok = local_ok and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "local_ok": local_ok,
        "live_sitemap": live_sitemap,
        "live_robots": live_robots,
        "committed": local_ok and not seo_dirty,
        "all_ok": all_ok,
    }
    print("SEO_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("SEO_LOOP_OK")
        return 0
    print("SEO_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
