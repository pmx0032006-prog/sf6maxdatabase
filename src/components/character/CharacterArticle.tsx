import { splitArticleParagraphs } from "@/lib/character-text";

type CharacterArticleProps = {
  badge: string;
  title: string;
  content: string;
};

export function CharacterArticle({ badge, title, content }: CharacterArticleProps) {
  const paragraphs = splitArticleParagraphs(content);

  return (
    <article className="rounded-lg border border-border/80 bg-surface">
      <header className="border-b border-border/60 px-4 py-4 sm:px-6 sm:py-5">
        <p className="text-[10px] font-bold tracking-[0.24em] text-accent uppercase">
          {badge}
        </p>
        <h3 className="mt-1 text-lg font-bold text-foreground sm:text-xl">{title}</h3>
      </header>
      <div className="max-h-[70vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="space-y-4 text-sm leading-[1.85] text-foreground/90">
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
