import Link from "next/link";
import { characterPageContainerClass } from "@/lib/character-page-layout";

type CharacterPreparingProps = {
  en: string;
  ja: string;
};

export function CharacterPreparing({ en, ja }: CharacterPreparingProps) {
  return (
    <section className="bg-surface/50">
      <div className={characterPageContainerClass("py-16 sm:py-24")}>
        <div className="mx-auto max-w-lg rounded-xl border border-dashed border-accent/40 bg-surface px-8 py-14 text-center sm:px-12 sm:py-16">
          <p className="text-[10px] font-bold tracking-[0.35em] text-accent uppercase">
            Under Construction
          </p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
            Coming soon
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Frame data for {en} is coming soon.
            <br />
            Please check back later.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-accent hover:text-accent-hover"
          >
            <span aria-hidden>←</span>
            BACK TO HOME
          </Link>
        </div>
      </div>
    </section>
  );
}
