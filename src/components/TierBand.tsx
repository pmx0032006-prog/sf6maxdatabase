import Link from "next/link";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";

const TIER_STYLES: Record<string, string> = {
  S: "border-amber-400/50 bg-amber-400/10 text-amber-200",
  A: "border-accent/50 bg-accent/10 text-accent-mint",
  B: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  C: "border-white/20 bg-white/5 text-white/70",
};

export function TierBand() {
  return (
    <section
      aria-label="Character tier snapshot"
      className="border-b border-white/10 bg-[#0d1411] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.28em] text-accent uppercase">
              Meta Snapshot
            </p>
            <p className="text-[11px] text-white/55">
              Community tier list — updated {META_UPDATED}
            </p>
          </div>
          <Link
            href="/meta"
            className="text-[10px] font-bold tracking-wide text-accent hover:text-accent-mint"
          >
            Full tiers + matchups →
          </Link>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {TIER_ORDER.map((tier) => {
            const slugs = TIERS[tier];
            const style = TIER_STYLES[tier];
            return (
              <div
                key={tier}
                className={`min-w-[9.5rem] shrink-0 rounded-lg border px-2.5 py-2 ${style}`}
              >
                <p className="text-[10px] font-black tracking-[0.2em]">TIER {tier}</p>
                <ul className="mt-1.5 flex flex-col gap-0.5">
                  {slugs.map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="text-[11px] font-semibold hover:underline"
                        >
                          {char.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-2 text-[9px] leading-relaxed text-white/40">{META_DISCLAIMER}</p>
      </div>
    </section>
  );
}
