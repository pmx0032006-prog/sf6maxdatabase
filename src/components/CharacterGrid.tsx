import Link from "next/link";
import type { Character } from "@/data/characters";

type CharacterGridProps = {
  title: string;
  subtitle: string;
  mode: "classic" | "modern";
  characters: Character[];
};

const modeStyles = {
  classic: {
    section: "border-accent",
    grid: "gap-3 lg:gap-4",
    cell: "rounded-xl bg-surface/90 shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]",
    name: "font-display text-xl font-bold tracking-[0.12em] sm:text-2xl",
    ja: "text-xs text-muted",
  },
  modern: {
    section: "border-accent-mint/80",
    grid: "gap-2.5 lg:gap-3",
    cell: "rounded-lg bg-[#eef8f2]/90 shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]",
    name: "font-mono text-lg font-semibold tracking-[0.18em] sm:text-xl",
    ja: "text-[11px] tracking-wide text-muted/90",
  },
} as const;

export function CharacterGrid({
  title,
  subtitle,
  mode,
  characters,
}: CharacterGridProps) {
  const styles = modeStyles[mode];

  return (
    <section className="space-y-5">
      <div
        className={`space-y-1 border-l-4 pl-4 ${styles.section} ${
          mode === "modern" ? "border-l-[3px]" : ""
        }`}
      >
        <h2
          className={`text-sm font-semibold tracking-[0.2em] uppercase ${
            mode === "modern" ? "text-accent-mint" : "text-accent"
          }`}
        >
          {title}
        </h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <ul
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${styles.grid}`}
      >
        {characters.map((character) => (
          <li key={`${mode}-${character.slug}`}>
            <Link
              href={`/characters/${character.slug}?mode=${mode}`}
              className={`char-cell group relative block overflow-hidden ${
                character.thumb
                  ? `aspect-[4/3] w-full ${
                      mode === "classic"
                        ? "rounded-xl shadow-[inset_0_0_0_1px_rgba(221,230,224,0.9)]"
                        : "rounded-lg shadow-[inset_0_0_0_1px_rgba(0,179,104,0.14)]"
                    }`
                  : styles.cell
              }`}
            >
              {character.thumb ? (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[inherit] bg-[#0d1210] bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${character.thumb})`,
                      backgroundPosition: "center top",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-transparent via-transparent to-[#0d1210]/88"
                  />
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-[inherit] ${
                      mode === "classic"
                        ? "bg-gradient-to-t from-[#0d1210]/95 via-[#0d1210]/25 to-transparent"
                        : "bg-gradient-to-t from-[#0a1410]/92 via-[#0d1812]/20 to-transparent"
                    }`}
                  />
                </>
              ) : null}
              {character.thumb ? (
                <span className="absolute inset-0 z-[1] flex flex-col items-center justify-end px-3 pb-3 pt-10">
                  <span
                    className={`char-name text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] ${styles.name}`}
                  >
                    {character.en}
                  </span>
</span>
              ) : (
                <span className="relative z-[1] flex min-h-[5.5rem] flex-col items-center justify-center px-3 py-7 sm:min-h-[6.25rem]">
                  <span className={`char-name text-foreground ${styles.name}`}>
                    {character.en}
                  </span>
</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
