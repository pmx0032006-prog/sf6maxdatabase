import Link from "next/link";

type MetaNextStepsProps = {
  variant: "home" | "tier" | "matchups";
  characterSlug?: string;
  characterEn?: string;
};

const steps = {
  home: {
    primary: {
      href: "/matchups",
      kicker: "NEXT",
      title: "View matchup chart",
      desc: "870 cells — tap for notes",
    },
    secondary: {
      href: "/tier",
      kicker: "RANK",
      title: "View tier list",
      desc: "All 30 fighters ranked",
    },
    tertiary: {
      href: "/characters",
      kicker: "DATA",
      title: "Frame data roster",
      desc: "Moves & hitbox images",
    },
  },
  tier: {
    primary: {
      href: "/matchups",
      kicker: "NEXT",
      title: "Check matchups",
      desc: "Tier rank is not the full story",
    },
    secondary: {
      href: "/characters",
      kicker: "DATA",
      title: "Character details",
      desc: "Frame data & hitboxes",
    },
    tertiary: {
      href: "/",
      kicker: "HOME",
      title: "Back to roster",
      desc: "All characters",
    },
  },
  matchups: {
    primary: {
      href: "/characters",
      kicker: "NEXT",
      title: "Open frame data",
      desc: "After matchups, check moves",
    },
    secondary: {
      href: "/tier",
      kicker: "RANK",
      title: "View tier list",
      desc: "Community strength snapshot",
    },
    tertiary: {
      href: "/",
      kicker: "HOME",
      title: "Back to roster",
      desc: "All characters",
    },
  },
} as const;

function StepCard({
  href,
  kicker,
  title,
  desc,
  featured = false,
}: {
  href: string;
  kicker: string;
  title: string;
  desc: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-1 flex-col rounded-lg border px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 ${
        featured
          ? "border-accent/40 bg-accent/[0.08] hover:border-accent/60 hover:shadow-[0_8px_28px_rgba(0,179,104,0.22)]"
          : "border-border bg-surface hover:border-accent/35 hover:bg-accent/[0.05]"
      }`}
      translate="no"
    >
      <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">{kicker}</span>
      <span className="mt-1 font-display text-base font-black leading-tight text-foreground group-hover:text-accent sm:text-lg">
        {title}
      </span>
      <span className="mt-1.5 text-[11px] leading-snug text-muted">{desc}</span>
      <span className="mt-2 text-xs font-bold text-accent opacity-80 group-hover:opacity-100">→</span>
    </Link>
  );
}

export function MetaNextSteps({ variant, characterSlug, characterEn }: MetaNextStepsProps) {
  const block = steps[variant];
  const primary =
    characterSlug && characterEn
      ? {
          href: `/characters/${characterSlug}`,
          kicker: "CHAR",
          title: `${characterEn} frame data`,
          desc: "Moves & hitbox images for this fighter",
        }
      : block.primary;

  return (
    <section className="mt-8 rounded-xl border border-border bg-surface/60 p-4 sm:p-5" aria-label="Next steps">
      <p className="text-[10px] font-bold tracking-[0.28em] text-accent uppercase">Next up</p>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
        <StepCard {...primary} featured />
        <StepCard {...block.secondary} />
        <StepCard {...block.tertiary} />
      </div>
      <p className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <a href="#page-top" className="font-semibold text-muted hover:text-accent">
          Back to top ↑
        </a>
      </p>
    </section>
  );
}
