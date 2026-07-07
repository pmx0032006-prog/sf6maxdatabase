#!/usr/bin/env python3
"""Fix tier page: show JA names (ジュリ not JURI→法 mistranslation)."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIER_PAGE = ROOT / "src" / "app" / "tier" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

TIER_PAGE_TSX = '''import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { roster } from "@/data/characters";
import { META_DISCLAIMER, META_UPDATED, TIER_ORDER, TIERS } from "@/data/character-meta";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Character Rank | ${siteName}`,
  description: "Community SF6 character rank snapshot with links to frame data.",
  alternates: { canonical: `${siteUrl}/tier` },
};

export default function TierPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="tier" />

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">Meta</p>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl" translate="no">
            キャラクターランク
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            コミュニティの強さ目安。キャラ名を押すとフレームデータ・ヒットボックスへ。
          </p>
          <p className="mt-1 text-xs text-muted/80">
            更新: {META_UPDATED} — {META_DISCLAIMER}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TIER_ORDER.map((tier) => (
              <div key={tier} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
                <p className="text-lg font-black text-foreground" translate="no">
                  ティア {tier}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {TIERS[tier].map((slug) => {
                    const char = roster.find((c) => c.slug === slug);
                    if (!char) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/characters/${slug}`}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:border-accent hover:text-accent"
                          translate="no"
                          lang="ja"
                          title={char.en}
                        >
                          {char.ja}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/matchups" className="font-semibold text-accent hover:text-accent-hover">
              キャラクター相性 →
            </Link>
            <Link href="/" className="font-semibold text-muted hover:text-accent">
              ← ロスターへ戻る
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
'''


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
    TIER_PAGE.write_text(TIER_PAGE_TSX, encoding="utf-8")
    print("[done] tier page uses JA names (ジュリ) with translate=no")

    git("add", "src/app/tier/page.tsx", "scripts/fix-tier-page-ja-names.py", "scripts/meta-loop-tick.py")
    commit = git("commit", "-m", "Fix tier page Japanese names to stop JURI mistranslation")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
