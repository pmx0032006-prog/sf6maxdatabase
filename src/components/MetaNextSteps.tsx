import Link from "next/link";

type MetaNextStepsProps = {
  variant: "home" | "tier" | "matchups";
  characterSlug?: string;
  characterJa?: string;
};

const steps = {
  home: {
    primary: {
      href: "/matchups",
      kicker: "NEXT",
      title: "キャラ相性を見る",
      desc: "870マス・タップでメモ",
    },
    secondary: {
      href: "/tier",
      kicker: "RANK",
      title: "キャラランクを見る",
      desc: "30キャラ・ティア順",
    },
    tertiary: {
      href: "/characters",
      kicker: "DATA",
      title: "フレームデータへ",
      desc: "技表・ヒットボックス",
    },
  },
  tier: {
    primary: {
      href: "/matchups",
      kicker: "NEXT",
      title: "相性表で確認する",
      desc: "ランクだけじゃ決まらない",
    },
    secondary: {
      href: "/characters",
      kicker: "DATA",
      title: "キャラ詳細へ",
      desc: "フレーム・ヒットボックス",
    },
    tertiary: {
      href: "/",
      kicker: "HOME",
      title: "ロスターへ戻る",
      desc: "全キャラ一覧",
    },
  },
  matchups: {
    primary: {
      href: "/characters",
      kicker: "NEXT",
      title: "フレームデータを見る",
      desc: "相性の次は技データ",
    },
    secondary: {
      href: "/tier",
      kicker: "RANK",
      title: "キャラランクへ",
      desc: "強さの目安を確認",
    },
    tertiary: {
      href: "/",
      kicker: "HOME",
      title: "ロスターへ戻る",
      desc: "全キャラ一覧",
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

export function MetaNextSteps({ variant, characterSlug, characterJa }: MetaNextStepsProps) {
  const block = steps[variant];
  const primary =
    characterSlug && characterJa
      ? {
          href: `/characters/${characterSlug}`,
          kicker: "CHAR",
          title: `${characterJa}のフレームデータ`,
          desc: "このキャラの技・ヒットボックス",
        }
      : block.primary;

  return (
    <section className="mt-8 rounded-xl border border-border bg-surface/60 p-4 sm:p-5" aria-label="次に見る">
      <p className="text-[10px] font-bold tracking-[0.28em] text-accent uppercase">次に見る</p>
      <div className="mt-3 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
        <StepCard {...primary} featured />
        <StepCard {...block.secondary} />
        <StepCard {...block.tertiary} />
      </div>
      <p className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <a href="#page-top" className="font-semibold text-muted hover:text-accent">
          上へ戻る ↑
        </a>
      </p>
    </section>
  );
}
