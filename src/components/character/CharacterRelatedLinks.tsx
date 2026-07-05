import Link from "next/link";
import { roster } from "@/data/characters";

type CharacterRelatedLinksProps = {
  currentSlug: string;
  currentName: string;
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
}: CharacterRelatedLinksProps) {
  const related = pickRelatedSlugs(currentSlug)
    .map((slug) => roster.find((character) => character.slug === slug))
    .filter((character): character is (typeof roster)[number] => Boolean(character));

  return (
    <section className="border-t border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-8 sm:px-5 lg:px-6">
        <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
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
        <p className="mt-4 text-xs text-white/45">
          Browse all {titleCase(currentName)} matchups from the{" "}
          <Link href="/characters" className="text-accent hover:text-accent-hover">
            SF6 character list
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
