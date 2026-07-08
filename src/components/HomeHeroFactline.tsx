import Link from "next/link";

const chips = [
  {
    label: "hitbox demo",
    href: "/characters/ryu",
    title: "JPG hitbox images on Ryu move cards",
  },
  {
    label: "why JPG",
    href: "/about#jpg",
    title: "Why we use lightweight JPGs instead of GIFs",
  },
  {
    label: "hitbox colors",
    href: "/about#hitbox-colors",
    title: "Red, green, pink hitbox color legend",
  },
  {
    label: "read guide",
    href: "/about#read",
    title: "How to read St, Bk, and multi-frame hitboxes",
  },
] as const;

type HomeHeroFactlineProps = {
  className?: string;
};

export function HomeHeroFactline({ className = "" }: HomeHeroFactlineProps) {
  return (
    <nav
      className={`home-hero-factline hidden min-w-0 flex-nowrap items-center justify-center gap-1 overflow-x-auto px-1 sm:flex sm:gap-1.5 sm:overflow-visible lg:flex-1 ${className}`}
      aria-label="Quick data shortcuts"
      translate="no"
    >
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          title={chip.title}
          className="shrink-0 rounded border border-accent/25 bg-accent/[0.06] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-accent transition hover:border-accent/50 hover:bg-accent/[0.14] hover:text-accent-mint sm:px-2 sm:text-[9px]"
        >
          {chip.label}
        </Link>
      ))}
    </nav>
  );
}
