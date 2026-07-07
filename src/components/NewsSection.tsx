import { newsItems } from "@/data/news";

export function NewsSection() {
  return (
    <section id="news" className="space-y-4">
      <div className="space-y-1 border-l-4 border-accent pl-4">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
          News
        </h2>
        <p className="text-sm text-muted">Updates — lightweight JPG × frame data</p>
      </div>

      <ul className="divide-y divide-border rounded-lg border border-border bg-surface px-4">
        {newsItems.map((item) => (
          <li
            key={`${item.date}-${item.title}`}
            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-8"
          >
            <time
              dateTime={item.date.replace(/\./g, "-")}
              className="shrink-0 font-mono text-xs font-semibold tracking-wider text-accent sm:w-24"
            >
              {item.date}
            </time>
            <p className="text-sm text-foreground">{item.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
