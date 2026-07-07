#!/usr/bin/env python3
"""Split combined /meta into /tier and /matchups pages."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIER_PAGE = ROOT / "src" / "app" / "tier" / "page.tsx"
MATCHUPS_PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
META_PAGE = ROOT / "src" / "app" / "meta" / "page.tsx"
HEADER = ROOT / "src" / "components" / "SiteHeader.tsx"
SIDEBAR = ROOT / "src" / "components" / "HomeSidebar.tsx"
SITEMAP = ROOT / "src" / "app" / "sitemap.ts"
TIER_BAND = ROOT / "src" / "components" / "TierBand.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Tier List | ${siteName}`,
  description: "Community SF6 character tier list snapshot with links to frame data.",
  alternates: { canonical: `${siteUrl}/tier` },
};

export default function TierPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="tier" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Character Tier List
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Community snapshot for quick research. Open any character for frame data and hitboxes.
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Last updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div key={tier} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <p className="text-lg font-black text-foreground">Tier {tier}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {TIERS[tier].map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                        >
                          {char.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/matchups" className="font-semibold text-accent hover:text-accent-hover">
              Matchup chart →
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← Back to roster
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''

MATCHUPS_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import {
  MATCHUP_CORE,
  MATCHUP_LABELS,
  MATCHUPS,
  META_DISCLAIMER,
  META_UPDATED,
  type MatchupRating,
} from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Matchup Chart | ${siteName}`,
  description: "Community SF6 matchup chart snapshot for core characters.",
  alternates: { canonical: `${siteUrl}/matchups` },
};

function ratingClass(rating: MatchupRating): string {
  if (rating === "++") return "bg-emerald-500/20 text-emerald-700";
  if (rating === "+") return "bg-accent/15 text-accent";
  if (rating === "=") return "bg-surface text-muted";
  if (rating === "-") return "bg-orange-500/15 text-orange-700";
  return "bg-red-500/15 text-red-700";
}

export default function MatchupsPage() {
  const coreChars = MATCHUP_CORE.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="matchups" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Matchup Chart
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Row vs column for 10 core characters. Pair with frame data on each character page.
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Last updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            ++ strong / + slight edge / = even / - slight deficit / -- tough
          </p>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
            <table className="min-w-full border-collapse text-center text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="sticky left-0 z-10 bg-background px-2 py-2 text-left font-bold">
                    vs
                  </th>
                  {coreChars.map((col) => (
                    <th key={col.slug} className="px-2 py-2 font-bold">
                      <Link href={`/characters/${col.slug}`} className="hover:text-accent">
                        {col.en}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coreChars.map((row) => (
                  <tr key={row.slug} className="border-b border-border/70 last:border-0">
                    <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-bold">
                      <Link href={`/characters/${row.slug}`} className="hover:text-accent">
                        {row.en}
                      </Link>
                    </th>
                    {coreChars.map((col) => {
                      if (row.slug === col.slug) {
                        return (
                          <td key={col.slug} className="px-2 py-2 text-muted">
                            —
                          </td>
                        );
                      }
                      const rating = MATCHUPS[row.slug]?.[col.slug] ?? ("=" as MatchupRating);
                      return (
                        <td key={col.slug} className="px-2 py-2">
                          <span
                            className={`inline-block min-w-[2rem] rounded px-1.5 py-0.5 font-bold ${ratingClass(rating)}`}
                            title={MATCHUP_LABELS[rating]}
                          >
                            {rating}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← Tier list
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              Back to roster
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''

META_REDIRECT_TSX = '''import { redirect } from "next/navigation";

export default function MetaRedirectPage() {
  redirect("/tier");
}
'''

HEADER_TSX = '''import Link from "next/link";
import { siteName } from "@/lib/site";

type SiteHeaderProps = {
  active?: "home" | "characters" | "tier" | "matchups" | "about";
};

const navItems = [
  { href: "/", label: "TOP", key: "home" as const },
  { href: "/characters", label: "CHARACTERS", key: "characters" as const },
  { href: "/tier", label: "TIER", key: "tier" as const },
  { href: "/matchups", label: "MATCHUPS", key: "matchups" as const },
  { href: "/about", label: "ABOUT", key: "about" as const },
  { href: "/#news", label: "NEWS", key: null },
];

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-accent/40 bg-[#0a0f0c] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-10 sm:py-2.5">
        <Link href="/" className="group min-w-0 shrink leading-tight">
          <p className="text-[9px] font-bold tracking-[0.28em] text-accent sm:text-[10px]">
            STREET FIGHTER 6
          </p>
          <p className="truncate font-display text-sm font-bold tracking-[0.1em] text-white group-hover:text-accent sm:text-base">
            {siteName.replace("SF6 ", "")}
          </p>
        </Link>

        <nav
          className="hidden items-center gap-0 text-[9px] font-bold tracking-[0.18em] sm:flex sm:text-[10px]"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <span key={item.href} className="flex items-center">
              {index > 0 ? (
                <span className="mx-3 h-3 w-px bg-white/20" aria-hidden />
              ) : null}
              <Link
                href={item.href}
                className={
                  active && item.key === active
                    ? "text-accent"
                    : "text-white/75 hover:text-accent"
                }
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <nav
          className="flex items-center gap-2 text-[9px] font-bold tracking-[0.14em] sm:hidden"
          aria-label="Mobile navigation"
        >
          <Link href="/" className={active === "home" ? "text-accent" : "text-white/75"}>
            TOP
          </Link>
          <Link
            href="/characters"
            className={active === "characters" ? "text-accent" : "text-white/75"}
          >
            CHARA
          </Link>
          <Link href="/tier" className={active === "tier" ? "text-accent" : "text-white/75"}>
            TIER
          </Link>
          <Link
            href="/matchups"
            className={active === "matchups" ? "text-accent" : "text-white/75"}
          >
            MATCH
          </Link>
        </nav>
      </div>
    </header>
  );
}
'''

SIDEBAR_PATCH_OLD = '''      <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Meta
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Community tier list &amp; matchup chart ({META_UPDATED})
        </p>
        <Link
          href="/meta"
          className="mt-2 block rounded-md border border-accent/25 bg-accent-soft/30 px-3 py-2 text-center text-[11px] font-bold text-accent hover:border-accent hover:bg-accent-soft"
        >
          Tier + Matchups →
        </Link>
      </section>'''

SIDEBAR_PATCH_NEW = '''      <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Meta
        </p>
        <p className="mt-1 text-[11px] leading-snug text-muted">
          Community snapshot ({META_UPDATED})
        </p>
        <div className="mt-2 flex flex-col gap-1.5">
          <Link
            href="/tier"
            className="block rounded-md border border-accent/25 bg-accent-soft/30 px-3 py-2 text-center text-[11px] font-bold text-accent hover:border-accent hover:bg-accent-soft"
          >
            Tier List →
          </Link>
          <Link
            href="/matchups"
            className="block rounded-md border border-accent/25 bg-accent-soft/30 px-3 py-2 text-center text-[11px] font-bold text-accent hover:border-accent hover:bg-accent-soft"
          >
            Matchups →
          </Link>
        </div>
      </section>'''


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
    TIER_PAGE.parent.mkdir(parents=True, exist_ok=True)
    MATCHUPS_PAGE.parent.mkdir(parents=True, exist_ok=True)
    TIER_PAGE.write_text(TIER_PAGE_TSX, encoding="utf-8")
    MATCHUPS_PAGE.write_text(MATCHUPS_PAGE_TSX, encoding="utf-8")
    META_PAGE.write_text(META_REDIRECT_TSX, encoding="utf-8")
    HEADER.write_text(HEADER_TSX, encoding="utf-8")

    sidebar = SIDEBAR.read_text(encoding="utf-8")
    if SIDEBAR_PATCH_OLD in sidebar:
        sidebar = sidebar.replace(SIDEBAR_PATCH_OLD, SIDEBAR_PATCH_NEW, 1)
    SIDEBAR.write_text(sidebar, encoding="utf-8")

    sitemap = SITEMAP.read_text(encoding="utf-8")
    sitemap = sitemap.replace(
        'const staticRoutes = ["", "/characters", "/meta", "/about", "/privacy"];',
        'const staticRoutes = ["", "/characters", "/tier", "/matchups", "/about", "/privacy"];',
    )
    SITEMAP.write_text(sitemap, encoding="utf-8")

    if TIER_BAND.is_file():
        band = TIER_BAND.read_text(encoding="utf-8")
        band = band.replace('href="/meta"', 'href="/tier"')
        band = band.replace("Full tiers + matchups →", "Full tier list →")
        TIER_BAND.write_text(band, encoding="utf-8")

    print("[done] split /tier and /matchups ( /meta redirects to /tier )")

    git(
        "add",
        "src/app/tier/page.tsx",
        "src/app/matchups/page.tsx",
        "src/app/meta/page.tsx",
        "src/components/SiteHeader.tsx",
        "src/components/HomeSidebar.tsx",
        "src/app/sitemap.ts",
        "scripts/split-meta-pages.py",
        "scripts/meta-loop-tick.py",
    )
    if TIER_BAND.is_file():
        git("add", "src/components/TierBand.tsx")

    commit = git("commit", "-m", "Split tier list and matchup chart into separate pages")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
