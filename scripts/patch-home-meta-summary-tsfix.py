#!/usr/bin/env python3
"""Fix HomeMetaSummary TypeScript muted property error."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = ROOT / "src" / "components" / "HomeMetaSummary.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

OLD = '''      {items.map((item) => (
        <Link
          key={item.kicker}
          href={item.href}
          className={`meta-summary-chip group flex min-w-[4.5rem] flex-col rounded-md border px-2.5 py-2 transition duration-300 hover:-translate-y-0.5 sm:min-w-[5rem] sm:px-3 ${
            item.muted
              ? "border-white/8 bg-white/[0.03] hover:border-white/20"
              : "border-accent/25 bg-accent/[0.06] hover:border-accent/50 hover:bg-accent/[0.12] hover:shadow-[0_0_20px_rgba(0,179,104,0.2)]"
          }`}
          translate="no"
        >
          <span className="text-[7px] font-bold tracking-[0.26em] text-accent/80 sm:text-[8px]">
            {item.kicker}
          </span>
          <span
            className={`mt-0.5 font-display text-base font-black leading-none sm:text-lg ${
              item.muted ? "text-white/55" : "text-white group-hover:text-accent-mint"
            }`}
          >'''

NEW = '''      {items.map((item) => {
        const muted = "muted" in item && item.muted;
        return (
        <Link
          key={item.kicker}
          href={item.href}
          className={`meta-summary-chip group flex min-w-[4.5rem] flex-col rounded-md border px-2.5 py-2 transition duration-300 hover:-translate-y-0.5 sm:min-w-[5rem] sm:px-3 ${
            muted
              ? "border-white/8 bg-white/[0.03] hover:border-white/20"
              : "border-accent/25 bg-accent/[0.06] hover:border-accent/50 hover:bg-accent/[0.12] hover:shadow-[0_0_20px_rgba(0,179,104,0.2)]"
          }`}
          translate="no"
        >
          <span className="text-[7px] font-bold tracking-[0.26em] text-accent/80 sm:text-[8px]">
            {item.kicker}
          </span>
          <span
            className={`mt-0.5 font-display text-base font-black leading-none sm:text-lg ${
              muted ? "text-white/55" : "text-white group-hover:text-accent-mint"
            }`}
          >'''

OLD_END = '''        </Link>
      ))}'''

NEW_END = '''        </Link>
        );
      })}'''


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
    text = COMP.read_text(encoding="utf-8")
    if OLD not in text or OLD_END not in text:
        print("[error] HomeMetaSummary pattern not found", file=sys.stderr)
        return 1
    COMP.write_text(text.replace(OLD, NEW, 1).replace(OLD_END, NEW_END, 1), encoding="utf-8")
    print("[done] HomeMetaSummary TS fix applied")

    git("add", "src/components/HomeMetaSummary.tsx", "scripts/patch-home-meta-summary-tsfix.py")
    commit = git("commit", "-m", "Fix HomeMetaSummary TypeScript build error")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
