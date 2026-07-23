import { Suspense } from "react";
import { MetaNextSteps } from "@/components/MetaNextSteps";
import { MatchupTable } from "@/components/MatchupTable";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_DISCLAIMER, META_UPDATED } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `SF6 Matchup Chart (30×29 Grid) | ${siteName}`,
  description:
    "Full Street Fighter 6 matchup chart for all 30 characters. Win-rate style ratios (7-3 to 3-7), tap-to-read notes, shareable links. Mobile-friendly.",
  alternates: { canonical: `${siteUrl}/matchups` },
  openGraph: {
    title: `SF6 Character Matchup Chart | ${siteName}`,
    description:
      "870 matchup cells with community notes. Diagram-style ratios for every SF6 character pairing. Tap a cell to read tips.",
    url: `${siteUrl}/matchups`,
  },
};

export default function MatchupsPage() {
  const coreChars = MATCHUP_CORE.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="matchups" />
      <BreadcrumbJsonLd
        items={[{ name: "Home", item: siteUrl }, { name: "Matchups", item: `${siteUrl}/matchups` }]}
      />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1
            id="page-top"
            className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl"
          >
            Character Matchup Chart
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Row vs column — how favorable each matchup is (diagram-style ratios).
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">7-3</span> strong advantage / <span translate="no">6-4</span> slight edge /{" "}
            <span translate="no">5-5</span> even / <span translate="no">4-6</span> slight disadvantage /{" "}
            <span translate="no">3-7</span> hard disadvantage
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Stronger characters toward the top, weaker toward the bottom (tier order). All 30 fighters including Ingrid.
          </p>

          <Suspense
            fallback={
              <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
                Loading matchup chart…
              </p>
            }
          >
            <MatchupTable coreChars={coreChars} />
          </Suspense>

          <MetaNextSteps variant="matchups" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
