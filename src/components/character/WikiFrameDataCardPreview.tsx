import type { MoveFrameData } from "@/data/characters/cammy";
import { FrameStatCell, FrameStatRow } from "@/components/character/FrameStatRow";
import {
  DETAIL_FRAME_COLUMNS,
  PLAYER_FRAME_COLUMNS,
  WIKI_FRAME_EXTRA_ROWS,
} from "@/components/character/wiki-frame-columns";
import { InvulnBadge } from "@/components/character/InvulnBadge";
import {
  getWikiCardTextScale,
  wikiCardStatSize,
  type WikiCardTextScale,
} from "@/lib/wiki-card-text-scale";
import { displayWikiValue, getShortInput } from "@/lib/wiki-markup";

type WikiFrameDataCardPreviewProps = {
  move: MoveFrameData;
  characterSlug: string;
};

const EXTRA_LABEL_SHORT: Partial<Record<string, string>> = {
  drCancelHit: "DR cncl H",
  drCancelBlk: "DR cncl B",
  afterDrHit: "After DR H",
  afterDrBlk: "After DR B",
  hitconfirm: "Hit cnfrm",
};

function textClasses(scale: WikiCardTextScale) {
  if (scale === "readable") {
    return {
      moveName: "text-xs sm:text-sm",
      input: "text-xs sm:text-sm",
      meta: "text-[10px] sm:text-[11px]",
      bodyPad: "px-3 pb-3",
      headerPad: "px-3 pt-3",
      statBox: "px-2.5 py-2.5",
    };
  }
  return {
    moveName: "text-[9px]",
    input: "text-[9px]",
    meta: "text-[6px] sm:text-[7px]",
    bodyPad: "px-1 pb-1.5",
    headerPad: "px-1.5 pt-1.5",
    statBox: "px-1.5 py-1.5",
  };
}

/** クリック前 — プレイヤー向け数値を最上段に */
export function WikiFrameDataCardPreview({
  move,
  characterSlug,
}: WikiFrameDataCardPreviewProps) {
  const scale = getWikiCardTextScale(characterSlug);
  const statSize = wikiCardStatSize(scale);
  const text = textClasses(scale);
  const useShortExtraLabels = scale === "readable";
  const input = displayWikiValue(move.input);
  const shortInput = getShortInput(move.input);
  const moveName = move.nameEn || move.nameJa || "—";
  const cancel = displayWikiValue(move.cancel);

  const extras = WIKI_FRAME_EXTRA_ROWS.filter((row) => {
    if (row.key === "invuln") return false;
    const v = displayWikiValue(move[row.key] as string | undefined);
    return v !== "—";
  });

  return (
    <div className="border-t border-border/70 bg-[#0a0f0c]/[0.04]">
      <div className={`space-y-0.5 ${text.headerPad}`}>
        <p
          className={`line-clamp-2 break-keep font-bold leading-snug text-foreground ${text.moveName}`}
        >
          {moveName}
        </p>
        <p
          className={`font-mono font-bold tabular-nums tracking-wide text-accent ${text.input}`}
        >
          {input}
          {shortInput !== input ? (
            <span className="ml-1.5 text-foreground/75">{shortInput}</span>
          ) : null}
        </p>
      </div>

      <div className={`mt-1 space-y-2 ${text.bodyPad}`}>
        <div className={`rounded bg-accent/5 ${text.statBox}`}>
          <FrameStatRow
            move={move}
            columns={PLAYER_FRAME_COLUMNS}
            size={statSize}
            highlight
          />
          <InvulnBadge invuln={move.invuln} size={statSize} />
          <p
            className={`mt-1.5 truncate border-t border-accent/15 pt-1.5 leading-snug ${text.meta}`}
            title={cancel}
          >
            <span className="font-bold text-muted">Cancel</span>{" "}
            <span className="font-medium text-foreground">{cancel}</span>
          </p>
        </div>

        <FrameStatRow
          move={move}
          columns={DETAIL_FRAME_COLUMNS}
          size={statSize}
        />

        {extras.length > 0 ? (
          <dl className="space-y-1 border-t border-border/40 pt-1.5">
            {extras.map((row) => (
              <div
                key={row.key}
                className={`flex gap-1.5 leading-snug ${text.meta}`}
              >
                <dt
                  className="shrink-0 font-bold text-muted"
                  title={row.label}
                >
                  {useShortExtraLabels
                    ? (EXTRA_LABEL_SHORT[row.key] ?? row.label)
                    : row.label}
                </dt>
                <dd className="min-w-0 truncate">
                  <FrameStatCell
                    move={move}
                    col={{ ...row, shortLabel: row.label }}
                    size={statSize}
                  />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {move.notes ? (
          <p
            className={`line-clamp-2 break-keep leading-snug text-muted ${text.meta}`}
            title={displayWikiValue(move.notes)}
          >
            Notes {displayWikiValue(move.notes)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
