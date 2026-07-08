import Link from "next/link";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";
import { newsItems } from "@/data/news";

export function HomeSidebar() {
  const gear = homePrimeGear();
  const latestNews = newsItems.slice(0, 3);

  return (
    <aside
      aria-label="Recommendations and updates"
      className="flex flex-col gap-4 lg:sticky lg:top-16 lg:self-start"
    >
      {/* ADSENSE-HOME-SIDEBAR: swap or stack AdSense units here after approval */}
      <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Recommended
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {gear.map((item) => (
            <li key={item.asin}>
              <a
                href={gearHref(item.asin)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex flex-col gap-1 rounded-md border border-accent/25 bg-accent-soft/40 px-3 py-2.5 transition hover:border-accent/60 hover:bg-accent-soft"
              >
                <span className="w-fit rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent uppercase">
                  {item.badge}
                </span>
                <span className="text-sm font-bold leading-tight text-foreground">
                  {item.shortLabel}
                </span>
                <span className="text-[11px] leading-snug text-muted">{item.tagline}</span>
                <span className="mt-0.5 rounded bg-accent py-1 text-center text-[10px] font-bold text-black transition group-hover:bg-accent-hover group-hover:text-white">
                  View on Amazon →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] leading-relaxed text-muted/80">
          Affiliate links — we may earn a commission.{" "}
          <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
            Disclosure
          </Link>
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Latest
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {latestNews.map((item) => (
            <li key={`${item.date}-${item.title}`} className="flex flex-col gap-0.5">
              <time
                dateTime={item.date.replace(/\./g, "-")}
                className="font-mono text-[10px] font-semibold tracking-wider text-accent"
              >
                {item.date}
              </time>
              <span className="text-[11px] leading-snug text-foreground">{item.title}</span>
            </li>
          ))}
        </ul>
        <Link
          href="/#news"
          className="mt-2 block text-[10px] font-bold tracking-wide text-accent hover:text-accent-hover"
        >
          All updates →
        </Link>
      </section>
    </aside>
  );
}
