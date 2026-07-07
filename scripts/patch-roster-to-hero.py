#!/usr/bin/env python3
"""Move Roster (名簿) label into hero title right area."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src" / "app" / "page.tsx"
GRID = ROOT / "src" / "components" / "CharacterGrid.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

PAGE_TSX = '''import { CharacterGrid } from "@/components/CharacterGrid";
import { FeaturesSection } from "@/components/FeaturesSection";
import { NewsSection } from "@/components/NewsSection";
import { HomeSidebar } from "@/components/HomeSidebar";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import type { Metadata } from "next";
import { siteNameFull, siteTagline, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: siteNameFull,
  description: siteTagline,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: siteNameFull,
    description: siteTagline,
    url: siteUrl,
  },
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="home" />

      <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
        <div className="mx-auto grid max-w-7xl items-end gap-3 px-4 py-2.5 sm:px-6 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-8">
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

          <div className="min-w-0 border-l-0 border-accent pl-0 sm:border-l-4 sm:pl-4 lg:text-right">
            <h2
              className="text-sm font-semibold tracking-[0.2em] text-accent uppercase"
              translate="no"
            >
              名簿
            </h2>
            <p className="mt-1 text-[11px] leading-snug text-white/55 sm:text-xs">
              フレームデータとヒットボックス画像を表示するキャラクターを選択
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-5">
          <div className="min-w-0 space-y-8">
            <section id="roster">
              <CharacterGrid mode="classic" characters={roster} hideHeader />
            </section>

            <FeaturesSection />
            <NewsSection />
          </div>

          <HomeSidebar />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''

GRID_TSX = '''import Link from "next/link";
import type { Character } from "@/data/characters";

type CharacterGridProps = {
  title?: string;
  subtitle?: string;
  mode: "classic" | "modern";
  characters: Character[];
  hideHeader?: boolean;
};

const modeStyles = {
  classic: {
    section: "border-accent",
    grid: "gap-3 lg:gap-4",
    cell: "rounded-xl bg-surface/90 shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]",
    name: "font-display text-xl font-bold tracking-[0.12em] sm:text-2xl",
    ja: "text-xs text-muted",
  },
  modern: {
    section: "border-accent-mint/80",
    grid: "gap-2.5 lg:gap-3",
    cell: "rounded-lg bg-[#eef8f2]/90 shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]",
    name: "font-mono text-lg font-semibold tracking-[0.18em] sm:text-xl",
    ja: "text-[11px] tracking-wide text-muted/90",
  },
} as const;

export function CharacterGrid({
  title = "Roster",
  subtitle = "Pick a character for frame data and hitbox images",
  mode,
  characters,
  hideHeader = false,
}: CharacterGridProps) {
  const styles = modeStyles[mode];

  return (
    <section className={hideHeader ? "" : "space-y-5"}>
      {!hideHeader ? (
        <div
          className={`space-y-1 border-l-4 pl-4 ${styles.section} ${
            mode === "modern" ? "border-l-[3px]" : ""
          }`}
        >
          <h2
            className={`text-sm font-semibold tracking-[0.2em] uppercase ${
              mode === "modern" ? "text-accent-mint" : "text-accent"
            }`}
          >
            {title}
          </h2>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
      ) : null}

      <ul
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${styles.grid}`}
      >
        {characters.map((character) => (
          <li key={`${mode}-${character.slug}`}>
            <Link
              href={`/characters/${character.slug}?mode=${mode}`}
              className={`char-cell group relative block overflow-hidden ${
                character.thumb
                  ? `aspect-[4/3] w-full ${
                      mode === "classic"
                        ? "rounded-xl shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]"
                        : "rounded-lg shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]"
                    }`
                  : styles.cell
              }`}
            >
              {character.thumb ? (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[inherit] bg-[#0d1210] bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${character.thumb})`,
                      backgroundPosition: "center top",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-transparent via-transparent to-[#0d1210]/88"
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-[inherit] ${
                      mode === "classic"
                        ? "bg-gradient-to-t from-[#0d1210]/95 via-[#0d1210]/25 to-transparent"
                        : "bg-gradient-to-t from-[#0a1410]/92 via-[#0d1812]/20 to-transparent"
                    }`}
                  />
                </>
              ) : null}
              {character.thumb ? (
                <span className="absolute inset-0 z-[1] flex flex-col items-center justify-end px-3 pb-3 pt-10">
                  <span
                    className={`char-name text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${styles.name}`}
                  >
                    {character.en}
                  </span>
                </span>
              ) : (
                <span className="relative z-[1] flex min-h-[5.5rem] flex-col items-center justify-center px-3 py-7 sm:min-h-[6.25rem]">
                  <span className={`char-name text-foreground ${styles.name}`}>
                    {character.en}
                  </span>
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
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
    PAGE.write_text(PAGE_TSX, encoding="utf-8")
    GRID.write_text(GRID_TSX, encoding="utf-8")
    print("[done] 名簿 moved to hero title right area")

    git(
        "add",
        "src/app/page.tsx",
        "src/components/CharacterGrid.tsx",
        "scripts/patch-roster-to-hero.py",
    )
    commit = git("commit", "-m", "Move roster label into hero title right area")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
