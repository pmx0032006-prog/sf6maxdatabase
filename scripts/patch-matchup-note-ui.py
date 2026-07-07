#!/usr/bin/env python3
"""Add tap/click note panel for matchup chart (mobile-friendly)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / "src" / "components" / "MatchupTable.tsx"
PAGE = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TABLE_TSX = '''"use client";

import Link from "next/link";
import { useState } from "react";
import type { Character } from "@/data/characters";
import { MATCHUP_NOTES, MATCHUPS, type MatchupRatio } from "@/data/character-meta";

type MatchupTableProps = {
  coreChars: Character[];
};

function ratioClass(ratio: MatchupRatio): string {
  const left = Number(ratio.split("-")[0] ?? 5);
  if (left >= 7) return "bg-emerald-500/20 text-emerald-700";
  if (left === 6) return "bg-accent/15 text-accent";
  if (left === 5) return "bg-surface text-muted";
  if (left === 4) return "bg-orange-500/15 text-orange-700";
  return "bg-red-500/15 text-red-700";
}

export function MatchupTable({ coreChars }: MatchupTableProps) {
  const [selected, setSelected] = useState<{
    row: Character;
    col: Character;
    ratio: MatchupRatio;
    note: string;
  } | null>(null);

  return (
    <>
      <p className="mt-1 text-xs text-accent/90">
        数字をタップ（PCはクリック）すると、下にメモが表示されます。
      </p>

      <div
        className="mt-3 min-h-[3.25rem] rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        aria-live="polite"
      >
        {selected ? (
          <p className="leading-relaxed text-foreground">
            <span className="font-bold text-accent" translate="no">
              {selected.row.ja} → {selected.col.ja}
            </span>
            <span className="mx-2 font-bold" translate="no">
              {selected.ratio}
            </span>
            <span className="text-muted">{selected.note || "メモなし"}</span>
          </p>
        ) : (
          <p className="text-muted">相性表の数字をタップすると、ここにメモが出ます。</p>
        )}
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
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
                  const ratio = MATCHUPS[row.slug]?.[col.slug] ?? ("5-5" as MatchupRatio);
                  const note = MATCHUP_NOTES[row.slug]?.[col.slug] ?? "";
                  const isSelected =
                    selected?.row.slug === row.slug && selected?.col.slug === col.slug;
                  return (
                    <td key={col.slug} className="px-1 py-2">
                      <button
                        type="button"
                        onClick={() => setSelected({ row, col, ratio, note })}
                        className={`inline-block min-w-[2.25rem] cursor-pointer rounded px-1 py-0.5 font-bold transition ${ratioClass(ratio)} ${
                          isSelected ? "ring-2 ring-accent ring-offset-1" : "hover:brightness-95"
                        }`}
                        title={note || undefined}
                        aria-label={`${row.ja}対${col.ja} ${ratio} ${note}`}
                        translate="no"
                      >
                        {ratio}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
'''

PAGE_TSX = '''import Link from "next/link";
import { MatchupTable } from "@/components/MatchupTable";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_DISCLAIMER, META_UPDATED } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity diagram — win-rate style ratios, not match results.",
  alternates: { canonical: `${siteUrl}/matchups` },
};

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
            縦のキャラが横のキャラに対してどれだけ有利か（ダイヤグラム方式）。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">7-3</span> かなり有利 / <span translate="no">6-4</span> やや有利 / <span translate="no">5-5</span> 互角 / <span translate="no">4-6</span> やや不利 / <span translate="no">3-7</span> かなり不利
          </p>
          <p className="mt-1 text-xs text-muted/80">
            上ほど強キャラ・下ほど弱キャラ（ティア順）。全30キャラ（イングリッドまで）。
          </p>

          <MatchupTable coreChars={coreChars} />

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
    TABLE.write_text(TABLE_TSX, encoding="utf-8")
    PAGE.write_text(PAGE_TSX, encoding="utf-8")
    print("[done] matchup notes: tap/click panel added")

    git(
        "add",
        "src/components/MatchupTable.tsx",
        "src/app/matchups/page.tsx",
        "scripts/patch-matchup-note-ui.py",
    )
    commit = git("commit", "-m", "Show matchup notes on tap with visible note panel")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
