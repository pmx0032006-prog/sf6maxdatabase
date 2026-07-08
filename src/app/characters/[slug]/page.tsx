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
import { siteUrl } from "@/lib/site";
import { CharacterRelatedLinks } from "@/components/character/CharacterRelatedLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { getCharacterMoveImageFiles } from "@/lib/character-images";
import { resolveMoves } from "@/lib/resolve-moves";

export const dynamic = "force-dynamic"; // INTERNAL-LINKS-BACKBAR
// INTERNAL-LINKS-RELATED


type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return roster.map((character) => ({ slug: character.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const character = getCharacterBySlug(slug);
  if (!character) return { title: "Character" };

  const title = isCharacterReady(slug)
    ? `${character.en} SF6 Frame Data`
    : `${character.en} SF6 Frame Data (Coming Soon)`;
  const description = isCharacterReady(slug)
    ? `${character.en} Street Fighter 6 frame data, startup, block advantage, damage, and lightweight JPG hitbox images. Mobile-friendly SF6 database.`
    : `${character.en} Street Fighter 6 frame data page is coming soon on SF6 MAX DATABASE.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/characters/${slug}`,
    },
    openGraph: {
      title: `${title} | SF6 MAX DATABASE`,
      description,
      url: `${siteUrl}/characters/${slug}`,
    },
  };
}

function BackBar() {
  return (
    <div className="border-b border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-5 lg:px-6">
        <nav
          aria-label="Character page navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold tracking-[0.28em] text-white/50"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:text-accent"
          >
            <span aria-hidden>←</span>
            SF6 MAX DATABASE Home
          </Link>
          <Link href="/characters" className="hover:text-accent">
            SF6 Character List
          </Link>
        </nav>
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
          <CharacterDetailHeader en={character.en} ja={character.ja} slug={slug} />
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
        <CharacterDetailHeader en={character.en} ja={character.ja} slug={slug} />

        <CharacterTabs
          frameContent={<FrameDataList characterSlug={slug} moves={moves} />}
          strategyContent={
            classicArticle ? (
              <CharacterArticle
                badge="Classic"
                title={`Classic — ${character.en} guide`}
                content={classicArticle}
              />
            ) : (
              <PlaceholderPanel
                title="Classic guide"
                body={`Classic guide for ${character.en} is coming soon.`}
              />
            )
          }
          metagameContent={
            modernArticle ? (
              <CharacterArticle
                badge="Modern"
                title={`Modern — ${character.en} guide`}
                content={modernArticle}
              />
            ) : (
              <PlaceholderPanel
                title="Modern guide"
                body={`Modern guide for ${character.en} is coming soon.`}
              />
            )
          }
        />
      </main>
        <CharacterRelatedLinks currentSlug={slug} currentName={character.en} currentJa={character.ja} />

      <SiteFooter />
    </div>
  );
}
