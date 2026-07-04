import { newsItems } from "@/data/news";

export function NewsSection() {
  return (
    <section id="news" className="border-b border-border/80 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-10 sm:py-12">
        <div className="flex flex-col gap-6 border-l-4 border-accent pl-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.38em] text-accent uppercase">
              News
            </p>
            <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl">
              Updates
            </h2>
          </div>
          <p className="text-xs tracking-wide text-muted sm:max-w-xs sm:text-right">
            軽量JPG × フレーム数値の更新履歴
          </p>
        </div>

        <ul className="mt-8 divide-y divide-border">
          {newsItems.map((item) => (
            <li
              key={`${item.date}-${item.title}`}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-10"
            >
              <time
                dateTime={item.date.replace(/\./g, "-")}
                className="shrink-0 font-mono text-xs font-semibold tracking-wider text-accent sm:w-28 sm:text-sm"
              >
                {item.date}
              </time>
              <p className="text-sm text-foreground sm:text-base">{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
