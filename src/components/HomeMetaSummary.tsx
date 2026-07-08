import Link from "next/link";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_UPDATED, TIERS } from "@/data/character-meta";

function hotPickNames(limit?: number) {
  const slugs = [...TIERS["S+"], ...TIERS["S"]];
  const names = slugs
    .map((slug) => roster.find((c) => c.slug === slug)?.en ?? slug.toUpperCase())
    .filter(Boolean);
  return limit ? names.slice(0, limit).join(" · ") : names.join(" · ");
}

export function HomeMetaSummary() {
  const chars = roster.length;
  const cells = MATCHUP_CORE.length * (MATCHUP_CORE.length - 1);
  const hotCompact = hotPickNames(4);
  const hotFull = hotPickNames();

  const items = [
    {
      href: "/tier",
      kicker: "HOT NOW",
      value: hotCompact,
      valueWide: hotFull,
      note: "Want to win? Start here.",
      featured: true,
    },
    {
      href: "/characters/ingrid",
      kicker: "SLEEPER",
      value: "INGRID",
      note: "Still sleeping on her?",
    },
    {
      href: "/matchups",
      kicker: "MATCHUPS",
      value: String(cells),
      note: "full grid",
    },
    {
      href: "/tier",
      kicker: "META",
      value: META_UPDATED,
      note: "updated",
      muted: true,
    },
  ] as const;

  return (
    <div
      className="meta-summary-band flex flex-nowrap items-stretch justify-start gap-1.5 overflow-x-auto pb-0.5 sm:justify-end sm:gap-2 sm:overflow-visible sm:pb-0 lg:justify-end"
      aria-label="Meta picks overview"
    >
      {items.map((item) => {
        const muted = "muted" in item && item.muted;
        const featured = "featured" in item && item.featured;
        const valueWide = "valueWide" in item ? item.valueWide : undefined;
        return (
          <Link
            key={item.kicker}
            href={item.href}
            className={`meta-summary-chip group flex min-w-[4.75rem] flex-col rounded-md border px-2.5 py-2 transition duration-300 hover:-translate-y-0.5 sm:min-w-[5rem] sm:px-3 ${
              featured ? "min-w-[10.5rem] flex-[1.35] sm:min-w-[12rem]" : ""
            } ${
              muted
                ? "border-white/8 bg-white/[0.03] hover:border-white/20"
                : featured
                  ? "border-accent/40 bg-accent/[0.1] hover:border-accent/60 hover:bg-accent/[0.16] hover:shadow-[0_0_24px_rgba(0,179,104,0.28)]"
                  : "border-accent/25 bg-accent/[0.06] hover:border-accent/50 hover:bg-accent/[0.12] hover:shadow-[0_0_20px_rgba(0,179,104,0.2)]"
            }`}
            translate="no"
          >
            <span className="text-[7px] font-bold tracking-[0.26em] text-accent/80 sm:text-[8px]">
              {item.kicker}
            </span>
            <span
              className={`mt-0.5 font-display font-black leading-tight text-white group-hover:text-accent-mint ${
                featured
                  ? "text-[0.7rem] sm:text-xs"
                  : muted
                    ? "text-base text-white/55 sm:text-lg"
                    : "text-base sm:text-lg"
              }`}
            >
              {featured ? (
                <>
                  <span className="sm:hidden">{item.value}</span>
                  <span className="hidden sm:inline">{valueWide ?? item.value}</span>
                </>
              ) : (
                item.value
              )}
            </span>
            <span className="mt-1 text-[8px] leading-snug text-white/45 sm:text-[9px]">{item.note}</span>
          </Link>
        );
      })}
    </div>
  );
}
