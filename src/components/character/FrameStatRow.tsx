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
          ? "text-[12px] sm:text-[13px]"
          : size === "card"
            ? "text-[12px] sm:text-[12px]"
            : "text-[12px] sm:text-[12px]";

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
                    ? "text-[12px] sm:text-[13px]"
                    : size === "card-lg"
                      ? "text-[12px] sm:text-[12px]"
                      : size === "card"
                        ? "text-[12px] sm:text-[12px]"
                        : "text-[12px] sm:text-[12px]"
                  : size === "card-xl"
                    ? "text-[12px] sm:text-[12px]"
                    : size === "card-lg"
                      ? "text-[12px] sm:text-[12px]"
                      : size === "card"
                        ? "text-[12px] sm:text-[12px]"
                        : "text-[12px] sm:text-[12px]"
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
