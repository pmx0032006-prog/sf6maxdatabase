import type { MoveFrameData } from "@/data/characters/cammy";
import { FrameStatCell, FrameStatRow } from "@/components/character/FrameStatRow";
import {
  DETAIL_FRAME_COLUMNS,
  PLAYER_CANCEL,
  PLAYER_FRAME_COLUMNS,
  WIKI_FRAME_EXTRA_ROWS,
} from "@/components/character/wiki-frame-columns";
import { InvulnBadge } from "@/components/character/InvulnBadge";
import { displayWikiValue, getShortInput } from "@/lib/wiki-markup";

type WikiFrameDataTableProps = {
  move: MoveFrameData;
};

export function WikiFrameDataTable({ move }: WikiFrameDataTableProps) {
  const input = displayWikiValue(move.input);
  const shortInput = getShortInput(move.input);
  const moveName = move.nameEn || move.nameJa;
  const cancel = displayWikiValue(move.cancel);

  const extras = WIKI_FRAME_EXTRA_ROWS.filter((row) => {
    if (row.key === "invuln") return false;
    const v = displayWikiValue(move[row.key] as string | undefined);
    return v !== "—";
  }).map((row) => ({
    ...row,
    value: displayWikiValue(move[row.key] as string | undefined),
  }));

  return (
    <div className="mt-4 space-y-4 border-t border-border/50 pt-4">
      <div className="space-y-1">
        <p className="text-base font-bold leading-snug text-foreground sm:text-lg">
          {moveName}
        </p>
        <p className="font-mono text-sm font-bold tabular-nums tracking-wide text-accent">
          {input}
        </p>
        <p className="font-mono text-sm font-bold tabular-nums text-foreground/80">
          {shortInput}
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold tracking-[0.25em] text-muted uppercase">
          Hitboxes off
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="font-mono text-sm font-bold tabular-nums text-accent">
            {input}
          </span>
          <span className="text-sm font-semibold text-foreground">{moveName}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="overflow-x-auto rounded-md border border-accent/30 bg-accent/5">
          <p className="border-b border-accent/20 px-3 py-1.5 text-[10px] font-bold tracking-widest text-accent">
            Player view
          </p>
          <div className="px-2 py-3">
            <FrameStatRow
              move={move}
              columns={PLAYER_FRAME_COLUMNS}
              size="md"
              highlight
            />
            <InvulnBadge invuln={move.invuln} size="md" />
            <div className="mt-3 flex gap-2 border-t border-accent/15 px-1 pt-3 text-sm">
              <span className="shrink-0 font-bold text-muted">
                {PLAYER_CANCEL.label}
              </span>
              <span className="min-w-0 font-semibold text-foreground">
                {cancel}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border/70">
          <p className="border-b border-border/60 bg-[#0a0f0c]/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted">
            Frame details
          </p>
          <div className="px-2 py-3">
            <FrameStatRow move={move} columns={DETAIL_FRAME_COLUMNS} size="md" />
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border/50 pt-3 text-xs sm:text-sm">
        {extras.map((row) => (
          <div key={row.key} className="flex gap-2">
            <dt className="w-28 shrink-0 font-bold text-muted">{row.label}</dt>
            <dd className="min-w-0 font-semibold tabular-nums">
              <FrameStatCell
                move={move}
                col={{ ...row, shortLabel: row.label }}
              />
            </dd>
          </div>
        ))}
      </dl>

      {move.notes ? (
        <p className="text-[11px] leading-relaxed text-muted">
          <span className="font-bold text-foreground/70">Notes:</span>
          {displayWikiValue(move.notes)}
        </p>
      ) : null}
    </div>
  );
}
