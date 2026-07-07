import Link from "next/link";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_UPDATED, TIERS } from "@/data/character-meta";

const stats = () => {
  const sPlusSlug = TIERS["S+"][0];
  const sPlus = roster.find((c) => c.slug === sPlusSlug);
  const chars = roster.length;
  const cells = MATCHUP_CORE.length * (MATCHUP_CORE.length - 1);
  return { sPlus, chars, cells };
};

export function HomeMetaSummary() {
  const { sPlus, chars, cells } = stats();

  const items = [
    {
      href: "/tier",
      kicker: "S+",
      value: sPlus?.ja ?? "舞",
      note: "最強枠",
    },
    {
      href: "/tier",
      kicker: "ROSTER",
      value: String(chars),
      note: "キャラ",
    },
    {
      href: "/matchups",
      kicker: "GRID",
      value: String(cells),
      note: "相性マス",
    },
    {
      href: "/tier",
      kicker: "META",
      value: META_UPDATED,
      note: "更新",
      muted: true,
    },
  ] as const;

  return (
    <div
      className="meta-summary-band flex flex-wrap items-stretch justify-center gap-1.5 sm:gap-2 lg:justify-center"
      aria-label="メタデータ概要"
    >
      {items.map((item) => (
        <Link
          key={item.kicker}
          href={item.href}
          className={`meta-summary-chip group flex min-w-[4.5rem] flex-col rounded-md border px-2.5 py-2 transition duration-300 hover:-translate-y-0.5 sm:min-w-[5rem] sm:px-3 ${
            item.muted
              ? "border-white/8 bg-white/[0.03] hover:border-white/20"
              : "border-accent/25 bg-accent/[0.06] hover:border-accent/50 hover:bg-accent/[0.12] hover:shadow-[0_0_20px_rgba(0,179,104,0.2)]"
          }`}
          translate="no"
        >
          <span className="text-[7px] font-bold tracking-[0.26em] text-accent/80 sm:text-[8px]">
            {item.kicker}
          </span>
          <span
            className={`mt-0.5 font-display text-base font-black leading-none sm:text-lg ${
              item.muted ? "text-white/55" : "text-white group-hover:text-accent-mint"
            }`}
          >
            {item.value}
          </span>
          <span className="mt-1 text-[8px] leading-none text-white/40 sm:text-[9px]">{item.note}</span>
        </Link>
      ))}
    </div>
  );
}
