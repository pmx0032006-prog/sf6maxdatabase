type PlaceholderPanelProps = {
  title: string;
  body: string;
};

export function PlaceholderPanel({ title, body }: PlaceholderPanelProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-8 py-16 text-center">
      <p className="text-xs font-bold tracking-[0.28em] text-accent uppercase">
        Coming Soon
      </p>
      <h3 className="mt-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
        {body}
      </p>
    </div>
  );
}
