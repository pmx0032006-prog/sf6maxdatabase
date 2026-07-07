#!/usr/bin/env python3
"""Upgrade home hero meta links with card-style HomeMetaLinks component."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "app" / "page.tsx"
COMP = ROOT / "src" / "components" / "HomeMetaLinks.tsx"
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
    <div className="grid w-full gap-2.5 sm:grid-cols-2 lg:w-auto lg:min-w-[18rem] lg:max-w-[22rem] lg:gap-3">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative block overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-[0_8px_32px_rgba(0,179,104,0.28)] sm:min-h-[5.5rem]"
          translate="no"
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition duration-300 group-hover:bg-accent/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent/80 to-transparent transition-all duration-300 group-hover:w-full"
            aria-hidden
          />
          <p className="text-[9px] font-bold tracking-[0.3em] text-accent/85">{item.badge}</p>
          <p className="mt-1 font-display text-xl font-black leading-none tracking-tight text-white sm:text-[1.35rem]">
            {item.title}
          </p>
          <p className="mt-1.5 text-[10px] leading-snug text-white/45">{item.desc}</p>
          <span
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-sm text-white/60 transition duration-300 group-hover:border-accent/70 group-hover:bg-accent/15 group-hover:text-accent"
            aria-hidden
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
'''

OLD_IMPORT = '''import Link from "next/link";
import { CharacterGrid } from "@/components/CharacterGrid";'''

NEW_IMPORT = '''import { CharacterGrid } from "@/components/CharacterGrid";
import { HomeMetaLinks } from "@/components/HomeMetaLinks";'''

OLD_HERO_RIGHT = '''          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:flex-col lg:items-end lg:gap-2">
            <Link
              href="/tier"
              className="font-display text-2xl font-black tracking-tight text-white transition hover:text-accent sm:text-3xl"
              translate="no"
            >
              キャラランク →
            </Link>
            <Link
              href="/matchups"
              className="font-display text-2xl font-black tracking-tight text-accent transition hover:text-white sm:text-3xl"
              translate="no"
            >
              キャラ相性 →
            </Link>
          </div>'''

NEW_HERO_RIGHT = '''          <div className="min-w-0 lg:justify-self-end">
            <HomeMetaLinks />
          </div>'''

GLOBALS = ROOT / "src" / "app" / "globals.css"
GLOBALS_APPEND = '''
/* Home hero meta link cards */
.meta-hero-card {
  backdrop-filter: blur(6px);
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
    text = PAGE.read_text(encoding="utf-8")
    if OLD_HERO_RIGHT not in text or OLD_IMPORT not in text:
        print("[error] page.tsx pattern not found", file=sys.stderr)
        return 1
    PAGE.write_text(
        text.replace(OLD_IMPORT, NEW_IMPORT, 1).replace(OLD_HERO_RIGHT, NEW_HERO_RIGHT, 1),
        encoding="utf-8",
    )
    g = GLOBALS.read_text(encoding="utf-8")
    if ".meta-hero-card" not in g:
        GLOBALS.write_text(g.rstrip() + GLOBALS_APPEND, encoding="utf-8")

    print("[done] HomeMetaLinks card design applied")

    git(
        "add",
        "src/components/HomeMetaLinks.tsx",
        "src/app/page.tsx",
        "src/app/globals.css",
        "scripts/patch-home-meta-hero-design.py",
    )
    commit = git("commit", "-m", "Upgrade home hero meta links with card design")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
