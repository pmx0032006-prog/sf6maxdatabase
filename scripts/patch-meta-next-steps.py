#!/usr/bin/env python3
"""Add MetaNextSteps cross-links on home, tier, matchups, and character pages."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = ROOT / "src" / "components" / "MetaNextSteps.tsx"
HOME = ROOT / "src" / "app" / "page.tsx"
TIER = ROOT / "src" / "app" / "tier" / "page.tsx"
MATCHUPS = ROOT / "src" / "app" / "matchups" / "page.tsx"
CHAR_LINKS = ROOT / "src" / "components" / "character" / "CharacterRelatedLinks.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''import Link from "next/link";

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
'''

CHAR_LINKS_TSX = '''import Link from "next/link";
import { roster } from "@/data/characters";

type CharacterRelatedLinksProps = {
  currentSlug: string;
  currentName: string;
  currentJa?: string;
};

function titleCase(name: string): string {
  return name
    .split(/[\\s.]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function pickRelatedSlugs(currentSlug: string, count = 4): string[] {
  const index = roster.findIndex((character) => character.slug === currentSlug);
  if (index < 0) {
    return roster.slice(0, count).map((character) => character.slug);
  }

  const picks: string[] = [];
  for (let offset = 1; picks.length < count && offset < roster.length; offset += 1) {
    const slug = roster[(index + offset) % roster.length].slug;
    if (slug !== currentSlug) {
      picks.push(slug);
    }
  }
  return picks;
}

export function CharacterRelatedLinks({
  currentSlug,
  currentName,
  currentJa,
}: CharacterRelatedLinksProps) {
  const related = pickRelatedSlugs(currentSlug)
    .map((slug) => roster.find((character) => character.slug === slug))
    .filter((character): character is (typeof roster)[number] => Boolean(character));

  const ja = currentJa ?? currentName;

  return (
    <section className="border-t border-white/10 bg-[#0a0f0c]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-8 sm:px-5 lg:px-6">
        <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">次に見る</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          <Link
            href="/matchups"
            className="group rounded-lg border border-accent/35 bg-accent/[0.08] px-4 py-3.5 transition hover:border-accent/55 hover:shadow-[0_8px_28px_rgba(0,179,104,0.2)]"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">MATCHUP</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent-mint sm:text-lg">
              {ja}の相性表へ
            </p>
            <p className="mt-1 text-[11px] text-white/45">相性表でこのキャラの行を確認</p>
          </Link>
          <Link
            href="/tier"
            className="group rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-accent/40"
            translate="no"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">RANK</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent sm:text-lg">
              キャラランクを見る
            </p>
            <p className="mt-1 text-[11px] text-white/45">ティア順で強さを確認</p>
          </Link>
          <Link
            href="/characters"
            className="group rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3.5 transition hover:border-accent/40"
          >
            <span className="text-[8px] font-bold tracking-[0.3em] text-accent/85">ROSTER</span>
            <p className="mt-1 font-display text-base font-black text-white group-hover:text-accent sm:text-lg">
              他キャラを見る
            </p>
            <p className="mt-1 text-[11px] text-white/45">全キャラのフレームデータ</p>
          </Link>
        </div>

        <p className="mt-8 text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
          More SF6 Frame Data
        </p>
        <h2 className="mt-2 font-display text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
          Related Characters
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related.map((character) => (
            <li key={character.slug}>
              <Link
                href={`/characters/${character.slug}`}
                className="inline-flex rounded border border-white/10 bg-surface px-3 py-2 text-[11px] font-bold tracking-wide text-white/75 hover:border-accent/50 hover:text-accent"
              >
                {titleCase(character.en)} SF6 Frame Data
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
'''


def patch_file(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        print(f"[error] {label}: pattern not found", file=sys.stderr)
        raise SystemExit(1)
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


def git_env() -> dict[str, str]:
    env = os.environ.copy()
    env.setdefault("GIT_AUTHOR_NAME", "pmx0032006-prog")
    env.setdefault("GIT_AUTHOR_EMAIL", "pmx0032006@gmail.com")
    env.setdefault("GIT_COMMITTER_NAME", "pmx0032006-prog")
    env.setdefault("GIT_COMMITTER_EMAIL", "pmx0032006@gmail.com")
    return env


def git(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        env=git_env(),
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="replace",
    )


def main() -> int:
    COMP.write_text(COMP_TSX, encoding="utf-8")
    CHAR_LINKS.write_text(CHAR_LINKS_TSX, encoding="utf-8")

    patch_file(
        TIER,
        'import { SiteFooter } from "@/components/SiteFooter";',
        'import { MetaNextSteps } from "@/components/MetaNextSteps";\nimport { SiteFooter } from "@/components/SiteFooter";',
        "tier import",
    )
    patch_file(
        TIER,
        '''          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/matchups" className="font-semibold text-accent hover:text-accent-hover">
              キャラクター相性 →
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← ロスターへ戻る
            </Link>
            <a href="#page-top" className="font-semibold text-muted hover:text-accent">
              上へ戻る ↑
            </a>
          </p>''',
        "          <MetaNextSteps variant=\"tier\" />",
        "tier footer",
    )

    patch_file(
        MATCHUPS,
        'import { MatchupTable } from "@/components/MatchupTable";',
        'import { MetaNextSteps } from "@/components/MetaNextSteps";\nimport { MatchupTable } from "@/components/MatchupTable";',
        "matchups import",
    )
    patch_file(
        MATCHUPS,
        '''          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/tier" className="font-semibold text-accent hover:text-accent-hover">
              ← キャラクターランク
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ロスターへ戻る
            </Link>
            <a href="#page-top" className="font-semibold text-muted hover:text-accent">
              上へ戻る ↑
            </a>
          </p>''',
        "          <MetaNextSteps variant=\"matchups\" />",
        "matchups footer",
    )

    patch_file(
        HOME,
        '''            <h1 className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl">
              MAX <span className="text-accent">DATABASE</span>
            </h1>''',
        '''            <h1
              id="page-top"
              className="mt-0.5 font-display text-xl font-black uppercase leading-none tracking-tight text-white sm:text-2xl"
            >
              MAX <span className="text-accent">DATABASE</span>
            </h1>''',
        "home page-top",
    )

    patch_file(
        HOME,
        'import { HomeMetaSummary } from "@/components/HomeMetaSummary";',
        'import { HomeMetaSummary } from "@/components/HomeMetaSummary";\nimport { MetaNextSteps } from "@/components/MetaNextSteps";',
        "home import",
    )
    patch_file(
        HOME,
        '''            <section id="roster">
              <CharacterGrid mode="classic" characters={roster} hideHeader />
            </section>

            <FeaturesSection />''',
        '''            <section id="roster">
              <CharacterGrid mode="classic" characters={roster} hideHeader />
            </section>

            <MetaNextSteps variant="home" />

            <FeaturesSection />''',
        "home next steps",
    )

    char_page = ROOT / "src" / "app" / "characters" / "[slug]" / "page.tsx"
    char_text = char_page.read_text(encoding="utf-8")
    if "currentJa=" not in char_text:
        char_text = char_text.replace(
            "<CharacterRelatedLinks currentSlug={slug} currentName={character.en} />",
            "<CharacterRelatedLinks currentSlug={slug} currentName={character.en} currentJa={character.ja} />",
            1,
        )
        char_page.write_text(char_text, encoding="utf-8")

    print("[done] MetaNextSteps on home/tier/matchups + character links")

    git(
        "add",
        "src/components/MetaNextSteps.tsx",
        "src/components/character/CharacterRelatedLinks.tsx",
        "src/app/page.tsx",
        "src/app/tier/page.tsx",
        "src/app/matchups/page.tsx",
        "src/app/characters/[slug]/page.tsx",
        "scripts/patch-meta-next-steps.py",
    )
    commit = git("commit", "-m", "Add next-step cross-links for meta and character pages")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
