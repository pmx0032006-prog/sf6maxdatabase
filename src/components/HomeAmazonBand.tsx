import Link from "next/link";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";

const GUIDE_HREF = "/guides/best-leverless-controllers-sf6";

/** Home roster-below Amazon band — Kitsune + Haute42 + leverless guide. */
export function HomeAmazonBand() {
  const gear = homePrimeGear();
  if (gear.length === 0) return null;

  return (
    <section
      aria-label="Recommended leverless controllers"
      className="rounded-xl border border-accent/25 bg-surface p-3 shadow-sm sm:p-4"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-bold tracking-[0.28em] text-accent uppercase">
            US FGC picks
          </p>
          <h2 className="mt-1 text-base font-black tracking-tight text-foreground sm:text-lg">
            Leverless for lab work
          </h2>
          <p className="mt-1 max-w-xl text-[13px] leading-snug text-muted sm:text-sm">
            You checked the roster — practice with a board that matches SF6 inputs.
          </p>
        </div>
        <Link
          href={GUIDE_HREF}
          className="shrink-0 text-[13px] font-semibold text-accent hover:text-accent-hover"
        >
          Full leverless guide →
        </Link>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {gear.map((item) => (
          <li key={item.asin}>
            <a
              href={gearHref(item.asin)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex h-full flex-col gap-1 rounded-lg border border-accent/30 bg-accent-soft/30 px-3.5 py-3 transition hover:border-accent hover:bg-accent-soft/50"
            >
              <span className="w-fit rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[12px] font-bold tracking-wide text-accent uppercase">
                {item.badge}
              </span>
              <span className="text-sm font-bold text-foreground">{item.shortLabel}</span>
              <span className="text-[13px] leading-snug text-muted">{item.tagline}</span>
              <span className="mt-auto rounded-md bg-accent py-1.5 text-center text-[13px] font-bold text-black transition group-hover:bg-accent-hover group-hover:text-white">
                Check price on Amazon →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-2.5 text-[12px] leading-relaxed text-muted/80">
        Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/disclosure" className="text-accent hover:text-accent-hover">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
