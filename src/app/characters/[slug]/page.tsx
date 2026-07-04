import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterDetailHeader } from "@/components/character/CharacterDetailHeader";
import { CharacterPreparing } from "@/components/character/CharacterPreparing";
import { CharacterTabs } from "@/components/character/CharacterTabs";
import { FrameDataList } from "@/components/character/FrameDataList";
import { CharacterArticle } from "@/components/character/CharacterArticle";
import { PlaceholderPanel } from "@/components/character/PlaceholderPanel";
import { getCharacterArticleText } from "@/lib/character-text";
import {
  getCharacterBySlug,
  isCharacterReady,
} from "@/lib/character-roster";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { getCharacterMoveImageFiles } from "@/lib/character-images";
import { resolveMoves } from "@/lib/resolve-moves";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return roster.map((character) => ({ slug: character.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  if (!character) return { title: "キャラクター" };

  return {
    title: character.en,
    description: isCharacterReady(slug)
      ? `${character.ja}のフレームデータ・判定画像`
      : `${character.ja} — 準備中`,
  };
}

function BackBar() {
  return (
    <div className="border-b border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-5 lg:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-white/50 hover:text-accent"
        >
          <span aria-hidden>←</span>
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}

export default async function CharacterDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);

  if (!character) {
    notFound();
  }

  if (!isCharacterReady(slug)) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader active="characters" />
        <BackBar />
        <main className="flex-1">
          <CharacterDetailHeader en={character.en} ja={character.ja} />
          <CharacterPreparing en={character.en} ja={character.ja} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const imageFiles = getCharacterMoveImageFiles(slug);
  const moves = resolveMoves(slug, [], imageFiles);
  const classicArticle = getCharacterArticleText(slug, "c");
  const modernArticle = getCharacterArticleText(slug, "m");

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="characters" />

      <BackBar />

      <main className="flex-1">
        <CharacterDetailHeader en={character.en} ja={character.ja} />

        <CharacterTabs
          frameContent={<FrameDataList characterSlug={slug} moves={moves} />}
          strategyContent={
            classicArticle ? (
              <CharacterArticle
                badge="Classic"
                title={`クラシック・${character.ja}攻略`}
                content={classicArticle}
              />
            ) : (
              <PlaceholderPanel
                title="クラシック攻略"
                body={`${character.ja}のクラシック攻略記事は準備中です。`}
              />
            )
          }
          metagameContent={
            modernArticle ? (
              <CharacterArticle
                badge="Modern"
                title={`モダン・${character.ja}攻略`}
                content={modernArticle}
              />
            ) : (
              <PlaceholderPanel
                title="モダン攻略"
                body={`${character.ja}のモダン攻略記事は準備中です。`}
              />
            )
          }
        />
      </main>

      <SiteFooter />
    </div>
  );
}
