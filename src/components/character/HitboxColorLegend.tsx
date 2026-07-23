import Link from "next/link";
import { HITBOX_LEGEND } from "@/data/hitbox-legend";

type HitboxColorLegendProps = {
  variant?: "compact" | "full";
  className?: string;
};

export function HitboxColorLegend({
  variant = "compact",
  className = "",
}: HitboxColorLegendProps) {
  if (variant === "full") {
    return (
      <dl
        className={`grid gap-2 sm:grid-cols-2 ${className}`}
        aria-label="Hitbox color legend"
      >
        {HITBOX_LEGEND.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-lg border border-border/80 bg-surface px-4 py-3"
          >
            <span
              className={`mt-0.5 h-4 w-4 shrink-0 rounded-sm ring-1 ring-black/20 ${item.swatchClass}`}
              aria-hidden
            />
            <div>
              <dt className="text-xs font-bold text-accent">{item.label}</dt>
              <dd className="text-sm leading-relaxed text-muted">
                {item.description}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <div
      className={`rounded-lg border border-border/70 bg-surface/80 text-[10px] text-muted sm:text-[11px] ${className}`}
      aria-label="Hitbox color legend"
    >
      <div className="flex items-center justify-between gap-3 px-3 pt-2">
        <span className="shrink-0 font-bold tracking-wide text-foreground uppercase">
          Colors
        </span>
        <Link
          href="/about#hitbox-colors"
          className="shrink-0 font-semibold text-accent hover:text-accent-hover"
        >
          Full guide →
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 overflow-x-auto px-3 pb-2 pt-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HITBOX_LEGEND.map((item) => (
          <span
            key={item.label}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-black/15 ${item.swatchClass}`}
              aria-hidden
            />
            <span className="font-semibold text-foreground">{item.label}</span>
            <span className="hidden text-muted sm:inline">— {item.description}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
