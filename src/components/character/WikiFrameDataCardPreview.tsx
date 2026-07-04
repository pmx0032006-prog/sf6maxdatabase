import type { MoveFrameData } from "@/data/characters/cammy";
import { FrameStatCell, FrameStatRow } from "@/components/character/FrameStatRow";
import {
  DETAIL_FRAME_COLUMNS,
  PLAYER_FRAME_COLUMNS,
  WIKI_FRAME_EXTRA_ROWS,
} from "@/components/character/wiki-frame-columns";
import { InvulnBadge } from "@/components/character/InvulnBadge";
import { displayWikiValue, getShortInput } from "@/lib/wiki-markup";

type WikiFrameDataCardPreviewProps = {
  move: MoveFrameData;
};

/** クリック前 — プレイヤー向け数値を最上段に */
export function WikiFrameDataCardPreview({ move }: WikiFrameDataCardPreviewProps) {
  const input = displayWikiValue(move.input);
  const shortInput = getShortInput(move.input);
  const moveName = move.nameEn || move.nameJa;
  const cancel = displayWikiValue(move.cancel);

  const extras = WIKI_FRAME_EXTRA_ROWS.filter((row) => {
    if (row.key === "invuln") return false;
    const v = displayWikiValue(move[row.key] as string | undefined);
    return v !== "—";
  });

  return (
    <div className="border-t border-border/70 bg-[#0a0f0c]/[0.04]">
      <div className="space-y-0.5 px-1.5 pt-1.5">
        <p className="line-clamp-2 text-[9px] font-bold leading-tight text-foreground">
          {moveName}
        </p>
        <p className="font-mono text-[9px] font-bold tabular-nums tracking-wide text-accent">
          {input}
          {shortInput !== input ? (
            <span className="ml-1.5 text-foreground/75">{shortInput}</span>
          ) : null}
        </p>
      </div>

      <div className="mt-1 space-y-1.5 px-1 pb-1.5">
        <div className="rounded bg-accent/5 px-1 py-1">
          <FrameStatRow
            move={move}
            columns={PLAYER_FRAME_COLUMNS}
            size="sm"
            highlight
          />
          <InvulnBadge invuln={move.invuln} size="sm" />
          <p
            className="mt-1 truncate border-t border-accent/15 px-0.5 pt-1 text-[6px] leading-tight sm:text-[7px]"
            title={cancel}
          >
            <span className="font-bold text-muted">キャンセル</span>{" "}
            <span className="font-medium text-foreground">{cancel}</span>
          </p>
        </div>

        <FrameStatRow move={move} columns={DETAIL_FRAME_COLUMNS} size="sm" />

        {extras.length > 0 ? (
          <dl className="space-y-0.5 border-t border-border/40 pt-1">
            {extras.map((row) => (
              <div
                key={row.key}
                className="flex gap-1 text-[6px] leading-tight sm:text-[7px]"
              >
                <dt className="shrink-0 font-bold text-muted">{row.label}</dt>
                <dd className="min-w-0 truncate">
                  <FrameStatCell
                    move={move}
                    col={{ ...row, shortLabel: row.label }}
                  />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {move.notes ? (
          <p
            className="line-clamp-2 text-[6px] leading-tight text-muted sm:text-[7px]"
            title={displayWikiValue(move.notes)}
          >
            備考 {displayWikiValue(move.notes)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
