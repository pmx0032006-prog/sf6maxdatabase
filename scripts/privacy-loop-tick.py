#!/usr/bin/env python3
"""Loop tick: apply privacy policy, verify locally, commit/push, report status."""
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
PRIVACY_PAGE = ROOT / "src" / "app" / "privacy" / "page.tsx"
FOOTER = ROOT / "src" / "components" / "SiteFooter.tsx"
ADD_SCRIPT = ROOT / "scripts" / "add-privacy-policy.py"
PUSH_SCRIPT = ROOT / "scripts" / "push_to_github.py"
MARKER = 'id: "overview"'
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


def localhost_ok() -> bool:
    try:
        with urllib.request.urlopen("http://localhost:3000/privacy", timeout=5) as resp:
            html = resp.read().decode("utf-8", errors="replace")
            return resp.status == 200 and "Privacy Policy" in html and "Google AdSense" in html
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def main() -> int:
    if ADD_SCRIPT.is_file():
        run_py(ADD_SCRIPT)

    privacy_text = PRIVACY_PAGE.read_text(encoding="utf-8") if PRIVACY_PAGE.is_file() else ""
    footer_text = FOOTER.read_text(encoding="utf-8") if FOOTER.is_file() else ""
    local_ok = (
        MARKER in privacy_text
        and "Google AdSense" in privacy_text
        and 'href="/privacy"' in footer_text
    )

    porcelain = git("status", "--porcelain")
    dirty = bool(porcelain.stdout.strip())
    privacy_dirty = any("privacy" in line or "SiteFooter.tsx" in line for line in porcelain.stdout.splitlines())

    if local_ok and privacy_dirty:
        git("add", "src/app/privacy/page.tsx", "src/components/SiteFooter.tsx", "scripts/add-privacy-policy.py", "scripts/privacy-loop-tick.py")
        commit = git("commit", "-m", "Add Privacy Policy page and footer link for AdSense readiness")
        if commit.returncode == 0:
            print("[done] committed privacy policy")
            dirty = bool(git("status", "--porcelain").stdout.strip())
            privacy_dirty = False

    ahead = git("rev-list", "--count", "@{u}..HEAD")
    unpushed = ahead.returncode == 0 and ahead.stdout.strip() not in ("", "0")

    if local_ok and unpushed and PUSH_SCRIPT.is_file():
        code = run_py(PUSH_SCRIPT)
        if code == 0:
            unpushed = False
            dirty = bool(git("status", "--porcelain").stdout.strip())

    all_ok = local_ok and not dirty and not unpushed
    status = {
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "local_ok": local_ok,
        "localhost_ok": localhost_ok(),
        "committed": local_ok and not privacy_dirty,
        "dirty": dirty,
        "all_ok": all_ok,
    }

    print("PRIVACY_LOOP_TICK", json.dumps(status, ensure_ascii=False))
    if all_ok:
        print("PRIVACY_LOOP_OK")
        return 0
    print("PRIVACY_LOOP_PENDING")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
