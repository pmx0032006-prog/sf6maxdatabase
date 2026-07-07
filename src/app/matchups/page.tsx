import Link from "next/link";
import { MatchupTable } from "@/components/MatchupTable";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_DISCLAIMER, META_UPDATED } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity diagram — win-rate style ratios, not match results.",
  alternates: { canonical: `${siteUrl}/matchups` },
};

export default function MatchupsPage() {
  const coreChars = MATCHUP_CORE.map((slug) => roster.find((c) => c.slug === slug)).filter(
    (c): c is (typeof roster)[number] => Boolean(c),
  );

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="matchups" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクター相性表
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            縦のキャラが横のキャラに対してどれだけ有利か（ダイヤグラム方式）。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">7-3</span> かなり有利 / <span translate="no">6-4</span> やや有利 / <span translate="no">5-5</span> 互角 / <span translate="no">4-6</span> やや不利 / <span translate="no">3-7</span> かなり不利
          </p>
          <p className="mt-1 text-xs text-muted/80">
            上ほど強キャラ・下ほど弱キャラ（ティア順）。全30キャラ（イングリッドまで）。
          </p>

          <MatchupTable coreChars={coreChars} />

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
