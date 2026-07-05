import Link from "next/link";

const GEAR_LINKS = [
  {
    label: "Street Fighter 6 (PS5)",
    href: "https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20",
  },
  {
    label: "8BitDo Arcade Stick",
    href: "https://www.amazon.com/dp/B08GJC5WSS?tag=sf6maxdatabas-20",
  },
  {
    label: "HORI Fighting Stick Alpha SF6 Edition",
    href: "https://www.amazon.com/dp/B0BZQKCFSD?tag=sf6maxdatabas-20",
  },
] as const;

export function AffiliateGearStrip() {
  return (
    <section
      aria-label="Recommended gear"
      className="mx-auto mt-8 max-w-2xl rounded-lg border border-border/60 bg-surface/40 px-4 py-5"
    >
      <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
        Recommended Gear
      </p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
        {GEAR_LINKS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-sm font-semibold text-accent hover:text-accent-hover"
            >
              {item.label} on Amazon →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
        Affiliate links — we may earn a commission at no extra cost to you. 
        <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
