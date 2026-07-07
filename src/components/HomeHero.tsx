import Link from "next/link";
import { roster } from "@/data/characters";
import { siteTagline } from "@/lib/site";

const FEATURED_SLUGS = ["ryu", "ken", "luke", "juri", "chun-li", "aki"] as const;

export function HomeHero() {
  const featured = FEATURED_SLUGS.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <section className="border-b border-white/10 bg-[#0a0f0c] text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-10 sm:py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
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

        <ul
          className="grid grid-cols-3 gap-1.5 sm:gap-2"
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
      </div>
    </section>
  );
}
