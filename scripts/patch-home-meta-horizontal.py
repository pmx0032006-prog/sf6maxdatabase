#!/usr/bin/env python3
"""Home meta links: horizontal row + wider column, compact height."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = ROOT / "src" / "components" / "HomeMetaLinks.tsx"
PAGE = ROOT / "src" / "app" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''import Link from "next/link";

const links = [
  {
    href: "/tier",
    badge: "RANK",
    title: "キャラランク",
    desc: "ティア順",
  },
  {
    href: "/matchups",
    badge: "相性",
    title: "キャラ相性",
    desc: "相性表",
  },
] as const;

export function HomeMetaLinks() {
  return (
    <div className="flex w-full flex-row items-stretch gap-2 sm:gap-2.5">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative flex min-w-[7.75rem] flex-1 items-stretch overflow-hidden rounded-md border border-white/[0.12] bg-[#0d1410]/80 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_12px_40px_rgba(0,179,104,0.3)] sm:min-w-[9rem]"
          translate="no"
        >
          <div
            className="w-[3px] shrink-0 bg-gradient-to-b from-accent/30 via-accent to-accent/30 transition duration-300 group-hover:from-accent-mint/50 group-hover:via-accent-mint group-hover:to-accent-mint/50"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1 px-2.5 py-2 pr-8 sm:px-3 sm:py-2.5 sm:pr-9">
            <p className="text-[7px] font-bold tracking-[0.28em] text-accent/90 sm:text-[8px]">
              {item.badge}
            </p>
            <p className="meta-hero-title mt-1 whitespace-nowrap text-[0.9rem] font-black leading-none tracking-tight text-white sm:text-[0.95rem]">
              {item.title}
            </p>
            <p className="mt-1 hidden text-[9px] leading-none text-white/40 sm:block">{item.desc}</p>
          </div>
          <div
            className="flex w-7 shrink-0 items-center justify-center border-l border-white/[0.08] bg-white/[0.02] text-xs text-white/45 transition duration-300 group-hover:border-accent/35 group-hover:bg-accent/10 group-hover:text-accent sm:w-8 sm:text-sm"
            aria-hidden
          >
            →
          </div>
        </Link>
      ))}
    </div>
  );
}
'''

OLD_GRID = '        <div className="mx-auto grid max-w-7xl items-end gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-8">'
NEW_GRID = '        <div className="mx-auto grid max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:items-end lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)]">'


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
    COMP.write_text(COMP_TSX, encoding="utf-8")
    page = PAGE.read_text(encoding="utf-8")
    if OLD_GRID not in page:
        print("[error] page grid not found", file=sys.stderr)
        return 1
    PAGE.write_text(page.replace(OLD_GRID, NEW_GRID, 1), encoding="utf-8")
    print("[done] meta links horizontal + compact hero")

    git(
        "add",
        "src/components/HomeMetaLinks.tsx",
        "src/app/page.tsx",
        "scripts/patch-home-meta-horizontal.py",
    )
    commit = git("commit", "-m", "Layout meta links side by side with compact hero")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
