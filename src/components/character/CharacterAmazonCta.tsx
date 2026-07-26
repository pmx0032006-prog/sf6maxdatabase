import Link from "next/link";
import { AFFILIATE_GEAR, gearHref } from "@/data/affiliate-gear";

/** After frame data — high-intent Amazon CTA (leverless / stick first). */
const CTA_ASINS = ["B0CCX2DMXV", "B0BZQKCFSD", "B0BYQCPDTP"] as const;

export function CharacterAmazonCta({ characterEn }: { characterEn: string }) {
  const items = CTA_ASINS.map((asin) =>
    AFFILIATE_GEAR.find((g) => g.asin === asin),
  ).filter((item): item is (typeof AFFILIATE_GEAR)[number] => Boolean(item));

  if (items.length === 0) return null;

  return (
    <section
      aria-label="Recommended controllers"
      className="border-t border-border/50 bg-surface"
    >
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-3xl lg:px-8">
        <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
          Train what you just checked
        </p>
        <h2 className="mt-2 text-lg font-black tracking-tight text-foreground sm:text-xl">
          Controllers for {characterEn} lab work
        </h2>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
          You studied the hitboxes. A solid leverless or stick makes that data usable in ranked.
        </p>
        <ul className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          {items.map((item) => (
            <li key={item.asin} className="sm:min-w-[14rem] sm:flex-1">
              <a
                href={gearHref(item.asin)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex h-full flex-col gap-1 rounded-lg border border-accent/30 bg-accent-soft/30 px-3.5 py-3 transition hover:border-accent hover:bg-accent-soft/50"
              >
                <span className="w-fit rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent uppercase">
                  {item.badge}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {item.shortLabel}
                </span>
                <span className="text-[11px] leading-snug text-muted">
                  {item.tagline}
                </span>
                <span className="mt-auto rounded-md bg-accent py-1.5 text-center text-[11px] font-bold text-black transition group-hover:bg-accent-hover group-hover:text-white">
                  Check price on Amazon →
                </span>
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
      </div>
    </section>
  );
}
