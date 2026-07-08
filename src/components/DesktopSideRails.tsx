import Link from "next/link";
import { AFFILIATE_GEAR, gearHref } from "@/data/affiliate-gear";

const RAIL_PER_SIDE = 5; // phase 1: 5 left + 5 right — fits viewport without clipping

function SideCard({
  badge,
  href,
  shortLabel,
  tagline,
}: {
  badge: string;
  href: string;
  shortLabel: string;
  tagline: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex shrink-0 flex-col gap-1.5 rounded-lg border border-accent/35 bg-gradient-to-b from-[#122018] to-[#0a0f0c] px-3 py-2.5 text-left shadow-md backdrop-blur-sm transition hover:border-accent hover:shadow-[0_0_18px_rgba(0,179,104,0.18)]"
    >
      <span className="inline-block w-fit rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent-mint uppercase">
        {badge}
      </span>
      <p className="text-[13px] font-black leading-tight text-white">{shortLabel}</p>
      <p className="text-[10px] leading-snug text-white/65">{tagline}</p>
      <span className="rounded-md bg-accent py-1.5 text-center text-[10px] font-bold tracking-wide text-black transition group-hover:bg-accent-mint">
        Shop on Amazon →
      </span>
    </a>
  );
}

function RailStack({
  startIndex,
  side,
  title,
}: {
  startIndex: number;
  side: "left" | "right";
  title: string;
}) {
  const items = AFFILIATE_GEAR.slice(startIndex, startIndex + RAIL_PER_SIDE);

  return (
    <div className="pointer-events-auto flex h-[calc(100vh-9.5rem)] flex-col gap-1.5 px-2.5 py-2">
      <p className="shrink-0 rounded-lg border border-accent/35 bg-accent/10 px-3 py-2 text-center text-[9px] font-bold tracking-[0.22em] text-accent-mint uppercase">
        {title}
      </p>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {items.map((item) => (
          <SideCard
            key={`${side}-${item.asin}`}
            badge={item.badge}
            href={gearHref(item.asin)}
            shortLabel={item.shortLabel}
            tagline={item.tagline}
          />
        ))}
      </div>

      <Link
        href="/about#affiliate"
        className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center text-[9px] text-white/45 hover:border-accent/30 hover:text-accent"
      >
        Affiliate disclosure
      </Link>
    </div>
  );
}

export function DesktopSideRails() {
  return (
    <>
      <aside
        aria-label="Desktop left rail"
        className="pointer-events-none fixed top-[7rem] bottom-10 z-20 left-[max(0px,calc((100vw-80rem)/2-min(15.5rem,(100vw-80rem)/2)-1.25rem))] hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack startIndex={0} side="left" title="SF6 Gear Picks" />
      </aside>

      <aside
        aria-label="Desktop right rail"
        className="pointer-events-none fixed top-[7rem] bottom-10 z-20 right-[max(0px,calc((100vw-80rem)/2-min(15.5rem,(100vw-80rem)/2)-1.25rem))] hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack startIndex={5} side="right" title="FGC Deals" />
      </aside>
    </>
  );
}
