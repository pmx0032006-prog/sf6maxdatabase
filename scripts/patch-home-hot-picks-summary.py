#!/usr/bin/env python3
"""Hero summary: HOT PICKS / want to win? play these — English names for global audience."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMP = ROOT / "src" / "components" / "HomeMetaSummary.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

COMP_TSX = '''import Link from "next/link";
import { roster } from "@/data/characters";
import { MATCHUP_CORE, META_UPDATED, TIERS } from "@/data/character-meta";

function hotPickNames(limit?: number) {
  const slugs = [...TIERS["S+"], ...TIERS["S"]];
  const names = slugs
    .map((slug) => roster.find((c) => c.slug === slug)?.en ?? slug.toUpperCase())
    .filter(Boolean);
  return limit ? names.slice(0, limit).join(" · ") : names.join(" · ");
}

export function HomeMetaSummary() {
  const chars = roster.length;
  const cells = MATCHUP_CORE.length * (MATCHUP_CORE.length - 1);
  const hotCompact = hotPickNames(4);
  const hotFull = hotPickNames();

  const items = [
    {
      href: "/tier",
      kicker: "HOT NOW",
      value: hotCompact,
      valueWide: hotFull,
      note: "Want to win? Start here.",
      featured: true,
    },
    {
      href: "/characters/alex",
      kicker: "SLEEPER",
      value: "ALEX",
      note: "Underdogs win too",
    },
    {
      href: "/matchups",
      kicker: "MATCHUPS",
      value: String(cells),
      note: "full grid",
    },
    {
      href: "/tier",
      kicker: "META",
      value: META_UPDATED,
      note: "updated",
      muted: true,
    },
  ] as const;

  return (
    <div
      className="meta-summary-band flex flex-wrap items-stretch justify-center gap-1.5 sm:gap-2 lg:justify-center"
      aria-label="Meta picks overview"
    >
      {items.map((item) => {
        const muted = "muted" in item && item.muted;
        const featured = "featured" in item && item.featured;
        const valueWide = "valueWide" in item ? item.valueWide : undefined;
        return (
          <Link
            key={item.kicker}
            href={item.href}
            className={`meta-summary-chip group flex min-w-[4.75rem] flex-col rounded-md border px-2.5 py-2 transition duration-300 hover:-translate-y-0.5 sm:min-w-[5rem] sm:px-3 ${
              featured ? "min-w-[10.5rem] flex-[1.35] sm:min-w-[12rem]" : ""
            } ${
              muted
                ? "border-white/8 bg-white/[0.03] hover:border-white/20"
                : featured
                  ? "border-accent/40 bg-accent/[0.1] hover:border-accent/60 hover:bg-accent/[0.16] hover:shadow-[0_0_24px_rgba(0,179,104,0.28)]"
                  : "border-accent/25 bg-accent/[0.06] hover:border-accent/50 hover:bg-accent/[0.12] hover:shadow-[0_0_20px_rgba(0,179,104,0.2)]"
            }`}
            translate="no"
          >
            <span className="text-[7px] font-bold tracking-[0.26em] text-accent/80 sm:text-[8px]">
              {item.kicker}
            </span>
            <span
              className={`mt-0.5 font-display font-black leading-tight text-white group-hover:text-accent-mint ${
                featured
                  ? "text-[0.7rem] sm:text-xs"
                  : muted
                    ? "text-base text-white/55 sm:text-lg"
                    : "text-base sm:text-lg"
              }`}
            >
              {featured ? (
                <>
                  <span className="sm:hidden">{item.value}</span>
                  <span className="hidden sm:inline">{valueWide ?? item.value}</span>
                </>
              ) : (
                item.value
              )}
            </span>
            <span className="mt-1 text-[8px] leading-snug text-white/45 sm:text-[9px]">{item.note}</span>
          </Link>
        );
      })}
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
    COMP.write_text(COMP_TSX, encoding="utf-8")
    print("[done] home hot picks summary applied")

    git("add", "src/components/HomeMetaSummary.tsx", "scripts/patch-home-hot-picks-summary.py")
    commit = git("commit", "-m", "Hero summary: HOT NOW picks and sleeper Alex for global audience")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
