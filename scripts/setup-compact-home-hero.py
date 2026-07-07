#!/usr/bin/env python3
"""Home hero: fill right-side void with featured character thumbs; less vertical waste."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HERO = ROOT / "src" / "components" / "HomeHero.tsx"
PAGE = ROOT / "src" / "app" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

HERO_TSX = '''import Link from "next/link";
import { roster } from "@/data/characters";
import { siteTagline } from "@/lib/site";

const FEATURED_SLUGS = ["ryu", "ken", "luke", "juri", "chun-li", "aki"] as const;

export function HomeHero() {
  const featured = FEATURED_SLUGS.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-10 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
            Street Fighter 6
          </p>
          <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl lg:text-3xl">
            MAX <span className="text-accent">DATABASE</span>
          </h1>
          <p className="mt-1 max-w-lg text-[11px] leading-snug text-white/55 sm:text-xs">
            {siteTagline}
          </p>
        </div>

        <ul
          className="grid grid-cols-3 gap-1.5 sm:gap-2"
          aria-label="Featured characters"
        >
          {featured.map((character) => (
            <li key={character.slug}>
              <Link
                href={`/characters/${character.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#0d1210] shadow-sm transition hover:border-accent/50 hover:shadow-[0_0_12px_rgba(0,179,104,0.2)]"
              >
                {character.thumb ? (
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-no-repeat transition duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${character.thumb})`,
                      backgroundPosition: "center top",
                    }}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] font-bold text-white/40">
                    {character.en}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1 text-[8px] font-bold tracking-wide text-white/90 sm:text-[9px]">
                  {character.en}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
'''

PAGE_IMPORT_OLD = 'import { PageMasthead } from "@/components/PageMasthead";\n'
PAGE_IMPORT_NEW = 'import { HomeHero } from "@/components/HomeHero";\n'

PAGE_BLOCK_OLD = """        <PageMasthead
          eyebrow="Street Fighter 6"
          title="MAX"
          titleAccent="DATABASE"
          subtitle={siteTagline}
          compact
        />

"""

PAGE_BLOCK_NEW = "        <HomeHero />\n\n"


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
    HERO.write_text(HERO_TSX, encoding="utf-8")
    print(f"[done] wrote {HERO.relative_to(ROOT)}")

    page = PAGE.read_text(encoding="utf-8")
    if PAGE_IMPORT_OLD in page:
        page = page.replace(PAGE_IMPORT_OLD, PAGE_IMPORT_NEW, 1)
    elif 'import { HomeHero }' not in page:
        print("[error] page.tsx import anchor not found")
        return 1

    if PAGE_BLOCK_OLD in page:
        page = page.replace(PAGE_BLOCK_OLD, PAGE_BLOCK_NEW, 1)
    elif "<HomeHero />" not in page:
        print("[error] page.tsx masthead block not found")
        return 1

    if "siteTagline" in page and "subtitle={siteTagline}" not in page:
        page = page.replace(
            'import { siteNameFull, siteTagline, siteUrl } from "@/lib/site";',
            'import { siteNameFull, siteUrl } from "@/lib/site";',
            1,
        )

    PAGE.write_text(page, encoding="utf-8")
    print(f"[done] patched {PAGE.relative_to(ROOT)}")

    git("add", "src/components/HomeHero.tsx", "src/app/page.tsx", "scripts/setup-compact-home-hero.py")
    commit = git("commit", "-m", "Balance home hero with featured character grid on the right")
    if commit.returncode == 0:
        print("[done] committed")
        if PUSH.is_file():
            subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    else:
        print("[info] nothing new to commit")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
