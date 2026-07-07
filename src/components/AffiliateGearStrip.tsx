import Link from "next/link";
import { AFFILIATE_GEAR, gearHref } from "@/data/affiliate-gear";

export function AffiliateGearStrip() {
  return (
    <section
      aria-label="Recommended gear"
      className="mx-auto mt-8 max-w-2xl rounded-lg border border-border/60 bg-surface/40 px-4 py-5"
    >
      <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
        Recommended Gear
      </p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-2">
        {AFFILIATE_GEAR.map((item) => (
          <li key={item.asin}>
            <a
              href={gearHref(item.asin)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-semibold text-accent hover:text-accent-hover sm:text-sm"
            >
              {item.shortLabel} on Amazon →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
        Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
