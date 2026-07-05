import Link from "next/link";

const GEAR = [
  {
    label: "Street Fighter 6 (PS5)",
    href: "https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20",
    note: "Game",
  },
  {
    label: "HORI Fighting Stick Alpha SF6 Edition",
    href: "https://www.amazon.com/dp/B0BZQKCFSD?tag=sf6maxdatabas-20",
    note: "Fightstick",
  },
  {
    label: "8BitDo Arcade Stick",
    href: "https://www.amazon.com/dp/B08GJC5WSS?tag=sf6maxdatabas-20",
    note: "Arcade stick",
  },
] as const;

const LEFT_RAIL = [
  GEAR[0],
  GEAR[1],
  GEAR[2],
  GEAR[1],
  GEAR[0],
  GEAR[2],
  GEAR[1],
  GEAR[0],
] as const;

const RIGHT_RAIL = [
  GEAR[1],
  GEAR[0],
  GEAR[2],
  GEAR[0],
  GEAR[1],
  GEAR[2],
  GEAR[0],
  GEAR[1],
] as const;

function SideCard({
  label,
  href,
  note,
  index,
}: {
  label: string;
  href: string;
  note: string;
  index: number;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex min-h-0 flex-1 flex-col justify-center rounded-lg border border-white/10 bg-[#0a0f0c]/95 p-2 text-center shadow-lg backdrop-blur-sm transition hover:border-accent/40"
    >
      <p className="text-[8px] font-bold tracking-[0.22em] text-accent uppercase">
        Pick {index + 1}
      </p>
      <p className="mt-1 text-[10px] font-semibold leading-snug text-white/80">
        {label}
      </p>
      <p className="mt-1 text-[9px] text-white/35">{note}</p>
      <p className="mt-1 text-[9px] font-bold text-accent">Amazon →</p>
    </a>
  );
}

function RailStack({
  items,
  side,
}: {
  items: readonly (typeof GEAR)[number][];
  side: "left" | "right";
}) {
  return (
    <div className="pointer-events-auto flex h-[calc(100vh-6rem)] flex-col gap-2 px-2 py-3">
      <p className="rounded border border-accent/25 bg-surface/80 px-2 py-2 text-center text-[8px] font-bold tracking-[0.22em] text-accent uppercase">
        SF6 Gear
      </p>
      {items.map((item, index) => (
        <SideCard
          key={`${side}-${item.href}-${index}`}
          href={item.href}
          index={index}
          label={item.label}
          note={item.note}
        />
      ))}
      <Link
        href="/about#affiliate"
        className="rounded border border-white/10 bg-surface/70 px-2 py-2 text-center text-[9px] text-white/45 hover:text-accent"
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
        className="pointer-events-none fixed inset-y-16 left-0 z-20 hidden w-[min(12rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack items={LEFT_RAIL} side="left" />
      </aside>

      <aside
        aria-label="Desktop right rail"
        className="pointer-events-none fixed inset-y-16 right-0 z-20 hidden w-[min(12rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack items={RIGHT_RAIL} side="right" />
      </aside>
    </>
  );
}
