#!/usr/bin/env python3
"""Add HomeMetaSummary band to hero center (S+ / 30 chars / 870 matchups)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "app" / "page.tsx"
COMP = ROOT / "src" / "components" / "HomeMetaSummary.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''import Link from "next/link";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_UPDATED, TIERS } from "@/data/character-meta";

const stats = () => {
  const sPlusSlug = TIERS["S+"][0];
  const sPlus = roster.find((c) => c.slug === sPlusSlug);
  const chars = roster.length;
  const cells = MATCHUP_CORE.length * (MATCHUP_CORE.length - 1);
  return { sPlus, chars, cells };
};

export function HomeMetaSummary() {
  const { sPlus, chars, cells } = stats();

  const items = [
    {
      href: "/tier",
      kicker: "S+",
      value: sPlus?.ja ?? "舞",
      note: "最強枠",
    },
    {
      href: "/tier",
      kicker: "ROSTER",
      value: String(chars),
      note: "キャラ",
    },
    {
      href: "/matchups",
      kicker: "GRID",
      value: String(cells),
      note: "相性マス",
    },
    {
      href: "/tier",
      kicker: "META",
      value: META_UPDATED,
      note: "更新",
      muted: true,
    },
  ] as const;

  return (
    <div
      className="meta-summary-band flex flex-wrap items-stretch justify-center gap-1.5 sm:gap-2 lg:justify-center"
      aria-label="メタデータ概要"
    >
      {items.map((item) => (
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
          >
            {item.value}
          </span>
          <span className="mt-1 text-[8px] leading-none text-white/40 sm:text-[9px]">{item.note}</span>
        </Link>
      ))}
    </div>
  );
}
'''

OLD_PAGE_IMPORT = 'import { HomeMetaLinks } from "@/components/HomeMetaLinks";'
NEW_PAGE_IMPORT = '''import { HomeMetaLinks } from "@/components/HomeMetaLinks";
import { HomeMetaSummary } from "@/components/HomeMetaSummary";'''

OLD_HERO = '''      <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2.5 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:items-end lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,21rem)]">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
              Street Fighter 6
            </p>
            <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl">
              MAX <span className="text-accent">DATABASE</span>
            </h1>
            <p className="mt-1 max-w-xl text-[11px] leading-snug text-white/55 sm:text-xs">
              {siteTagline}
            </p>
          </div>

          <div className="min-w-0 lg:justify-self-end">
            <HomeMetaLinks />
          </div>
        </div>
      </section>'''

NEW_HERO = '''      <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-2.5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,19rem)] lg:gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,21rem)] xl:gap-5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
              Street Fighter 6
            </p>
            <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl">
              MAX <span className="text-accent">DATABASE</span>
            </h1>
            <p className="mt-1 max-w-xl text-[11px] leading-snug text-white/55 sm:text-xs">
              {siteTagline}
            </p>
          </div>

          <div className="min-w-0 lg:px-1">
            <HomeMetaSummary />
          </div>

          <div className="min-w-0 lg:justify-self-end">
            <HomeMetaLinks />
          </div>
        </div>
      </section>'''

GLOBALS_APPEND = '''
.meta-summary-chip {
  backdrop-filter: blur(8px);
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
    if OLD_HERO not in page or OLD_PAGE_IMPORT not in page:
        print("[error] page.tsx pattern not found", file=sys.stderr)
        return 1
    page = page.replace(OLD_PAGE_IMPORT, NEW_PAGE_IMPORT, 1).replace(OLD_HERO, NEW_HERO, 1)
    PAGE.write_text(page, encoding="utf-8")

    gpath = ROOT / "src" / "app" / "globals.css"
    g = gpath.read_text(encoding="utf-8")
    if ".meta-summary-chip" not in g:
        gpath.write_text(g.rstrip() + GLOBALS_APPEND, encoding="utf-8")

    print("[done] HomeMetaSummary band added to hero")

    git(
        "add",
        "src/components/HomeMetaSummary.tsx",
        "src/app/page.tsx",
        "src/app/globals.css",
        "scripts/patch-home-meta-summary.py",
    )
    commit = git("commit", "-m", "Add meta summary band to home hero")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
