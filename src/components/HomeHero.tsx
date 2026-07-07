import Link from "next/link";
import { roster } from "@/data/characters";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";
import { siteTagline } from "@/lib/site";

const FEATURED_SLUGS = ["ryu", "ken", "luke", "juri", "chun-li", "aki"] as const;

export function HomeHero() {
  const featured = FEATURED_SLUGS.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );
  const gear = homePrimeGear();

  return (
    <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-10 sm:py-3">
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]">
              Street Fighter 6
            </p>
            <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl lg:text-3xl">
              MAX <span className="text-accent">DATABASE</span>
            </h1>
            <p className="mt-1 max-w-lg text-[11px] leading-snug text-white/55 sm:text-xs">
              {siteTagline}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-start lg:justify-self-end">
          <ul
            className="grid w-full max-w-[15rem] shrink-0 grid-cols-3 gap-1.5 sm:max-w-[16.5rem] sm:gap-2"
            aria-label="Featured characters"
          >
            {featured.map((character) => (
              <li key={character.slug}>
                <Link
                  href={`/characters/${character.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#0d1210] shadow-sm transition hover:border-accent/50 hover:shadow-[0_0_12px_rgba(0,179,104,0.2)]"
                >
                  {character.thumb ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-no-repeat transition duration-300 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${character.thumb})`,
                        backgroundPosition: "center top",
                      }}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] font-bold text-white/40">
                      {character.en}
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-1 text-[8px] font-bold tracking-wide text-white/90 sm:text-[9px]">
                    {character.en}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* ADSENSE-HOME-PRIME: hero right rail — swap for AdSense after approval */}
          <ul
            className="hidden w-[10.5rem] shrink-0 flex-col gap-1.5 sm:flex"
            aria-label="Featured SF6 gear"
          >
            {gear.map((item) => (
              <li key={item.asin}>
                <a
                  href={gearHref(item.asin)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="group flex flex-col gap-1 rounded-md border border-accent/30 bg-gradient-to-b from-[#122018] to-[#0a0f0c] px-2.5 py-2 transition hover:border-accent hover:shadow-[0_0_14px_rgba(0,179,104,0.16)]"
                >
                  <span className="w-fit rounded-full border border-accent/35 bg-accent/10 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-accent-mint uppercase">
                    {item.badge}
                  </span>
                  <p className="text-[11px] font-black leading-tight">{item.shortLabel}</p>
                  <p className="line-clamp-2 text-[9px] leading-snug text-white/60">{item.tagline}</p>
                  <span className="mt-0.5 rounded bg-accent py-1 text-center text-[9px] font-bold text-black group-hover:bg-accent-mint">
                    Amazon →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          </div>
        </div>

        <p className="mt-2 hidden text-[9px] text-white/40 sm:block">
          Affiliate links —{" "}
          <Link href="/about#affiliate" className="text-accent/80 hover:text-accent">
            Disclosure
          </Link>
        </p>
      </div>
    </section>
  );
}
