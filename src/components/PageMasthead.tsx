import Link from "next/link";

type PageMastheadProps = {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  showBackLink?: boolean;
  compact?: boolean;
};

export function PageMasthead({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  showBackLink = false,
  compact = false,
}: PageMastheadProps) {
  return (
    <section className="bg-[#0a0f0c] text-white">
      {showBackLink ? (
        <div className="mx-auto max-w-6xl border-b border-white/10 px-4 py-2 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.28em] text-white/50 hover:text-accent"
          >
            <span aria-hidden>←</span>
            BACK TO HOME
          </Link>
        </div>
      ) : null}

      <div
        className={
          compact
            ? "mx-auto max-w-6xl px-4 py-3 sm:px-10 sm:py-4"
            : "mx-auto max-w-6xl px-4 py-14 sm:px-10 sm:py-16 lg:py-20"
        }
      >
        <p
          className={
            compact
              ? "text-[9px] font-bold tracking-[0.32em] text-accent uppercase sm:text-[10px]"
              : "text-[11px] font-bold tracking-[0.42em] text-accent uppercase"
          }
        >
          {eyebrow}
        </p>
        <h1
          className={
            compact
              ? "mt-1 font-display text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl"
              : "mt-5 font-display text-[2.75rem] font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]"
          }
        >
          {title}
          {titleAccent ? (
            <span
              className={
                compact
                  ? "text-accent sm:pl-2"
                  : "block text-accent sm:inline sm:pl-3"
              }
            >
              {titleAccent}
            </span>
          ) : null}
        </h1>
        {subtitle ? (
          <p
            className={
              compact
                ? "mt-1 max-w-xl text-[11px] leading-snug tracking-wide text-white/55 sm:text-xs"
                : "mt-5 max-w-xl text-sm leading-relaxed tracking-wide text-white/65 sm:text-base"
            }
          >
            {subtitle}
          </p>
        ) : null}
        {!compact ? (
          <div
            className="mt-10 h-px w-full max-w-md bg-gradient-to-r from-accent via-accent/60 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
    </section>
  );
}
