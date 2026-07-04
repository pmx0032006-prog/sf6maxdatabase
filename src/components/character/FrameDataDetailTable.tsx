import type { MoveFrameData } from "@/data/characters/cammy";
import {
  displayWikiValue,
  getShortInput,
  isCancelable,
  isDriveRushSupported,
  yesNoJa,
} from "@/lib/wiki-markup";

type FrameDataDetailTableProps = {
  move: MoveFrameData;
};

type Row = {
  label: string;
  value: string;
  mono?: boolean;
};

function buildRows(move: MoveFrameData): Row[] {
  const input = displayWikiValue(move.input);
  const shortInput = getShortInput(move.input);

  return [
    { label: "入力", value: input, mono: true },
    { label: "短縮", value: shortInput, mono: true },
    { label: "発生", value: displayWikiValue(move.startup), mono: true },
    { label: "持続", value: displayWikiValue(move.active), mono: true },
    { label: "回復", value: displayWikiValue(move.recovery), mono: true },
    { label: "全体", value: displayWikiValue(move.total), mono: true },
    { label: "ガード", value: displayWikiValue(move.guard), mono: true },
    { label: "キャンセル", value: displayWikiValue(move.cancel) },
    {
      label: "キャンセル可否",
      value: yesNoJa(isCancelable(move.cancel)),
    },
    {
      label: "DR対応",
      value: yesNoJa(isDriveRushSupported(move)),
    },
    { label: "ダメージ", value: displayWikiValue(move.damage), mono: true },
    { label: "ヒット", value: displayWikiValue(move.onHit), mono: true },
    { label: "ガード時", value: displayWikiValue(move.onBlock), mono: true },
    {
      label: "DRキャンセル(ヒット)",
      value: displayWikiValue(move.drCancelHit),
      mono: true,
    },
    {
      label: "DRキャンセル(ガード)",
      value: displayWikiValue(move.drCancelBlk),
      mono: true,
    },
    {
      label: "DR後(ヒット)",
      value: displayWikiValue(move.afterDrHit),
      mono: true,
    },
    {
      label: "DR後(ガード)",
      value: displayWikiValue(move.afterDrBlk),
      mono: true,
    },
    {
      label: "ヒット確認",
      value: displayWikiValue(move.hitconfirm),
      mono: true,
    },
    { label: "無敵", value: displayWikiValue(move.invuln) },
    { label: "備考", value: displayWikiValue(move.notes) },
  ];
}

export function FrameDataDetailTable({ move }: FrameDataDetailTableProps) {
  const rows = buildRows(move);

  return (
    <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 border-t border-border/50 pt-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex gap-2 text-xs sm:text-sm ${
            row.label === "備考" ? "sm:col-span-2" : ""
          }`}
        >
          <dt className="w-28 shrink-0 font-bold tracking-wide text-muted">
            {row.label}
          </dt>
          <dd
            className={`min-w-0 flex-1 text-foreground ${
              row.mono ? "font-semibold tabular-nums" : ""
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
