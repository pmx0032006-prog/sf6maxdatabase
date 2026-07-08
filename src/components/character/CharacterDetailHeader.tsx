import Link from "next/link";
import { CharacterFavoriteButton } from "@/components/CharacterFavoriteButton";

type CharacterDetailHeaderProps = {
  en: string;
  ja: string;
  slug: string;
};

export function CharacterDetailHeader({
  en,
  ja,
  slug,
}: CharacterDetailHeaderProps) {
  return (
    <section className="bg-[#0a0f0c] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-5 sm:py-12 lg:px-6">
        <h1 className="font-display text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl lg:text-7xl">
          {en}
        </h1>
        <p className="mt-3 text-base text-white/50 sm:text-lg">{ja}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={`/matchups?char=${slug}`}
            className="inline-flex items-center rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-accent transition hover:border-accent hover:bg-accent/20"
          >
            Matchup chart →
          </Link>
          <Link
            href="/tier"
            className="inline-flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold tracking-wide text-white/70 transition hover:border-accent/35 hover:text-accent"
          >
            Tier list
          </Link>
          <CharacterFavoriteButton slug={slug} en={en} />
        </div>
      </div>
    </section>
  );
}
