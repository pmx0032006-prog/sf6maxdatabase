import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Rank | ${siteName}`,
  description: "Community SF6 character rank snapshot with links to frame data.",
  alternates: { canonical: `${siteUrl}/tier` },
};

export default function TierPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="tier" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
            Character Rank
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Community snapshot for quick research. Open any character for frame data and hitboxes.
          </p>
          <p className="mt-1 text-xs text-muted/80">
            Last updated: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div key={tier} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <p className="text-lg font-black text-foreground">Tier {tier}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {TIERS[tier].map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
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

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/matchups" className="font-semibold text-accent hover:text-accent-hover">
              Matchup Chart →
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← Back to roster
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
