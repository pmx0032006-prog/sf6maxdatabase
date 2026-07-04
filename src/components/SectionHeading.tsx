type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3 border-l-4 border-accent pl-5">
      <p className="text-[11px] font-semibold tracking-[0.28em] text-accent uppercase">
        {label}
      </p>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
