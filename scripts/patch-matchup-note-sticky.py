#!/usr/bin/env python3
"""Make matchup note panel sticky so it stays visible while scrolling the table."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / "src" / "components" / "MatchupTable.tsx"
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
        数字をタップ（PCはクリック）すると、メモが画面上部に固定表示されます。
      </p>

      <div
        className={`mt-3 min-h-[3.25rem] rounded-lg border border-border px-3 py-2 text-sm ${
          selected
            ? "sticky top-14 z-40 border-accent/30 bg-background/95 shadow-md backdrop-blur-sm"
            : "bg-surface"
        }`}
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
    print("[done] sticky note panel applied")

    git("add", "src/components/MatchupTable.tsx", "scripts/patch-matchup-note-sticky.py")
    commit = git("commit", "-m", "Sticky matchup note panel while scrolling table")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
