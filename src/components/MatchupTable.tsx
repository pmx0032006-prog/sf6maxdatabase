"use client";

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
  copied,
  onCopy,
}: {
  row: Character;
  col: Character;
  ratio: MatchupRatio;
  note: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <p className="leading-relaxed text-foreground">
        <span className="font-bold text-accent" translate="no">
          {row.ja} → {col.ja}
        </span>
        <span className="mx-2 font-bold" translate="no">
          {ratio}
        </span>
        <span className="text-muted">{note || "メモなし"}</span>
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 self-start rounded-full border border-accent/30 px-2.5 py-1 text-[10px] font-bold text-accent transition hover:border-accent hover:bg-accent/10"
      >
        {copied ? "コピー済み" : "リンクコピー"}
      </button>
    </div>
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
  const [copied, setCopied] = useState(false);
  const searchParams = useSearchParams();
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  useEffect(() => {
    const rowParam = searchParams.get("row");
    const colParam = searchParams.get("col");
    if (rowParam && colParam) {
      const row = coreChars.find((c) => c.slug === rowParam);
      const col = coreChars.find((c) => c.slug === colParam);
      if (!row || !col || row.slug === col.slug) return;
      const ratio = MATCHUPS[row.slug]?.[col.slug] ?? ("5-5" as MatchupRatio);
      const note = MATCHUP_NOTES[row.slug]?.[col.slug] ?? "";
      setSelected({ row, col, ratio, note });
      setFocusRow(row.slug);
      rowRefs.current[row.slug]?.scrollIntoView({ behavior: "smooth", block: "center" });
      const timer = window.setTimeout(() => setFocusRow(null), 4000);
      return () => window.clearTimeout(timer);
    }

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

  function selectMatchup(row: Character, col: Character, ratio: MatchupRatio, note: string) {
    setSelected({ row, col, ratio, note });
    setCopied(false);
    const params = new URLSearchParams({ row: row.slug, col: col.slug });
    window.history.replaceState(null, "", `/matchups?${params.toString()}`);
  }

  async function copySelectedLink() {
    if (!selected) return;
    const params = new URLSearchParams({ row: selected.row.slug, col: selected.col.slug });
    const url = `${window.location.origin}/matchups?${params.toString()}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

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
              copied={copied}
              onCopy={copySelectedLink}
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
                        onClick={() => selectMatchup(row, col, ratio, note)}
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
