import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import {
  MATCHUP_CORE,
  MATCHUP_LABELS,
  MATCHUP_LABELS_JA,
  MATCHUPS,
  META_DISCLAIMER,
  META_UPDATED,
  type MatchupRating,
} from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity chart — advantage between characters, not match results.",
  alternates: { canonical: `${siteUrl}/matchups` },
};

function ratingClass(rating: MatchupRating): string {
  if (rating === "++") return "bg-emerald-500/20 text-emerald-700";
  if (rating === "+") return "bg-accent/15 text-accent";
  if (rating === "=") return "bg-surface text-muted";
  if (rating === "-") return "bg-orange-500/15 text-orange-700";
  return "bg-red-500/15 text-red-700";
}

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
            縦のキャラが横のキャラに対してどれだけ有利か（試合結果ではなく相性の目安）。各キャラページのフレームデータと併用してください。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-muted">
            <span translate="no">++</span> かなり有利 / <span translate="no">+</span> やや有利 / <span translate="no">=</span> 互角 / <span translate="no">-</span> やや不利 / <span translate="no">--</span> かなり不利
          </p>
          <p className="mt-1 text-xs text-muted/80">
            上ほど強キャラ・下ほど弱キャラ（ティア順）。全30キャラ（イングリッドまで）。
          </p>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
            <table className="min-w-full border-collapse text-center text-[10px] sm:text-xs">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="sticky left-0 z-10 bg-background px-2 py-2 text-left font-bold" translate="no">
                    相手 →
                  </th>
                  {coreChars.map((col) => (
                    <th key={col.slug} className="min-w-[2.5rem] px-1 py-2 font-bold">
                      <Link
                        href={`/characters/${col.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={col.en}
                      >
                        {col.ja}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coreChars.map((row) => (
                  <tr key={row.slug} className="border-b border-border/70 last:border-0">
                    <th className="sticky left-0 z-10 bg-surface px-2 py-2 text-left font-bold">
                      <Link
                        href={`/characters/${row.slug}`}
                        className="hover:text-accent"
                        translate="no"
                        lang="ja"
                        title={row.en}
                      >
                        {row.ja}
                      </Link>
                    </th>
                    {coreChars.map((col) => {
                      if (row.slug === col.slug) {
                        return (
                          <td key={col.slug} className="px-1 py-2 text-muted">
                            —
                          </td>
                        );
                      }
                      const rating = MATCHUPS[row.slug]?.[col.slug] ?? ("=" as MatchupRating);
                      return (
                        <td key={col.slug} className="px-1 py-2">
                          <span
                            className={`inline-block min-w-[1.75rem] rounded px-1 py-0.5 font-bold ${ratingClass(rating)}`}
                            title={MATCHUP_LABELS_JA[rating]}
                            translate="no"
                          >
                            {rating}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
