import type { MoveFrameData } from "@/data/characters/cammy";
import {
  displayWikiValue,
  frameAdvantageClass,
  getFrameAdvantageTone,
} from "@/lib/wiki-markup";
import type { WikiFrameColumn } from "@/components/character/wiki-frame-columns";

export function FrameStatCell({
  move,
  col,
  size = "sm",
}: {
  move: MoveFrameData;
  col: WikiFrameColumn;
  size?: "sm" | "md";
}) {
  const value = displayWikiValue(move[col.key] as string | undefined);
  const tone = col.advantage ? getFrameAdvantageTone(value) : "neutral";
  const sizeClass =
    size === "md" ? "text-sm sm:text-base" : "text-[7px] sm:text-[8px]";

  return (
    <span
      className={`font-bold tabular-nums ${sizeClass} ${
        col.advantage ? frameAdvantageClass(tone) : "text-foreground"
      }`}
    >
      {value}
    </span>
  );
}

export function FrameStatRow({
  move,
  columns,
  size = "sm",
  highlight = false,
}: {
  move: MoveFrameData;
  columns: WikiFrameColumn[];
  size?: "sm" | "md";
  highlight?: boolean;
}) {
  return (
    <table className="w-full border-collapse text-center">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`whitespace-nowrap px-0.5 pb-0.5 font-bold leading-tight text-muted ${
                highlight
                  ? "text-[7px] sm:text-[8px]"
                  : "text-[6px] sm:text-[7px]"
              }`}
              title={col.label}
            >
              {col.shortLabel}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columns.map((col) => (
            <td
              key={col.key}
              className={`whitespace-nowrap px-0.5 py-0.5 ${
                highlight ? "py-1" : ""
              }`}
            >
              <FrameStatCell move={move} col={col} size={size} />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
