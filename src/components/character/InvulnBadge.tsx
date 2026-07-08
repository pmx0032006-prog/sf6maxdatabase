import { formatInvulnEn } from "@/lib/wiki-markup";

type InvulnBadgeProps = {
  invuln?: string | null;
  size?: "sm" | "md";
};

/** 無敵フレーム — 発生・ヒット・ガードの直下に目立つ表示 */
export function InvulnBadge({ invuln, size = "sm" }: InvulnBadgeProps) {
  const text = formatInvulnEn(invuln);
  if (!text) return null;

  const isMd = size === "md";

  return (
    <div
      className={`flex items-start gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 ${
        isMd ? "mt-3 px-2.5 py-2" : "mt-1 px-1 py-0.5"
      }`}
      title={text}
    >
      <span
        className={`shrink-0 rounded font-bold tracking-wide text-amber-800 dark:text-amber-300 ${
          isMd
            ? "bg-amber-500/20 px-2 py-0.5 text-[11px]"
            : "bg-amber-500/20 px-1 py-px text-[6px] sm:text-[7px]"
        }`}
      >
        Invuln
      </span>
      <span
        className={`min-w-0 font-bold leading-snug text-amber-950 tabular-nums dark:text-amber-200 ${
          isMd ? "text-sm" : "text-[7px] sm:text-[8px]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
