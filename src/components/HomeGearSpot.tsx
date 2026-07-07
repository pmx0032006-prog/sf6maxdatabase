import Link from "next/link";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";

export function HomeGearSpot() {
  const items = homePrimeGear();

  return (
    <section
      aria-label="Featured SF6 gear"
      className="border-b border-border/50 bg-background"
    >
      {/* ADSENSE-HOME-PRIME: replace or stack AdSense auto ads here after approval */}
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-10 sm:py-4">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Gear picks
        </p>
        <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.asin}>
              <a
                href={gearHref(item.asin)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex flex-col gap-1 rounded-lg border border-accent/25 bg-surface/60 px-3 py-2.5 transition hover:border-accent/50 hover:bg-[#eef8f2]/80 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <div className="min-w-0">
                  <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent uppercase">
                    {item.badge}
                  </span>
                  <p className="mt-1 text-sm font-bold text-foreground">{item.shortLabel}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{item.tagline}</p>
                </div>
                <span className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-center text-[10px] font-bold text-black transition group-hover:bg-accent-mint sm:min-w-[7.5rem]">
                  Amazon →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted/80">
          Affiliate links — we may earn a commission.{" "}
          <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
            Disclosure
          </Link>
        </p>
      </div>
    </section>
  );
}
