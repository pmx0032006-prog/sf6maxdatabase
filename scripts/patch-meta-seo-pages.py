#!/usr/bin/env python3
"""Improve SEO metadata for /tier and /matchups pages."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIER = ROOT / "src" / "app" / "tier" / "page.tsx"
MATCHUPS = ROOT / "src" / "app" / "matchups" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

OLD_TIER_META = '''export const metadata: Metadata = {
  title: `Character Rank | ${siteName}`,
  description: "Community SF6 character rank snapshot with links to frame data.",
  alternates: { canonical: `${siteUrl}/tier` },
};'''

NEW_TIER_META = '''export const metadata: Metadata = {
  title: `SF6 Character Tier List (30 Fighters) | ${siteName}`,
  description:
    "Street Fighter 6 community character tier list — S+ through C rank for all 30 fighters. Tap any name for frame data and hitbox images. Updated 2026-07.",
  alternates: { canonical: `${siteUrl}/tier` },
  openGraph: {
    title: `SF6 Character Tier List | ${siteName}`,
    description:
      "Community tier rankings for all 30 SF6 characters. S+ Mai at top. Links to frame data for every fighter.",
    url: `${siteUrl}/tier`,
  },
};'''

OLD_MATCHUPS_META = '''export const metadata: Metadata = {
  title: `Character Affinity | ${siteName}`,
  description: "Full-roster SF6 character affinity diagram — win-rate style ratios, not match results.",
  alternates: { canonical: `${siteUrl}/matchups` },
};'''

NEW_MATCHUPS_META = '''export const metadata: Metadata = {
  title: `SF6 Matchup Chart (30×29 Grid) | ${siteName}`,
  description:
    "Full Street Fighter 6 matchup chart for all 30 characters. Win-rate style ratios (7-3 to 3-7), tap-to-read notes, shareable links. Mobile-friendly.",
  alternates: { canonical: `${siteUrl}/matchups` },
  openGraph: {
    title: `SF6 Character Matchup Chart | ${siteName}`,
    description:
      "870 matchup cells with community notes. Diagram-style ratios for every SF6 character pairing. Tap a cell to read tips.",
    url: `${siteUrl}/matchups`,
  },
};'''


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
    tier = TIER.read_text(encoding="utf-8")
    matchups = MATCHUPS.read_text(encoding="utf-8")
    if OLD_TIER_META not in tier or OLD_MATCHUPS_META not in matchups:
        print("[error] metadata pattern not found", file=sys.stderr)
        return 1
    TIER.write_text(tier.replace(OLD_TIER_META, NEW_TIER_META, 1), encoding="utf-8")
    MATCHUPS.write_text(matchups.replace(OLD_MATCHUPS_META, NEW_MATCHUPS_META, 1), encoding="utf-8")
    print("[done] tier/matchups SEO metadata updated")

    git(
        "add",
        "src/app/tier/page.tsx",
        "src/app/matchups/page.tsx",
        "scripts/patch-meta-seo-pages.py",
    )
    commit = git("commit", "-m", "Improve SEO metadata for tier and matchups pages")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
