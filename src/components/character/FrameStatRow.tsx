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
  size?: "sm" | "card" | "card-lg" | "card-xl" | "md";
}) {
  const value = displayWikiValue(move[col.key] as string | undefined);
  const tone = col.advantage ? getFrameAdvantageTone(value) : "neutral";
  const sizeClass =
    size === "md"
      ? "text-sm sm:text-base"
      : size === "card-xl"
        ? "text-xs sm:text-[13px]"
        : size === "card-lg"
          ? "text-[10px] sm:text-[11px]"
          : size === "card"
            ? "text-[9px] sm:text-[10px]"
            : "text-[7px] sm:text-[8px]";

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
  size?: "sm" | "card" | "card-lg" | "card-xl" | "md";
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
                  ? size === "card-xl"
                    ? "text-[10px] sm:text-[11px]"
                    : size === "card-lg"
                      ? "text-[9px] sm:text-[10px]"
                      : size === "card"
                        ? "text-[8px] sm:text-[9px]"
                        : "text-[7px] sm:text-[8px]"
                  : size === "card-xl"
                    ? "text-[9px] sm:text-[10px]"
                    : size === "card-lg"
                      ? "text-[8px] sm:text-[9px]"
                      : size === "card"
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
                highlight
                  ? size === "card-xl"
                    ? "py-2"
                    : size === "card-lg"
                      ? "py-1.5"
                      : "py-1"
                  : ""
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
