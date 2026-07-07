#!/usr/bin/env python3
"""Home prime spot: 2 Amazon affiliate cards between hero and roster (AdSense later)."""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEAR_TS = ROOT / "src" / "data" / "affiliate-gear.ts"
SPOT = ROOT / "src" / "components" / "HomeGearSpot.tsx"
PAGE = ROOT / "src" / "app" / "page.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

# Doc picks: SF6 game + HORI Alpha — highest US FGC conversion pair
HOME_PRIME_ASINS = ("B0BZQKCFSD", "B0BPJRGNSD")

SPOT_TSX = '''import Link from "next/link";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";

export function HomeGearSpot() {
  const items = homePrimeGear();

  return (
    <section
      aria-label="Featured SF6 gear"
      className="border-b border-border/50 bg-background"
    >
      {/* ADSENSE-HOME-PRIME: replace or stack AdSense auto ads here after approval */}
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-10 sm:py-4">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Gear picks
        </p>
        <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.asin}>
              <a
                href={gearHref(item.asin)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex flex-col gap-1 rounded-lg border border-accent/25 bg-surface/60 px-3 py-2.5 transition hover:border-accent/50 hover:bg-[#eef8f2]/80 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <div className="min-w-0">
                  <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent uppercase">
                    {item.badge}
                  </span>
                  <p className="mt-1 text-sm font-bold text-foreground">{item.shortLabel}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{item.tagline}</p>
                </div>
                <span className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-center text-[10px] font-bold text-black transition group-hover:bg-accent-mint sm:min-w-[7.5rem]">
                  Amazon →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[10px] text-muted/80">
          Affiliate links — we may earn a commission.{" "}
          <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
            Disclosure
          </Link>
        </p>
      </div>
    </section>
  );
}
'''

PAGE_IMPORT = 'import { HomeGearSpot } from "@/components/HomeGearSpot";\n'
PAGE_ANCHOR = "        <HomeHero />\n\n"
PAGE_INSERT = "        <HomeHero />\n\n        <HomeGearSpot />\n\n"


def patch_gear_ts(text: str) -> str:
    if "homePrimeGear" in text:
        return text

    asin_list = ", ".join(f'"{a}"' for a in HOME_PRIME_ASINS)
    block = f"""
export const HOME_PRIME_ASINS = [{asin_list}] as const;

export function gearByAsin(asin: string): AffiliateGearItem | undefined {{
  return AFFILIATE_GEAR.find((item) => item.asin === asin);
}}

export function homePrimeGear(): AffiliateGearItem[] {{
  return HOME_PRIME_ASINS.map((asin) => gearByAsin(asin)).filter(
    (item): item is AffiliateGearItem => Boolean(item),
  );
}}
"""
    if "export function gearHref" not in text:
        raise ValueError("gearHref anchor missing in affiliate-gear.ts")
    return text.replace(
        "\nexport function gearHref(asin: string): string {",
        block + "\nexport function gearHref(asin: string): string {",
        1,
    )


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
    gear = GEAR_TS.read_text(encoding="utf-8")
    GEAR_TS.write_text(patch_gear_ts(gear), encoding="utf-8")
    SPOT.write_text(SPOT_TSX, encoding="utf-8")

    page = PAGE.read_text(encoding="utf-8")
    if "HomeGearSpot" not in page:
        if 'import { HomeHero }' in page and PAGE_IMPORT.strip() not in page:
            page = page.replace(
                'import { HomeHero } from "@/components/HomeHero";\n',
                'import { HomeHero } from "@/components/HomeHero";\n' + PAGE_IMPORT,
                1,
            )
        if PAGE_INSERT not in page and PAGE_ANCHOR in page:
            page = page.replace(PAGE_ANCHOR, PAGE_INSERT, 1)
        PAGE.write_text(page, encoding="utf-8")

    print("[done] Home prime spot: HORI Alpha + SF6 PS5 (2 Amazon cards)")
    git(
        "add",
        "src/data/affiliate-gear.ts",
        "src/components/HomeGearSpot.tsx",
        "src/app/page.tsx",
        "scripts/setup-home-gear-spot.py",
    )
    commit = git("commit", "-m", "Add 2 Amazon affiliate cards to home prime spot above roster")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
