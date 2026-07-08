import Link from "next/link";
import { roster } from "@/data/characters";
import { TIERS } from "@/data/character-meta";

function tierNames(slugs: readonly string[], limit = 2) {
  return slugs
    .slice(0, limit)
    .map((slug) => roster.find((c) => c.slug === slug)?.en ?? slug.toUpperCase())
    .join(" · ");
}

const chips = [
  {
    label: "ROSTER",
    value: String(roster.length),
    href: "/characters",
  },
  {
    label: "S TIER",
    value: tierNames(TIERS.S, 2),
    href: "/tier",
  },
  {
    label: "JPG",
    value: "hitbox",
    href: "/about",
  },
  {
    label: "VS",
    value: "notes",
    href: "/matchups",
  },
] as const;

type HeaderMetaStripProps = {
  className?: string;
};

export function HeaderMetaStrip({ className = "" }: HeaderMetaStripProps) {
  return (
    <div
      className={`header-meta-strip flex min-w-0 items-center justify-center gap-1 overflow-hidden sm:gap-1.5 ${className}`}
      aria-label="Quick meta links"
    >
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className="group inline-flex max-w-[5.5rem] items-baseline gap-1 truncate rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 transition hover:border-accent/35 hover:bg-accent/[0.08] sm:max-w-none sm:px-2"
          translate="no"
        >
          <span className="shrink-0 text-[7px] font-bold tracking-[0.22em] text-accent/75 sm:text-[8px]">
            {chip.label}
          </span>
          <span className="truncate text-[8px] font-bold uppercase tracking-[0.06em] text-white/70 group-hover:text-accent sm:text-[9px]">
            {chip.value}
          </span>
        </Link>
      ))}
    </div>
  );
}
