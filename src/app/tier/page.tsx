import Link from "next/link";
import { MetaNextSteps } from "@/components/MetaNextSteps";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `SF6 Character Tier List (30 Fighters) | ${siteName}`,
  description:
    "Street Fighter 6 community character tier list — S+ through C rank for all 30 fighters. Tap any name for frame data and hitbox images. Updated 2026-07.",
  alternates: { canonical: `${siteUrl}/tier` },
  openGraph: {
    title: `SF6 Character Tier List | ${siteName}`,
    description:
      "Community tier rankings for all 30 SF6 characters. S+ Mai at top. Links to frame data for every fighter.",
    url: `${siteUrl}/tier`,
  },
};

export default function TierPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="tier" />
      <BreadcrumbJsonLd
        items={[{ name: "Home", item: siteUrl }, { name: "Tier List", item: `${siteUrl}/tier` }]}
      />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1
            id="page-top"
            className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl"
          >
            Character Tier List
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Community strength snapshot. Tap a name for frame data and hitbox images.
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Left = stronger within each tier, right = weaker. Updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div
                key={tier}
                className={`rounded-lg border bg-surface p-4 shadow-sm ${
                  tier === "S+" ? "border-amber-400/60 sm:col-span-2" : "border-border"
                }`}
              >
                <p
                  className={`text-lg font-black ${tier === "S+" ? "text-amber-600" : "text-foreground"}`}
                  translate="no"
                >
                  Tier {tier}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {TIERS[tier].map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                          translate="no"
                          title={char.ja}
                        >
                          {char.en}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <MetaNextSteps variant="tier" />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
