#!/usr/bin/env python3
"""Expand matchup chart to full roster (Ingrid included) with JA labels."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
META_JSON = ROOT / "scripts" / "character_meta_snapshot.json"
META_TS = ROOT / "src" / "data" / "character-meta.ts"
MATCHUPS_PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_ORDER = ("S+", "S", "A", "B", "C")
ROSTER_COUNT = 30


def tier_index(slug: str, tiers: dict[str, list[str]]) -> int:
    for i, tier in enumerate(TIER_ORDER):
        if slug in tiers.get(tier, []):
            return i
    return len(TIER_ORDER)


def sort_by_tier(slugs: list[str], tiers: dict[str, list[str]]) -> list[str]:
    def rank(slug: str) -> tuple[int, int]:
        for ti, tier in enumerate(TIER_ORDER):
            bucket = tiers.get(tier, [])
            if slug in bucket:
                return ti, bucket.index(slug)
        return 99, 99

    return sorted(slugs, key=rank)


def default_rating(row: str, col: str, tiers: dict[str, list[str]]) -> str:
    diff = tier_index(col, tiers) - tier_index(row, tiers)
    if diff == 0:
        return "="
    if diff == 1:
        return "+"
    if diff >= 2:
        return "++"
    if diff == -1:
        return "-"
    return "--"


def build_full_matchups(
    slugs: list[str], tiers: dict[str, list[str]], existing: dict[str, dict[str, str]]
) -> dict[str, dict[str, str]]:
    full: dict[str, dict[str, str]] = {}
    for row in slugs:
        row_map = dict(existing.get(row, {}))
        for col in slugs:
            if row == col:
                continue
            if col not in row_map:
                row_map[col] = default_rating(row, col, tiers)
        full[row] = {col: row_map[col] for col in slugs if col != row}
    return full


def meta_ts_content(data: dict) -> str:
    tiers = data["tiers"]
    core = data["matchup_core"]
    matchups = data["matchups"]
    lines = [
        f'export const META_UPDATED = "{data["updated"]}" as const;',
        "export const META_DISCLAIMER =",
        '  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;',
        "",
        'export type Tier = "S" | "A" | "B" | "C";',
        'export type MatchupRating = "++" | "+" | "=" | "-" | "--";',
        "",
        'export const TIER_ORDER = ["S", "A", "B", "C"] as const satisfies readonly Tier[];',
        "",
        "export const TIERS = {",
    ]
    for tier in TIER_ORDER:
        slugs = ", ".join(f'"{s}"' for s in tiers[tier])
        lines.append(f"  {tier}: [{slugs}],")
    lines.append("} as const satisfies Record<Tier, readonly string[]>;")
    lines.append("")
    core_line = ", ".join(f'"{s}"' for s in core)
    lines.append(f"export const MATCHUP_CORE = [{core_line}] as const;")
    lines.append("")
    lines.append("export const MATCHUP_LABELS: Record<MatchupRating, string> = {")
    lines.append('  "++": "Strong advantage",')
    lines.append('  "+": "Slight advantage",')
    lines.append('  "=": "Even",')
    lines.append('  "-": "Slight disadvantage",')
    lines.append('  "--": "Tough matchup",')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUP_LABELS_JA: Record<MatchupRating, string> = {")
    lines.append('  "++": "かなり有利",')
    lines.append('  "+": "やや有利",')
    lines.append('  "=": "互角",')
    lines.append('  "-": "やや不利",')
    lines.append('  "--": "かなり不利",')
    lines.append("};")
    lines.append("")
    lines.append("export const MATCHUPS: Record<string, Record<string, MatchupRating>> = {")
    for row, cols in matchups.items():
        inner = ", ".join(f'"{k}": "{v}"' for k, v in cols.items())
        lines.append(f'  "{row}": {{ {inner} }},')
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


MATCHUPS_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import {
  MATCHUP_CORE,
  MATCHUP_LABELS,
  MATCHUP_LABELS_JA,
  MATCHUPS,
  META_DISCLAIMER,
  META_UPDATED,
  type MatchupRating,
} from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity chart — advantage between characters, not match results.",
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
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクター相性表
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            縦のキャラが横のキャラに対してどれだけ有利か（試合結果ではなく相性の目安）。各キャラページのフレームデータと併用してください。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">++</span> かなり有利 / <span translate="no">+</span> やや有利 / <span translate="no">=</span> 互角 / <span translate="no">-</span> やや不利 / <span translate="no">--</span> かなり不利
          </p>
          <p className="mt-1 text-xs text-muted/80">
            上ほど強キャラ・下ほど弱キャラ（ティア順）。全{ROSTER_COUNT}キャラ（イングリッドまで）。
          </p>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
            <table className="min-w-full border-collapse text-center text-[10px] sm:text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="sticky left-0 z-10 bg-background px-2 py-2 text-left font-bold" translate="no">
                    相手 →
                  </th>
                  {coreChars.map((col) => (
                    <th key={col.slug} className="min-w-[2.5rem] px-1 py-2 font-bold">
                      <Link
                        href={`/characters/${col.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={col.en}
                      >
                        {col.ja}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coreChars.map((row) => (
                  <tr key={row.slug} className="border-b border-border/70 last:border-0">
                    <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-bold">
                      <Link
                        href={`/characters/${row.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={row.en}
                      >
                        {row.ja}
                      </Link>
                    </th>
                    {coreChars.map((col) => {
                      if (row.slug === col.slug) {
                        return (
                          <td key={col.slug} className="px-1 py-2 text-muted">
                            —
                          </td>
                        );
                      }
                      const rating = MATCHUPS[row.slug]?.[col.slug] ?? ("=" as MatchupRating);
                      return (
                        <td key={col.slug} className="px-1 py-2">
                          <span
                            className={`inline-block min-w-[1.75rem] rounded px-1 py-0.5 font-bold ${ratingClass(rating)}`}
                            title={MATCHUP_LABELS_JA[rating]}
                            translate="no"
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
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''.replace("{ROSTER_COUNT}", str(ROSTER_COUNT))


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
    data = json.loads(META_JSON.read_text(encoding="utf-8"))
    tiers = data["tiers"]
    all_slugs = sort_by_tier([s for t in TIER_ORDER for s in tiers[t]], tiers)
    if len(all_slugs) != ROSTER_COUNT:
        print(f"[warn] expected {ROSTER_COUNT} chars, got {len(all_slugs)}", file=sys.stderr)

    data["matchup_core"] = all_slugs
    data["matchups"] = build_full_matchups(all_slugs, tiers, data.get("matchups", {}))
    META_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    META_TS.write_text(meta_ts_content(data), encoding="utf-8")
    MATCHUPS_PAGE.write_text(MATCHUPS_PAGE_TSX, encoding="utf-8")

    print(f"[done] full roster matchups: {len(all_slugs)} chars, ingrid last in C-tier block")

    git(
        "add",
        "scripts/character_meta_snapshot.json",
        "src/data/character-meta.ts",
        "src/app/matchups/page.tsx",
        "scripts/expand-full-roster-matchups.py",
        "scripts/meta-loop-tick.py",
    )
    commit = git("commit", "-m", "Full roster matchup chart with Japanese character names")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
