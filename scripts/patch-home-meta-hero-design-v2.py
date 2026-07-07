#!/usr/bin/env python3
"""Fix meta link line break + high-design card layout."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = ROOT / "src" / "components" / "HomeMetaLinks.tsx"
PAGE = ROOT / "src" / "app" / "page.tsx"
GLOBALS = ROOT / "src" / "app" / "globals.css"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''import Link from "next/link";

const links = [
  {
    href: "/tier",
    badge: "CHAR RANK",
    title: "キャラランク",
    desc: "30キャラ・ティア順",
  },
  {
    href: "/matchups",
    badge: "MATCHUP",
    title: "キャラ相性",
    desc: "相性表・タップでメモ",
  },
] as const;

export function HomeMetaLinks() {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-3 lg:max-w-[21rem] lg:flex-col">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border border-white/[0.12] bg-[#0d1410]/80 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_12px_40px_rgba(0,179,104,0.3)]"
          translate="no"
        >
          <div
            className="w-[3px] shrink-0 bg-gradient-to-b from-accent/30 via-accent to-accent/30 transition duration-300 group-hover:from-accent-mint/50 group-hover:via-accent-mint group-hover:to-accent-mint/50"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1 px-3.5 py-3 pr-10 sm:px-4 sm:py-3.5">
            <div
              className="pointer-events-none absolute -right-4 top-0 h-full w-24 bg-gradient-to-l from-accent/[0.07] to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <p className="text-[8px] font-bold tracking-[0.34em] text-accent/90 sm:text-[9px]">
              {item.badge}
            </p>
            <p className="meta-hero-title mt-1.5 whitespace-nowrap text-[1.05rem] font-black leading-none tracking-tight text-white sm:text-lg">
              {item.title}
            </p>
            <p className="mt-2 text-[10px] leading-snug text-white/40">{item.desc}</p>
          </div>
          <div
            className="flex w-9 shrink-0 items-center justify-center border-l border-white/[0.08] bg-white/[0.02] text-sm text-white/45 transition duration-300 group-hover:border-accent/35 group-hover:bg-accent/10 group-hover:text-accent"
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

OLD_GRID = '        <div className="mx-auto grid max-w-7xl items-end gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-8">'
NEW_GRID = '        <div className="mx-auto grid max-w-7xl items-end gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-8">'

OLD_CSS = '''/* Home hero meta link cards */
.meta-hero-card {
  backdrop-filter: blur(6px);
}
'''

NEW_CSS = '''/* Home hero meta link cards */
.meta-hero-card {
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 4px 24px rgba(0, 0, 0, 0.35);
}

.meta-hero-title {
  font-family: var(--font-geist-sans), "Hiragino Sans", "Yu Gothic UI", sans-serif;
  text-shadow: 0 0 24px rgba(0, 179, 104, 0.15);
}

.meta-hero-card:hover .meta-hero-title {
  color: #e8fff4;
  text-shadow: 0 0 28px rgba(45, 255, 184, 0.35);
}
'''


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
    if OLD_GRID in page:
        PAGE.write_text(page.replace(OLD_GRID, NEW_GRID, 1), encoding="utf-8")
    g = GLOBALS.read_text(encoding="utf-8")
    if OLD_CSS in g:
        GLOBALS.write_text(g.replace(OLD_CSS, NEW_CSS, 1), encoding="utf-8")
    elif ".meta-hero-card" in g and "meta-hero-title" not in g:
        GLOBALS.write_text(g.replace(OLD_CSS.strip(), NEW_CSS.strip(), 1), encoding="utf-8")

    print("[done] meta links: nowrap + hi-design cards")

    git(
        "add",
        "src/components/HomeMetaLinks.tsx",
        "src/app/page.tsx",
        "src/app/globals.css",
        "scripts/patch-home-meta-hero-design-v2.py",
    )
    commit = git("commit", "-m", "Fix meta link title wrap and refine hero card design")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
