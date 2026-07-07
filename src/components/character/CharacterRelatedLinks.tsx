import Link from "next/link";
import { roster } from "@/data/characters";

type CharacterRelatedLinksProps = {
  currentSlug: string;
  currentName: string;
  currentJa?: string;
};

function titleCase(name: string): string {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function pickRelatedSlugs(currentSlug: string, count = 4): string[] {
  const index = roster.findIndex((character) => character.slug === currentSlug);
  if (index < 0) {
    return roster.slice(0, count).map((character) => character.slug);
  }

  const picks: string[] = [];
  for (let offset = 1; picks.length < count && offset < roster.length; offset += 1) {
    const slug = roster[(index + offset) % roster.length].slug;
    if (slug !== currentSlug) {
      picks.push(slug);
    }
  }
  return picks;
}

export function CharacterRelatedLinks({
  currentSlug,
  currentName,
  currentJa,
}: CharacterRelatedLinksProps) {
  const related = pickRelatedSlugs(currentSlug)
    .map((slug) => roster.find((character) => character.slug === slug))
    .filter((character): character is (typeof roster)[number] => Boolean(character));

  const ja = currentJa ?? currentName;

  return (
    <section className="border-t border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-8 sm:px-5 lg:px-6">
        <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">次に見る</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          <Link
            href="/matchups"
            className="group rounded-lg border border-accent/35 bg-accent/[0.08] px-4 py-3.5 transition hover:border-accent/55 hover:shadow-[0_8px_28px_rgba(0,179,104,0.2)]"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">MATCHUP</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent-mint sm:text-lg">
              {ja}の相性表へ
            </p>
            <p className="mt-1 text-[11px] text-white/45">相性表でこのキャラの行を確認</p>
          </Link>
          <Link
            href="/tier"
            className="group rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-accent/40"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">RANK</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent sm:text-lg">
              キャラランクを見る
            </p>
            <p className="mt-1 text-[11px] text-white/45">ティア順で強さを確認</p>
          </Link>
          <Link
            href="/characters"
            className="group rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-accent/40"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">ROSTER</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent sm:text-lg">
              他キャラを見る
            </p>
            <p className="mt-1 text-[11px] text-white/45">全キャラのフレームデータ</p>
          </Link>
        </div>

        <p className="mt-8 text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
          More SF6 Frame Data
        </p>
        <h2 className="mt-2 font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
          Related Characters
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related.map((character) => (
            <li key={character.slug}>
              <Link
                href={`/characters/${character.slug}`}
                className="inline-flex rounded border border-white/10 bg-surface px-3 py-2 text-[11px] font-bold tracking-wide text-white/75 hover:border-accent/50 hover:text-accent"
              >
                {titleCase(character.en)} SF6 Frame Data
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
