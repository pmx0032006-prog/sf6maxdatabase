import Link from "next/link";
import { notFound } from "next/navigation";
import { CharacterDetailHeader } from "@/components/character/CharacterDetailHeader";
import { CharacterPreparing } from "@/components/character/CharacterPreparing";
import { FrameDataList } from "@/components/character/FrameDataList";
import {
  getCharacterBySlug,
  isCharacterReady,
} from "@/lib/character-roster";
import { siteUrl } from "@/lib/site";
import { CharacterRelatedLinks } from "@/components/character/CharacterRelatedLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { roster } from "@/data/characters";
import { getCharacterMoveImageFiles } from "@/lib/character-images";
import { resolveMoves } from "@/lib/resolve-moves";
import { characterPageContainerClass } from "@/lib/character-page-layout";


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

  // SEO-STRENGTHEN-20260721
  const title = isCharacterReady(slug)
    ? `${character.en} SF6 Frame Data & Hitboxes`
    : `${character.en} SF6 Frame Data (Coming Soon)`;
  const description = isCharacterReady(slug)
    ? `${character.en} Street Fighter 6 frame data and lightweight JPG hitbox images — startup, block advantage, damage. Fast mobile SF6 database.`
    : `${character.en} Street Fighter 6 frame data page is coming soon on SF6 MAX DATABASE.`;
  const ogImage = character.thumb
    ? [{ url: character.thumb, width: 1200, height: 630, alt: `${character.en} Street Fighter 6` }]
    : undefined;

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
      images: ogImage,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: character.thumb ? [character.thumb] : undefined,
    },
  };
}

function BackBar() {
  return (
    <div className="sticky top-[var(--site-header-h)] z-40 border-b border-white/10 bg-[#0a0f0c]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0f0c]/90">
      <div className={characterPageContainerClass("py-3")}>
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

  const breadcrumbItems = [
    { name: "Home", item: siteUrl },
    { name: "Characters", item: `${siteUrl}/characters` },
    { name: character.en, item: `${siteUrl}/characters/${slug}` },
  ];

  if (!isCharacterReady(slug)) {
    return (
      <div className="flex min-h-full flex-col">
        <SiteHeader active="characters" />
        <BreadcrumbJsonLd items={breadcrumbItems} />
        <BackBar />
        <main className="flex-1">
          <CharacterDetailHeader
            en={character.en}
            ja={character.ja}
            slug={slug}
          />
          <CharacterPreparing en={character.en} ja={character.ja} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const imageFiles = getCharacterMoveImageFiles(slug);
  const moves = resolveMoves(slug, [], imageFiles);
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="characters" />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <BackBar />

      <main className="flex-1">
        <CharacterDetailHeader
          en={character.en}
          ja={character.ja}
          slug={slug}
        />

        <div className="bg-surface">
          <div className={characterPageContainerClass("py-8 sm:py-10 lg:py-12")}>
            <FrameDataList characterSlug={slug} moves={moves} />
          </div>
        </div>
      </main>
        <CharacterRelatedLinks currentSlug={slug} currentName={character.en} currentJa={character.ja} />

      <SiteFooter />
    </div>
  );
}
