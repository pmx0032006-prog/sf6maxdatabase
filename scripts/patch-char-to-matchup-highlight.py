#!/usr/bin/env python3
"""Deepen character->matchup link: highlight & scroll to character row via ?char=slug."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TABLE = ROOT / "src" / "components" / "MatchupTable.tsx"
CHAR_LINKS = ROOT / "src" / "components" / "character" / "CharacterRelatedLinks.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TABLE_TSX = '''"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

function NoteContent({
  row,
  col,
  ratio,
  note,
}: {
  row: Character;
  col: Character;
  ratio: MatchupRatio;
  note: string;
}) {
  return (
    <p className="leading-relaxed text-foreground">
      <span className="font-bold text-accent" translate="no">
        {row.ja} → {col.ja}
      </span>
      <span className="mx-2 font-bold" translate="no">
        {ratio}
      </span>
      <span className="text-muted">{note || "メモなし"}</span>
    </p>
  );
}

export function MatchupTable({ coreChars }: MatchupTableProps) {
  const [selected, setSelected] = useState<{
    row: Character;
    col: Character;
    ratio: MatchupRatio;
    note: string;
  } | null>(null);
  const [focusRow, setFocusRow] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    const charParam = searchParams.get("char");
    if (!charParam) return;
    const exists = coreChars.some((c) => c.slug === charParam);
    if (!exists) return;
    setFocusRow(charParam);
    const el = rowRefs.current[charParam];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const timer = window.setTimeout(() => setFocusRow(null), 4000);
    return () => window.clearTimeout(timer);
  }, [searchParams, coreChars]);

  const focusChar = focusRow ? coreChars.find((c) => c.slug === focusRow) : null;

  return (
    <div>
      <div className="sticky top-14 z-40 -mx-4 border-b border-border bg-background/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:-mx-6 sm:px-6">
        <p className="text-xs text-accent/90">
          数字をタップ（PCはクリック）すると、メモがここに表示されます（スクロールしても追従）。
        </p>
        {focusChar ? (
          <p className="mt-1 text-[11px] text-accent" translate="no">
            <span className="font-bold">{focusChar.ja}</span> の相性行をハイライト中
          </p>
        ) : null}
        <div
          className="mt-2 min-h-[3.25rem] rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          aria-live="polite"
        >
          {selected ? (
            <NoteContent
              row={selected.row}
              col={selected.col}
              ratio={selected.ratio}
              note={selected.note}
            />
          ) : (
            <p className="text-muted">相性表の数字をタップすると、ここにメモが出ます。</p>
          )}
        </div>
      </div>

      <div className="mt-4 max-h-[calc(100dvh-12rem)] overflow-y-auto overflow-x-auto rounded-lg border border-border bg-surface shadow-sm [scrollbar-width:thin]">
        <table className="min-w-full border-collapse text-center text-[10px] sm:text-xs">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="sticky left-0 top-0 z-20 bg-background px-2 py-2 text-left font-bold" translate="no">
                相手 →
              </th>
              {coreChars.map((col) => (
                <th key={col.slug} className="sticky top-0 z-10 min-w-[2.5rem] bg-background px-1 py-2 font-bold">
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
            {coreChars.map((row) => {
              const isFocusRow = focusRow === row.slug;
              return (
              <tr
                key={row.slug}
                ref={(el) => {
                  rowRefs.current[row.slug] = el;
                }}
                className={`border-b border-border/70 last:border-0 transition-colors duration-500 ${
                  isFocusRow ? "bg-accent/10" : ""
                }`}
              >
                <th
                  className={`sticky left-0 z-10 px-2 py-2 text-left font-bold ${
                    isFocusRow ? "bg-accent/20" : "bg-surface"
                  }`}
                >
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
              );
            })}
          </tbody>
        </table>
      </div>
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

    text = CHAR_LINKS.read_text(encoding="utf-8")
    old_link = '''          <Link
            href="/matchups"
            className="group rounded-lg border border-accent/35 bg-accent/[0.08] px-4 py-3.5 transition hover:border-accent/55 hover:shadow-[0_8px_28px_rgba(0,179,104,0.2)]"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">MATCHUP</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent-mint sm:text-lg">
              {ja}の相性表へ
            </p>
            <p className="mt-1 text-[11px] text-white/45">相性表でこのキャラの行を確認</p>
          </Link>'''
    new_link = '''          <Link
            href={`/matchups?char=${currentSlug}`}
            className="group rounded-lg border border-accent/35 bg-accent/[0.08] px-4 py-3.5 transition hover:border-accent/55 hover:shadow-[0_8px_28px_rgba(0,179,104,0.2)]"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">MATCHUP</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent-mint sm:text-lg">
              {ja}の相性表へ
            </p>
            <p className="mt-1 text-[11px] text-white/45">相性表で{ja}の行を自動ハイライト</p>
          </Link>'''
    if old_link not in text:
        print("[error] CharacterRelatedLinks matchup link not found", file=sys.stderr)
        return 1
    CHAR_LINKS.write_text(text.replace(old_link, new_link, 1), encoding="utf-8")

    print("[done] matchup ?char highlight + character link deepened")

    git(
        "add",
        "src/components/MatchupTable.tsx",
        "src/components/character/CharacterRelatedLinks.tsx",
        "scripts/patch-char-to-matchup-highlight.py",
    )
    commit = git("commit", "-m", "Highlight character row in matchup table via ?char param")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
