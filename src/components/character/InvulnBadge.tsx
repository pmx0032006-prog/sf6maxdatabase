import { formatInvulnEn } from "@/lib/wiki-markup";

type InvulnBadgeProps = {
  invuln?: string | null;
  size?: "sm" | "card" | "card-lg" | "card-xl" | "md";
};

/** 無敵フレーム — 発生・ヒット・ガードの直下に目立つ表示 */
export function InvulnBadge({ invuln, size = "sm" }: InvulnBadgeProps) {
  const text = formatInvulnEn(invuln);
  if (!text) return null;

  const isMd = size === "md";
  const isCardXl = size === "card-xl";
  const isCardLg = size === "card-lg";
  const isCard = size === "card";

  return (
    <div
      className={`flex items-start gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 ${
        isMd
          ? "mt-3 px-2.5 py-2"
          : isCardXl
            ? "mt-2.5 px-2.5 py-2"
            : isCardLg
              ? "mt-2 px-2 py-1.5"
              : isCard
                ? "mt-1.5 px-1.5 py-1"
                : "mt-1 px-1 py-0.5"
      }`}
      title={text}
    >
      <span
        className={`shrink-0 rounded font-bold tracking-wide text-amber-800 dark:text-amber-300 ${
          isMd
            ? "bg-amber-500/20 px-2 py-0.5 text-[11px]"
            : isCardXl
              ? "bg-amber-500/20 px-2 py-0.5 text-[9px] sm:text-[10px]"
              : isCardLg
                ? "bg-amber-500/20 px-1.5 py-px text-[8px] sm:text-[9px]"
                : isCard
                  ? "bg-amber-500/20 px-1.5 py-px text-[7px] sm:text-[8px]"
                  : "bg-amber-500/20 px-1 py-px text-[6px] sm:text-[7px]"
        }`}
      >
        Invuln
      </span>
      <span
        className={`min-w-0 font-bold leading-snug text-amber-950 tabular-nums dark:text-amber-200 ${
          isMd
            ? "text-sm"
            : isCardXl
              ? "text-[10px] sm:text-[11px]"
              : isCardLg
                ? "text-[9px] sm:text-[10px]"
                : isCard
                  ? "text-[8px] sm:text-[9px]"
                  : "text-[7px] sm:text-[8px]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
