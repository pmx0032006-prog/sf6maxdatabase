import Link from "next/link";
import { AdSenseSlot } from "@/components/AdSenseSlot";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { gearByAsin, gearHref } from "@/data/affiliate-gear";
import { siteName, siteNameFull, siteUrl } from "@/lib/site";
import type { Metadata } from "next";

const PATH = "/guides/best-leverless-controllers-sf6";

export const metadata: Metadata = {
  title: "Best Leverless Controllers for Street Fighter 6 (2026)",
  description:
    "US FGC leverless picks for SF6 — Kitsune, Haute42, Victrix FS-12, and more. Amazon picks with honest platform notes.",
  alternates: { canonical: `${siteUrl}${PATH}` },
  openGraph: {
    title: `Best Leverless Controllers for SF6 | ${siteName}`,
    description:
      "US FGC leverless picks for SF6 — Kitsune, Haute42, Victrix FS-12, and more. Amazon picks with honest platform notes.",
    url: `${siteUrl}${PATH}`,
  },
};

type PickRow = {
  asin: string;
  platforms: string;
  bestFor: string;
  watchOuts: string;
  warn?: boolean;
};

const MAIN_PICKS: PickRow[] = [
  {
    asin: "B0CCX2DMXV",
    platforms: "PS5, PC",
    bestFor: "US #1 tournament leverless",
    watchOuts: "Premium price band",
  },
  {
    asin: "B0DQ4PTBCW",
    platforms: "PC (PS5 needs converter)",
    bestFor: "High-value budget aluminum",
    watchOuts: "PS5 play usually needs a dongle / adapter",
  },
  {
    asin: "B0B3VQKGHW",
    platforms: "PS5, PS4, PC",
    bestFor: "Premium modular leverless",
    watchOuts: "Higher spend than Kitsune-class entry",
  },
  {
    asin: "B0F7RMB4RH",
    platforms: "Xbox Series X|S, PC",
    bestFor: "Affordable all-button buzz pick",
    watchOuts: "Not PS5 compatible — do not buy for PS5-only setups",
    warn: true,
  },
];

const CONVERTERS: PickRow[] = [
  {
    asin: "B0GSHLBQSB",
    platforms: "PS5 add-on",
    bestFor: "Haute42 boards on PS5 fighting games",
    watchOuts: "Only needed if your pad is not native PS5",
  },
  {
    asin: "B0DLWD1WMQ",
    platforms: "PS5 adapter",
    bestFor: "Broad stick / leverless PS5 conversion",
    watchOuts: "Check your controller compatibility before buying",
  },
];

function AmazonCta({ asin, label = "Check price on Amazon →" }: { asin: string; label?: string }) {
  return (
    <a
      href={gearHref(asin)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center justify-center rounded-md bg-accent px-3 py-2 text-center text-[11px] font-bold text-black transition hover:bg-accent-hover hover:text-white"
    >
      {label}
    </a>
  );
}

function PickCard({ pick }: { pick: PickRow }) {
  const gear = gearByAsin(pick.asin);
  if (!gear) return null;

  return (
    <article
      className={`flex flex-col gap-2 rounded-lg border bg-surface p-4 shadow-sm ${
        pick.warn ? "border-red-400/50" : "border-border/80"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent uppercase">
          {gear.badge}
        </span>
        {pick.warn ? (
          <span className="rounded-full border border-red-400/50 bg-red-50 px-2 py-0.5 text-[9px] font-bold tracking-wide text-red-700 uppercase">
            Not for PS5
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-black tracking-tight text-foreground">{gear.shortLabel}</h3>
      <p className="text-sm leading-relaxed text-muted">{gear.tagline}</p>
      <dl className="mt-1 grid gap-1 text-[12px] text-muted sm:grid-cols-[6.5rem_1fr]">
        <dt className="font-bold text-foreground/80">Platforms</dt>
        <dd>{pick.platforms}</dd>
        <dt className="font-bold text-foreground/80">Best for</dt>
        <dd>{pick.bestFor}</dd>
        <dt className="font-bold text-foreground/80">Watch-outs</dt>
        <dd className={pick.warn ? "font-semibold text-red-700" : undefined}>{pick.watchOuts}</dd>
      </dl>
      <div className="mt-2">
        <AmazonCta asin={pick.asin} />
      </div>
    </article>
  );
}

export default function BestLeverlessGuidePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: siteUrl },
          { name: "Guides", item: `${siteUrl}/guides/best-leverless-controllers-sf6` },
          { name: "Best Leverless Controllers", item: `${siteUrl}${PATH}` },
        ]}
      />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="Best Leverless Controllers for SF6"
          subtitle="US FGC picks with honest platform notes — chosen from a frame + hitbox database"
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-10 sm:py-16">
            <article className="space-y-3">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Who this is for
              </h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                Competitive Street Fighter 6 players who already study frame data and hitboxes —
                and want controllers that make clean inputs and tight links more consistent in the
                lab and in ranked.
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Why leverless matters in SF6
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted sm:text-base">
                <li>Simultaneous opposing directions and SOCD-clean inputs</li>
                <li>Faster directional changes than a gate + stick for many players</li>
                <li>
                  Pairs with frame-data study: practice the timing you see on{" "}
                  <Link href="/characters" className="font-semibold text-accent hover:text-accent-hover">
                    the character roster
                  </Link>
                </li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Quick picks
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {MAIN_PICKS.map((pick) => (
                  <PickCard key={pick.asin} pick={pick} />
                ))}
              </div>
            </article>

            <article className="space-y-4">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Comparison
              </h2>
              <div className="overflow-x-auto rounded-lg border border-border/80 bg-surface">
                <table className="min-w-full text-left text-[12px] sm:text-sm">
                  <thead className="border-b border-border/80 bg-[#0a0f0c] text-white">
                    <tr>
                      <th className="px-3 py-2.5 font-bold">Product</th>
                      <th className="px-3 py-2.5 font-bold">Platforms</th>
                      <th className="px-3 py-2.5 font-bold">Best for</th>
                      <th className="px-3 py-2.5 font-bold">Watch-outs</th>
                      <th className="px-3 py-2.5 font-bold">Amazon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MAIN_PICKS.map((pick) => {
                      const gear = gearByAsin(pick.asin);
                      if (!gear) return null;
                      return (
                        <tr key={pick.asin} className="border-b border-border/60 last:border-0">
                          <td className="px-3 py-3 font-semibold text-foreground">
                            {gear.shortLabel}
                          </td>
                          <td className="px-3 py-3 text-muted">{pick.platforms}</td>
                          <td className="px-3 py-3 text-muted">{pick.bestFor}</td>
                          <td
                            className={`px-3 py-3 ${
                              pick.warn ? "font-semibold text-red-700" : "text-muted"
                            }`}
                          >
                            {pick.watchOuts}
                          </td>
                          <td className="px-3 py-3">
                            <AmazonCta asin={pick.asin} label="Amazon →" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted/80">
                Prices move often — use Amazon for the live USD price. Links use our Associates tag.
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Who should not buy leverless
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted sm:text-base">
                <li>Players happy on pad who do not want a new muscle-memory project</li>
                <li>Strict PS5-only buyers looking at Xbox-only boards (see 8BitDo note above)</li>
                <li>Anyone expecting a controller alone to replace frame study and reps</li>
              </ul>
            </article>

            <article className="space-y-4">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Converters (only if you need them)
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {CONVERTERS.map((pick) => (
                  <PickCard key={pick.asin} pick={pick} />
                ))}
              </div>
            </article>

            <article className="space-y-3">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Practice with the data
              </h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {siteNameFull} is built for lightweight JPG hitboxes and full frame rows — study a
                character, then take those timings into training mode.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link
                  href="/characters"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Character roster →
                </Link>
                <Link
                  href="/characters/ryu"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Ryu frames →
                </Link>
                <Link
                  href="/about#jpg"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Why JPG →
                </Link>
              </div>
            </article>

            <AdSenseSlot slotId="adsense-guide-bottom" />

            <article className="space-y-3">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Disclosure
              </h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                Amazon Associate links may earn us a commission at no extra cost to you. Hitbox and
                frame data are not altered to sell gear. Full details:{" "}
                <Link href="/disclosure" className="font-semibold text-accent hover:text-accent-hover">
                  Ads & Affiliate Disclosure
                </Link>
                .
              </p>
            </article>

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/characters"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Look up frames →
              </Link>
              <Link
                href="/disclosure"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                Disclosure
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
