const features = [
  {
    label: "01",
    title: "Frame Data",
    body: "Startup, frame advantage, damage, and more — grouped by move section for quick lookup.",
  },
  {
    label: "02",
    title: "Lightweight JPG Hitboxes",
    body: "Still JPG hitboxes on every move — lighter than GIFs, fast on mobile data and low-spec phones.",
  },
  {
    label: "03",
    title: "Multi-Frame View",
    body: "Switch _1 _2 _3 … frames in-card or fullscreen. Quick checks between matches.",
  },
];

export function FeaturesSection() {
  return (
    <section id="contents" className="space-y-4">
      <div className="space-y-1 border-l-4 border-accent pl-4">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-accent uppercase">
          Features
        </h2>
        <p className="text-sm text-muted">What makes this database fast and useful</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {features.map((item) => (
          <article
            key={item.label}
            className="feature-card space-y-3 rounded-lg border border-border bg-surface px-4 py-5"
          >
            <p className="font-display text-2xl font-black leading-none text-accent">
              {item.label}
            </p>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
