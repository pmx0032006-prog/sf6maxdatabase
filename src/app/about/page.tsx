import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteName, siteNameFull } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `${siteNameFull} — 軽量JPG判定画像とフレーム数値の見方`,
};

const sections = [
  {
    id: "concept",
    title: "このサイトについて",
    body: [
      `${siteNameFull} は、ストリートファイター6のフレームデータと判定画像を、スマートフォンでも素早く開けることを優先したデータベースです。`,
      "約3万枚の素材から抽出した低画質JPGを使い、ギガを食わず・低スペック端末でもサクッと確認できることを目指しています。",
    ],
  },
  {
    id: "jpg",
    title: "なぜGIFではなくJPGか",
    body: [
      "アニメーション付きヒットボックスGIFは情報量が多い一方、1ページあたりの転送量が大きくなりがちです。",
      "当サイトは静止画JPGに絞ることで、電車の中・対戦合間・モバイル回線でも技ごとのフレームをすぐ見られるようにしています。",
      "1つの技に複数フレーム（_1, _2, _3 …）がある場合は、カード内のサムネまたは拡大画面で ← → キーで切り替えできます。",
    ],
  },
  {
    id: "read",
    title: "データの見方",
    items: [
      {
        term: "発 / ガ / DMG",
        desc: "起動フレーム、ガード時有利、ダメージなど。Wiki由来の数値表をそのまま掲載しています。",
      },
      {
        term: "_1 _2 _3 …",
        desc: "同一技の判定フレーム連番です。カード下部または拡大表示で確認できます。",
      },
      {
        term: "セクション分け",
        desc: "立ち通常・しゃがみ・必殺技・スーパーアーツなど、対戦で探しやすい順に並べています。",
      },
      {
        term: "—（ダッシュ）",
        desc: "該当データがない、または技性質上数値が存在しない場合に表示されます。",
      },
    ],
  },
  {
    id: "source",
    title: "データソース",
    body: [
      "フレーム数値は SuperCombo Wiki（Cargo API）をベースに加工・統合しています。",
      "判定画像は独自素材（約3万枚規模の抽出セット）を使用しています。",
      "数値の正確性は常に改善中です。誤りに気づいた場合は今後の更新で反映します。",
    ],
  },
  {
    id: "roadmap",
    title: "今後の方針",
    body: [
      "現在は日本語ベースで開発中です。将来的には多言語展開を予定しています。",
      "攻略記事は載せず、フレームデータと判定画像の辞書として育てます。",
      "公開範囲・地域設定などの細部は、仕上げ段階で調整します。",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="About"
          subtitle="軽量JPG × フレーム数値 — モバイル向けSF6データベース"
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-10 sm:py-16">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="space-y-4">
                <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {section.title}
                </h2>
                {"body" in section && section.body
                  ? section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 24)}
                        className="text-sm leading-relaxed text-muted sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))
                  : null}
                {"items" in section && section.items ? (
                  <dl className="divide-y divide-border rounded-lg border border-border/80 bg-surface">
                    {section.items.map((item) => (
                      <div
                        key={item.term}
                        className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4 sm:px-5 sm:py-4"
                      >
                        <dt className="text-xs font-bold tracking-wide text-accent sm:text-sm">
                          {item.term}
                        </dt>
                        <dd className="text-sm leading-relaxed text-muted">
                          {item.desc}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </article>
            ))}

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/characters"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                キャラ一覧へ →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                トップへ戻る
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
