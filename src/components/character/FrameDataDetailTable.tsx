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
    { label: "Input", value: input, mono: true },
    { label: "Short", value: shortInput, mono: true },
    { label: "Startup", value: displayWikiValue(move.startup), mono: true },
    { label: "Active", value: displayWikiValue(move.active), mono: true },
    { label: "Recovery", value: displayWikiValue(move.recovery), mono: true },
    { label: "Total", value: displayWikiValue(move.total), mono: true },
    { label: "Guard", value: displayWikiValue(move.guard), mono: true },
    { label: "Cancel", value: displayWikiValue(move.cancel) },
    {
      label: "Cancelable",
      value: yesNoJa(isCancelable(move.cancel)),
    },
    {
      label: "DR",
      value: yesNoJa(isDriveRushSupported(move)),
    },
    { label: "Damage", value: displayWikiValue(move.damage), mono: true },
    { label: "On Hit", value: displayWikiValue(move.onHit), mono: true },
    { label: "On Block", value: displayWikiValue(move.onBlock), mono: true },
    {
      label: "DR Cancel (Hit)",
      value: displayWikiValue(move.drCancelHit),
      mono: true,
    },
    {
      label: "DR Cancel (Block)",
      value: displayWikiValue(move.drCancelBlk),
      mono: true,
    },
    {
      label: "After DR (Hit)",
      value: displayWikiValue(move.afterDrHit),
      mono: true,
    },
    {
      label: "After DR (Block)",
      value: displayWikiValue(move.afterDrBlk),
      mono: true,
    },
    {
      label: "Hit Confirm",
      value: displayWikiValue(move.hitconfirm),
      mono: true,
    },
    { label: "Invuln", value: displayWikiValue(move.invuln) },
    { label: "Notes", value: displayWikiValue(move.notes) },
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
            row.label === "Notes" ? "sm:col-span-2" : ""
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
