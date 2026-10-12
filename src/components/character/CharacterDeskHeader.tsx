import Link from "next/link";
import { CharacterFavoriteButton } from "@/components/CharacterFavoriteButton";
import { HitboxColorLegend } from "@/components/character/HitboxColorLegend";
import { characterPageContainerClass } from "@/lib/character-page-layout";
import { DeskTitleLink } from "@/components/character/DeskTitleLink";

type Props = { en: string; ja: string; slug: string };

/** PC-first compact header: name + actions on one row, legend folded away. */
export function CharacterDeskHeader({ en, ja, slug }: Props) {
  return (
    <section className="bg-[#0a0f0c] text-white">
      <div className={characterPageContainerClass("py-5")}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            <DeskTitleLink label={`Back to ${en} top`}>
              {en}
              <span className="ml-3 text-base font-semibold text-white/50">{ja}</span>
            </DeskTitleLink>
          </h1>
          <p className="hidden text-sm text-white/50 md:block">SF6 frame data and hitbox images</p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Link
              href={`/matchups?char=${slug}`}
              className="inline-flex items-center rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:border-accent hover:bg-accent/20"
            >
              Matchup chart →
            </Link>
            <Link
              href="/tier"
              className="inline-flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/70 transition hover:border-accent/35 hover:text-accent"
            >
              Tier list
            </Link>
            <CharacterFavoriteButton slug={slug} en={en} />
          </div>
        </div>
        <details className="mt-3 text-white/70">
          <summary className="cursor-pointer text-xs font-semibold text-white/60 hover:text-white">
            What the hitbox colors mean
          </summary>
          <div className="mt-2 text-foreground">
            <HitboxColorLegend />
          </div>
        </details>
      </div>
    </section>
  );
}
