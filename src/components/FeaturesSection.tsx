const features = [
  {
    label: "01",
    title: "Frame Data",
    body: "Startup, frame advantage, damage, and more — grouped by move section for quick lookup.",
  },
  {
    label: "02",
    title: "Lightweight JPG Hitboxes",
    body: "Low-quality JPGs extracted from ~30k assets. Lighter than GIFs — opens fast on low-spec phones.",
  },
  {
    label: "03",
    title: "Multi-Frame View",
    body: "Switch _1 _2 _3 … frames in-card or fullscreen. Quick checks between matches.",
  },
];

export function FeaturesSection() {
  return (
    <section id="contents" className="border-t border-border/80">
      <div className="border-b border-accent/30 bg-[#0a0f0c] px-4 py-8 sm:px-10 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase">
            Contents
          </p>
          <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl">
            Features
          </h2>
        </div>
      </div>
      <div className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px border-x border-border/80 bg-border/80 px-4 sm:grid-cols-3 sm:px-10">
          {features.map((item) => (
            <article
              key={item.label}
              className="feature-card space-y-5 bg-surface px-6 py-10 sm:px-8 sm:py-12"
            >
              <p className="font-display text-4xl font-black leading-none text-accent sm:text-5xl">
                {item.label}
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
