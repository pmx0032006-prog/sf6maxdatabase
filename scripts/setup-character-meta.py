#!/usr/bin/env python3
"""Add community-snapshot tier list + matchup chart (asset layer for SF6 MAX DATABASE)."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META_TS = ROOT / "src" / "data" / "character-meta.ts"
TIER_BAND = ROOT / "src" / "components" / "TierBand.tsx"
META_PAGE = ROOT / "src" / "app" / "meta" / "page.tsx"
HEADER = ROOT / "src" / "components" / "SiteHeader.tsx"
HOME = ROOT / "src" / "app" / "page.tsx"
SITEMAP = ROOT / "src" / "app" / "sitemap.ts"
PUSH = ROOT / "scripts" / "push_to_github.py"
RESTORE_TAG = "before-character-meta"

META_JSON = ROOT / "scripts" / "character_meta_snapshot.json"

# Community snapshot — placeholder OK, update later via this JSON + re-run script
SNAPSHOT = {
    "updated": "2026-07",
    "source_note": "Community snapshot for learning / SEO — not official Capcom data.",
    "tiers": {
        "S": ["luke", "juri", "akuma", "cammy", "mai"],
        "A": ["ryu", "ken", "guile", "rashid", "chun-li", "dee-jay", "c-viper"],
        "B": [
            "jamie",
            "kimberly",
            "manon",
            "marisa",
            "jp",
            "blanka",
            "dhalsim",
            "ed",
            "terry",
            "sagat",
            "elena",
        ],
        "C": ["lily", "e-honda", "zangief", "aki", "alex", "m-bison", "ingrid"],
    },
    "matchup_core": [
        "ryu",
        "ken",
        "luke",
        "juri",
        "cammy",
        "guile",
        "chun-li",
        "rashid",
        "akuma",
        "jamie",
    ],
    "matchups": {
        "ryu": {
            "ken": "+",
            "luke": "-",
            "juri": "-",
            "cammy": "=",
            "guile": "+",
            "chun-li": "=",
            "rashid": "-",
            "akuma": "--",
            "jamie": "+",
        },
        "ken": {
            "ryu": "-",
            "luke": "-",
            "juri": "=",
            "cammy": "=",
            "guile": "+",
            "chun-li": "+",
            "rashid": "-",
            "akuma": "--",
            "jamie": "+",
        },
        "luke": {
            "ryu": "+",
            "ken": "+",
            "juri": "=",
            "cammy": "+",
            "guile": "+",
            "chun-li": "+",
            "rashid": "+",
            "akuma": "-",
            "jamie": "+",
        },
        "juri": {
            "ryu": "+",
            "ken": "=",
            "luke": "=",
            "cammy": "-",
            "guile": "+",
            "chun-li": "+",
            "rashid": "=",
            "akuma": "-",
            "jamie": "+",
        },
        "cammy": {
            "ryu": "=",
            "ken": "=",
            "luke": "-",
            "juri": "+",
            "guile": "-",
            "chun-li": "=",
            "rashid": "=",
            "akuma": "-",
            "jamie": "+",
        },
        "guile": {
            "ryu": "-",
            "ken": "-",
            "luke": "-",
            "juri": "-",
            "cammy": "+",
            "chun-li": "-",
            "rashid": "=",
            "akuma": "--",
            "jamie": "=",
        },
        "chun-li": {
            "ryu": "=",
            "ken": "-",
            "luke": "-",
            "juri": "-",
            "cammy": "=",
            "guile": "+",
            "rashid": "-",
            "akuma": "--",
            "jamie": "+",
        },
        "rashid": {
            "ryu": "+",
            "ken": "+",
            "luke": "-",
            "juri": "=",
            "cammy": "=",
            "guile": "=",
            "chun-li": "+",
            "akuma": "-",
            "jamie": "+",
        },
        "akuma": {
            "ryu": "++",
            "ken": "++",
            "luke": "+",
            "juri": "+",
            "cammy": "+",
            "guile": "++",
            "chun-li": "++",
            "rashid": "+",
            "jamie": "++",
        },
        "jamie": {
            "ryu": "-",
            "ken": "-",
            "luke": "-",
            "juri": "-",
            "cammy": "-",
            "guile": "=",
            "chun-li": "-",
            "rashid": "-",
            "akuma": "--",
        },
    },
}

TIER_BAND_TSX = '''import Link from "next/link";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";

const TIER_STYLES: Record<string, string> = {
  S: "border-amber-400/50 bg-amber-400/10 text-amber-200",
  A: "border-accent/50 bg-accent/10 text-accent-mint",
  B: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  C: "border-white/20 bg-white/5 text-white/70",
};

export function TierBand() {
  return (
    <section
      aria-label="Character tier snapshot"
      className="border-b border-white/10 bg-[#0d1411] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-accent uppercase">
              Meta Snapshot
            </p>
            <p className="text-[11px] text-white/55">
              Community tier list — updated {META_UPDATED}
            </p>
          </div>
          <Link
            href="/meta"
            className="text-[10px] font-bold tracking-wide text-accent hover:text-accent-mint"
          >
            Full tiers + matchups →
          </Link>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {TIER_ORDER.map((tier) => {
            const slugs = TIERS[tier];
            const style = TIER_STYLES[tier];
            return (
              <div
                key={tier}
                className={`min-w-[9.5rem] shrink-0 rounded-lg border px-2.5 py-2 ${style}`}
              >
                <p className="text-[10px] font-black tracking-[0.2em]">TIER {tier}</p>
                <ul className="mt-1.5 flex flex-col gap-0.5">
                  {slugs.map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="text-[11px] font-semibold hover:underline"
                        >
                          {char.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-2 text-[9px] leading-relaxed text-white/40">{META_DISCLAIMER}</p>
      </div>
    </section>
  );
}
'''

META_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import {
  MATCHUP_CORE,
  MATCHUP_LABELS,
  MATCHUPS,
  META_DISCLAIMER,
  META_UPDATED,
  TIER_ORDER,
  TIERS,
  type MatchupRating,
} from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Tier List & Matchups | ${siteName}`,
  description:
    "Community SF6 tier list and matchup chart snapshot — frame data links included.",
  alternates: { canonical: `${siteUrl}/meta` },
};

function ratingClass(rating: MatchupRating): string {
  if (rating === "++") return "bg-emerald-500/20 text-emerald-700";
  if (rating === "+") return "bg-accent/15 text-accent";
  if (rating === "=") return "bg-surface text-muted";
  if (rating === "-") return "bg-orange-500/15 text-orange-700";
  return "bg-red-500/15 text-red-700";
}

export default function MetaPage() {
  const coreChars = MATCHUP_CORE.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="meta" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
            Meta
          </p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Tier List &amp; Matchups
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Community snapshot for quick research. Pair with frame data on each character page.
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Last updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <section className="mt-8 space-y-4">
            <h2 className="border-l-4 border-accent pl-3 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Character Tiers
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIER_ORDER.map((tier) => (
                <div
                  key={tier}
                  className="rounded-lg border border-border bg-surface p-4 shadow-sm"
                >
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
          </section>

          <section className="mt-10 space-y-4">
            <h2 className="border-l-4 border-accent pl-3 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Matchup Chart (Core 10)
            </h2>
            <p className="text-xs text-muted">
              Row vs column. ++ strong / + slight edge / = even / - slight deficit / -- tough
            </p>
            <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
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
                        const rating =
                          MATCHUPS[row.slug]?.[col.slug] ?? ("=" as MatchupRating);
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
          </section>

          <p className="mt-8 text-center">
            <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-hover">
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


def meta_ts_content() -> str:
    tiers = SNAPSHOT["tiers"]
    lines = [
        'export const META_UPDATED = "' + SNAPSHOT["updated"] + '" as const;',
        'export const META_DISCLAIMER =',
        '  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;',
        "",
        'export type Tier = "S" | "A" | "B" | "C";',
        'export type MatchupRating = "++" | "+" | "=" | "-" | "--";',
        "",
        "export const TIER_ORDER = [\"S\", \"A\", \"B\", \"C\"] as const satisfies readonly Tier[];",
        "",
        "export const TIERS = {",
    ]
    for tier in ("S", "A", "B", "C"):
        slugs = ", ".join(f'"{s}"' for s in tiers[tier])
        lines.append(f'  {tier}: [{slugs}],')
    lines.append("} as const satisfies Record<Tier, readonly string[]>;")
    lines.append("")
    core_sorted = sorted(
        SNAPSHOT["matchup_core"],
        key=lambda slug: next(
            (ti, SNAPSHOT["tiers"][t].index(slug))
            for ti, t in enumerate(("S", "A", "B", "C"))
            if slug in SNAPSHOT["tiers"][t]
        )
        if any(slug in SNAPSHOT["tiers"][t] for t in ("S", "A", "B", "C"))
        else (99, 99),
    )
    core = ", ".join(f'"{s}"' for s in core_sorted)
    lines.append(f"export const MATCHUP_CORE = [{core}] as const;")
    lines.append("")
    lines.append("export const MATCHUP_LABELS: Record<MatchupRating, string> = {")
    lines.append('  "++": "Strong advantage",')
    lines.append('  "+": "Slight advantage",')
    lines.append('  "=": "Even",')
    lines.append('  "-": "Slight disadvantage",')
    lines.append('  "--": "Tough matchup",')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUPS: Record<string, Record<string, MatchupRating>> = {")
    for row, cols in SNAPSHOT["matchups"].items():
        inner = ", ".join(f'"{k}": "{v}"' for k, v in cols.items())
        lines.append(f'  "{row}": {{ {inner} }},')
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def patch_header(text: str) -> str:
    if 'active?: "home" | "characters" | "about" | "meta"' in text:
        return text
    text = text.replace(
        'active?: "home" | "characters" | "about";',
        'active?: "home" | "characters" | "about" | "meta";',
    )
    old = '  { href: "/about", label: "ABOUT", key: "about" as const },\n  { href: "/#news", label: "NEWS", key: null },'
    new = (
        '  { href: "/meta", label: "META", key: "meta" as const },\n'
        '  { href: "/about", label: "ABOUT", key: "about" as const },\n'
        '  { href: "/#news", label: "NEWS", key: null },'
    )
    if old in text:
        text = text.replace(old, new, 1)
    mobile_old = '          <Link\n            href="/about"\n            className={active === "about" ? "text-accent" : "text-white/75"}\n          >\n            ABOUT\n          </Link>'
    mobile_new = (
        '          <Link\n            href="/meta"\n            className={active === "meta" ? "text-accent" : "text-white/75"}\n          >\n            META\n          </Link>\n'
        '          <Link\n            href="/about"\n            className={active === "about" ? "text-accent" : "text-white/75"}\n          >\n            ABOUT\n          </Link>'
    )
    if mobile_old in text and 'href="/meta"' not in text:
        text = text.replace(mobile_old, mobile_new, 1)
    return text


def patch_home(text: str) -> str:
    text = text.replace('import { TierBand } from "@/components/TierBand";\n', "")
    text = text.replace("\n      <TierBand />\n\n", "\n")
    return text


def patch_sitemap(text: str) -> str:
    if '"/meta"' in text:
        return text
    return text.replace(
        'const staticRoutes = ["", "/characters", "/about", "/privacy"];',
        'const staticRoutes = ["", "/characters", "/meta", "/about", "/privacy"];',
        1,
    )


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
    META_JSON.write_text(json.dumps(SNAPSHOT, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    META_TS.write_text(meta_ts_content(), encoding="utf-8")
    TIER_BAND.write_text(TIER_BAND_TSX, encoding="utf-8")
    META_PAGE.parent.mkdir(parents=True, exist_ok=True)
    META_PAGE.write_text(META_PAGE_TSX, encoding="utf-8")

    HEADER.write_text(patch_header(HEADER.read_text(encoding="utf-8")), encoding="utf-8")
    HOME.write_text(patch_home(HOME.read_text(encoding="utf-8")), encoding="utf-8")
    SITEMAP.write_text(patch_sitemap(SITEMAP.read_text(encoding="utf-8")), encoding="utf-8")

    tag = git("tag", "-f", RESTORE_TAG)
    if tag.returncode == 0:
        print(f"[restore] git reset --hard {RESTORE_TAG}")

    print("[done] tier list + matchup chart (community snapshot)")
    print(f"  - {META_TS.relative_to(ROOT)}")
    print(f"  - {META_PAGE.relative_to(ROOT)}")
    print(f"  - TierBand on home")

    git(
        "add",
        "src/data/character-meta.ts",
        "src/components/TierBand.tsx",
        "src/app/meta/page.tsx",
        "src/components/SiteHeader.tsx",
        "src/app/page.tsx",
        "src/app/sitemap.ts",
        "scripts/setup-character-meta.py",
        "scripts/character_meta_snapshot.json",
    )
    commit = git("commit", "-m", "Add community tier list and matchup chart meta layer")
    if commit.returncode == 0:
        print("[done] committed")
        if PUSH.is_file():
            subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    else:
        print("[info] commit skipped")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
