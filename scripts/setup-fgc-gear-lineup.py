#!/usr/bin/env python3
"""US SF6 player gear lineup for phase-1 dense Amazon rails (learning / pre-AdSense)."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TAG = "sf6maxdatabas-20"
GEAR_TS = ROOT / "src" / "data" / "affiliate-gear.ts"
RAILS = ROOT / "src" / "components" / "DesktopSideRails.tsx"
FOOTER = ROOT / "src" / "components" / "AffiliateGearStrip.tsx"
PUSH = ROOT / "scripts" / "push_to_github.py"

# US FGC / SF6 community picks (sticks, leverless, pad, game, budget)
GEAR = [
    {
        "shortLabel": "HORI Alpha Stick",
        "badge": "SF6 Edition",
        "tagline": "Official licensed SF6 fightstick for PS5 and PC.",
        "asin": "B0BZQKCFSD",
    },
    {
        "shortLabel": "Qanba Titan",
        "badge": "Tournament",
        "tagline": "Sanwa parts. Compact PS5, PS4, and PC stick.",
        "asin": "B0BYQCPDTP",
    },
    {
        "shortLabel": "HORI OCTA Pad",
        "badge": "Fightpad",
        "tagline": "Six-button pad for PS5, PS4, and PC.",
        "asin": "B09RQTTWPQ",
    },
    {
        "shortLabel": "Razer Kitsune",
        "badge": "Leverless",
        "tagline": "All-button optical controller for PS5 and PC.",
        "asin": "B0CCX2DMXV",
    },
    {
        "shortLabel": "Street Fighter 6",
        "badge": "PS5 Game",
        "tagline": "The frame data on this site, in your hands.",
        "asin": "B0BPJRGNSD",
    },
    {
        "shortLabel": "8BitDo Arcade Stick",
        "badge": "Budget",
        "tagline": "Wireless arcade stick for PC and Switch.",
        "asin": "B08GJC5WSS",
    },
    {
        "shortLabel": "Victrix Pro FS",
        "badge": "Pro Stick",
        "tagline": "Premium PS5 fightstick with swappable gate.",
        "asin": "B09V7X3CWG",
    },
    {
        "shortLabel": "Mad Catz EGO",
        "badge": "Mid-Range",
        "tagline": "Slim PS5 and PS4 arcade stick with Sanwa feel.",
        "asin": "B0CLDC5QZ6",
    },
]

RAILS_TS = '''import Link from "next/link";
import { AFFILIATE_GEAR, gearHref } from "@/data/affiliate-gear";

const RAIL_COUNT = 8; // phase 1: dense Amazon rails until AdSense is live

function pickGear(index: number, offset: number) {
  return AFFILIATE_GEAR[(index + offset) % AFFILIATE_GEAR.length];
}

function SideCard({
  badge,
  href,
  shortLabel,
  tagline,
}: {
  badge: string;
  href: string;
  shortLabel: string;
  tagline: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex shrink-0 flex-col gap-1.5 rounded-lg border border-accent/35 bg-gradient-to-b from-[#122018] to-[#0a0f0c] px-3 py-2.5 text-left shadow-md backdrop-blur-sm transition hover:border-accent hover:shadow-[0_0_18px_rgba(0,179,104,0.18)]"
    >
      <span className="inline-block w-fit rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-accent-mint uppercase">
        {badge}
      </span>
      <p className="text-[13px] font-black leading-tight text-white">{shortLabel}</p>
      <p className="text-[10px] leading-snug text-white/65">{tagline}</p>
      <span className="rounded-md bg-accent py-1.5 text-center text-[10px] font-bold tracking-wide text-black transition group-hover:bg-accent-mint">
        Shop on Amazon →
      </span>
    </a>
  );
}

function RailStack({
  offset,
  side,
  title,
}: {
  offset: number;
  side: "left" | "right";
  title: string;
}) {
  return (
    <div className="pointer-events-auto flex h-[calc(100vh-5rem)] flex-col gap-1.5 px-2.5 py-2">
      <p className="shrink-0 rounded-lg border border-accent/35 bg-accent/10 px-3 py-2 text-center text-[9px] font-bold tracking-[0.22em] text-accent-mint uppercase">
        {title}
      </p>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {Array.from({ length: RAIL_COUNT }, (_, index) => {
          const item = pickGear(index, offset);
          return (
            <SideCard
              key={`${side}-${index}`}
              badge={item.badge}
              href={gearHref(item.asin)}
              shortLabel={item.shortLabel}
              tagline={item.tagline}
            />
          );
        })}
      </div>

      <Link
        href="/about#affiliate"
        className="shrink-0 rounded-md border border-white/10 bg-surface/70 px-3 py-1.5 text-center text-[9px] text-white/50 hover:text-accent"
      >
        Affiliate disclosure
      </Link>
    </div>
  );
}

export function DesktopSideRails() {
  return (
    <>
      <aside
        aria-label="Desktop left rail"
        className="pointer-events-none fixed inset-y-14 left-0 z-20 hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack offset={0} side="left" title="SF6 Gear Picks" />
      </aside>

      <aside
        aria-label="Desktop right rail"
        className="pointer-events-none fixed inset-y-14 right-0 z-20 hidden w-[min(15.5rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <RailStack offset={1} side="right" title="FGC Deals" />
      </aside>
    </>
  );
}
'''

FOOTER_TS = '''import Link from "next/link";
import { AFFILIATE_GEAR, gearHref } from "@/data/affiliate-gear";

export function AffiliateGearStrip() {
  return (
    <section
      aria-label="Recommended gear"
      className="mx-auto mt-8 max-w-2xl rounded-lg border border-border/60 bg-surface/40 px-4 py-5"
    >
      <p className="text-[10px] font-bold tracking-[0.32em] text-accent uppercase">
        Recommended Gear
      </p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-2">
        {AFFILIATE_GEAR.map((item) => (
          <li key={item.asin}>
            <a
              href={gearHref(item.asin)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-semibold text-accent hover:text-accent-hover sm:text-sm"
            >
              {item.shortLabel} on Amazon →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
        Affiliate links — we may earn a commission at no extra cost to you.{" "}
        <Link href="/about#affiliate" className="text-accent hover:text-accent-hover">
          Disclosure
        </Link>
      </p>
    </section>
  );
}
'''


def gear_ts_content() -> str:
    lines = [
        f'export const AFFILIATE_TAG = "{TAG}" as const;',
        "",
        "export type AffiliateGearItem = {",
        "  shortLabel: string;",
        "  badge: string;",
        "  tagline: string;",
        "  asin: string;",
        "};",
        "",
        "export const AFFILIATE_GEAR = [",
    ]
    for item in GEAR:
        lines.append("  {")
        lines.append(f'    shortLabel: "{item["shortLabel"]}",')
        lines.append(f'    badge: "{item["badge"]}",')
        lines.append(f'    tagline: "{item["tagline"]}",')
        lines.append(f'    asin: "{item["asin"]}",')
        lines.append("  },")
    lines.extend(
        [
            "] as const satisfies readonly AffiliateGearItem[];",
            "",
            "export function gearHref(asin: string): string {",
            f'  return `https://www.amazon.com/dp/${{asin}}?tag=${{AFFILIATE_TAG}}`;',
            "}",
            "",
        ]
    )
    return "\n".join(lines)


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
    GEAR_TS.parent.mkdir(parents=True, exist_ok=True)
    GEAR_TS.write_text(gear_ts_content(), encoding="utf-8")
    RAILS.write_text(RAILS_TS, encoding="utf-8")
    FOOTER.write_text(FOOTER_TS, encoding="utf-8")

    meta = ROOT / "scripts" / "affiliate_gear_lineup.json"
    meta.write_text(json.dumps({"count": len(GEAR), "items": GEAR}, indent=2) + "\n", encoding="utf-8")

    print(f"[done] {len(GEAR)} US FGC gear items -> affiliate-gear.ts")
    for item in GEAR:
        print(f"  - {item['shortLabel']} ({item['asin']})")

    git("add", "src/data/affiliate-gear.ts", "src/components/DesktopSideRails.tsx", "src/components/AffiliateGearStrip.tsx", "scripts/setup-fgc-gear-lineup.py", "scripts/affiliate_gear_lineup.json")
    commit = git("commit", "-m", "Expand US SF6 affiliate gear lineup for dense pre-AdSense rails")
    if commit.returncode == 0:
        print("[done] committed")
        if PUSH.is_file():
            subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    else:
        print("[info] nothing new to commit or commit skipped")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
