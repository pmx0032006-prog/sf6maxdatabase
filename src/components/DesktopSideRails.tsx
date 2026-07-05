import Link from "next/link";

const GEAR = [
  {
    shortLabel: "Street Fighter 6",
    label: "Street Fighter 6 (PS5)",
    href: "https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20",
    badge: "PS5 Game",
    tagline: "Own the game. Check frame data faster.",
  },
  {
    shortLabel: "HORI Alpha Stick",
    label: "HORI Fighting Stick Alpha SF6 Edition",
    href: "https://www.amazon.com/dp/B0BZQKCFSD?tag=sf6maxdatabas-20",
    badge: "SF6 Edition",
    tagline: "Official SF6 fightstick for PS5 & PC.",
  },
  {
    shortLabel: "8BitDo Arcade Stick",
    label: "8BitDo Arcade Stick",
    href: "https://www.amazon.com/dp/B08GJC5WSS?tag=sf6maxdatabas-20",
    badge: "Budget Pick",
    tagline: "Wireless arcade stick for PC & Switch.",
  },
] as const;

const RAIL_COUNT = 8;

function pickGear(index: number, offset: number) {
  return GEAR[(index + offset) % GEAR.length];
}

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
      className="group flex min-h-0 flex-1 flex-col justify-between rounded-lg border border-accent/35 bg-gradient-to-b from-[#122018] to-[#0a0f0c] px-3 py-2.5 text-left shadow-md backdrop-blur-sm transition hover:border-accent hover:shadow-[0_0_18px_rgba(0,179,104,0.18)]"
    >
      <div>
        <span className="inline-block rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent-mint uppercase">
          {badge}
        </span>
        <p className="mt-2 text-[13px] font-black leading-tight text-white">
          {shortLabel}
        </p>
        <p className="mt-1 text-[10px] leading-snug text-white/60">{tagline}</p>
      </div>
      <span className="mt-2 block rounded-md bg-accent py-1.5 text-center text-[10px] font-bold tracking-wide text-black transition group-hover:bg-accent-mint">
        Shop on Amazon →
      </span>
    </a>
  );
}

function RailStack({
  offset,
  side,
  title,
}: {
  offset: number;
  side: "left" | "right";
  title: string;
}) {
  return (
    <div className="pointer-events-auto flex h-[calc(100vh-5rem)] flex-col gap-1.5 px-2.5 py-2">
      <p className="shrink-0 rounded-lg border border-accent/35 bg-accent/10 px-3 py-2 text-center text-[9px] font-bold tracking-[0.22em] text-accent-mint uppercase">
        {title}
      </p>
      {Array.from({ length: RAIL_COUNT }, (_, index) => {
        const item = pickGear(index, offset);
        return (
          <SideCard
            key={`${side}-${index}`}
            badge={item.badge}
            href={item.href}
            shortLabel={item.shortLabel}
            tagline={item.tagline}
          />
        );
      })}
      <Link
        href="/about#affiliate"
        className="shrink-0 rounded-md border border-white/10 bg-surface/70 px-3 py-1.5 text-center text-[9px] text-white/50 hover:text-accent"
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
        className="pointer-events-none fixed inset-y-14 left-0 z-20 hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack offset={0} side="left" title="SF6 Gear Picks" />
      </aside>

      <aside
        aria-label="Desktop right rail"
        className="pointer-events-none fixed inset-y-14 right-0 z-20 hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack offset={1} side="right" title="FGC Deals" />
      </aside>
    </>
  );
}
