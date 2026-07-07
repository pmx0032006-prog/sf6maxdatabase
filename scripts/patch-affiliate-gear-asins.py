#!/usr/bin/env python3
"""Fix broken FGC Deals Amazon ASINs (right rail) + honest product copy."""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GEAR_TS = ROOT / "src" / "data" / "affiliate-gear.ts"
LINEUP_JSON = ROOT / "scripts" / "affiliate_gear_lineup.json"
PUSH = ROOT / "scripts" / "push_to_github.py"

FIXES = {
    "B09V7X3CWG": {
        "asin": "B0B3VRDML3",
        "tagline": "Premium PS5 fightstick with swappable gate.",
    },
    "B0CLDC5QZ6": {
        "asin": "B08HFNSCMV",
        "tagline": "Sanwa parts. PS4, Switch, Xbox One, and PC.",
    },
    "B0DVB2JB1K": {
        "badge": "Fightpad Pro",
        "tagline": "Wireless tournament fightpad for PS5 and PC.",
    },
    "B07DLFPG6G": {
        "asin": "B07QJ1JJ7J",
        "tagline": "Sanwa parts. Mod-friendly for PS4, Switch, Xbox, and PC.",
    },
}

GEAR_TS_CONTENT = '''export const AFFILIATE_TAG = "sf6maxdatabas-20" as const;

export type AffiliateGearItem = {
  shortLabel: string;
  badge: string;
  tagline: string;
  asin: string;
};

export const AFFILIATE_GEAR = [
  {
    shortLabel: "HORI Alpha Stick",
    badge: "SF6 Edition",
    tagline: "Official licensed SF6 fightstick for PS5 and PC.",
    asin: "B0BZQKCFSD",
  },
  {
    shortLabel: "Qanba Titan",
    badge: "Tournament",
    tagline: "Sanwa parts. Compact PS5, PS4, and PC stick.",
    asin: "B0BYQCPDTP",
  },
  {
    shortLabel: "HORI OCTA Pad",
    badge: "Fightpad",
    tagline: "Six-button pad for PS5, PS4, and PC.",
    asin: "B09RQTTWPQ",
  },
  {
    shortLabel: "Razer Kitsune",
    badge: "Leverless",
    tagline: "All-button optical controller for PS5 and PC.",
    asin: "B0CCX2DMXV",
  },
  {
    shortLabel: "Street Fighter 6",
    badge: "PS5 Game",
    tagline: "The frame data on this site, in your hands.",
    asin: "B0BPJRGNSD",
  },
  {
    shortLabel: "8BitDo Arcade Stick",
    badge: "Budget",
    tagline: "Wireless arcade stick for PC and Switch.",
    asin: "B08GJC5WSS",
  },
  {
    shortLabel: "Victrix Pro FS",
    badge: "Pro Stick",
    tagline: "Premium PS5 fightstick with swappable gate.",
    asin: "B0B3VRDML3",
  },
  {
    shortLabel: "Mad Catz EGO",
    badge: "Mid-Range",
    tagline: "Sanwa parts. PS4, Switch, Xbox One, and PC.",
    asin: "B08HFNSCMV",
  },
  {
    shortLabel: "HORI OCTA Pro",
    badge: "Fightpad Pro",
    tagline: "Wireless tournament fightpad for PS5 and PC.",
    asin: "B0DVB2JB1K",
  },
  {
    shortLabel: "Mayflash F500 Elite",
    badge: "Mod Friendly",
    tagline: "Sanwa parts. Mod-friendly for PS4, Switch, Xbox, and PC.",
    asin: "B07QJ1JJ7J",
  },
] as const satisfies readonly AffiliateGearItem[];

export const HOME_PRIME_ASINS = ["B0BZQKCFSD", "B0BPJRGNSD"] as const;

export function gearByAsin(asin: string): AffiliateGearItem | undefined {
  return AFFILIATE_GEAR.find((item) => item.asin === asin);
}

export function homePrimeGear(): AffiliateGearItem[] {
  return HOME_PRIME_ASINS.map((asin) => gearByAsin(asin)).filter(
    (item): item is AffiliateGearItem => Boolean(item),
  );
}

export function gearHref(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
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


LINEUP_ITEMS = [
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
        "asin": "B0B3VRDML3",
    },
    {
        "shortLabel": "Mad Catz EGO",
        "badge": "Mid-Range",
        "tagline": "Sanwa parts. PS4, Switch, Xbox One, and PC.",
        "asin": "B08HFNSCMV",
    },
    {
        "shortLabel": "HORI OCTA Pro",
        "badge": "Fightpad Pro",
        "tagline": "Wireless tournament fightpad for PS5 and PC.",
        "asin": "B0DVB2JB1K",
    },
    {
        "shortLabel": "Mayflash F500 Elite",
        "badge": "Mod Friendly",
        "tagline": "Sanwa parts. Mod-friendly for PS4, Switch, Xbox, and PC.",
        "asin": "B07QJ1JJ7J",
    },
]


def sync_lineup_json() -> None:
    LINEUP_JSON.write_text(
        json.dumps({"count": len(LINEUP_ITEMS), "items": LINEUP_ITEMS}, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    GEAR_TS.write_text(GEAR_TS_CONTENT, encoding="utf-8")
    sync_lineup_json()
    print("[done] affiliate gear ASINs fixed")
    for old, fix in FIXES.items():
        note = fix.get("asin", old)
        print(f"  {old} -> {note}")

    git(
        "add",
        "src/data/affiliate-gear.ts",
        "scripts/affiliate_gear_lineup.json",
        "scripts/patch-affiliate-gear-asins.py",
        "scripts/verify-amazon-asins.py",
    )
    commit = git("commit", "-m", "Fix broken FGC Deals Amazon ASINs and product copy")
    if commit.returncode == 0 and PUSH.is_file():
        subprocess.run([sys.executable, str(PUSH)], cwd=ROOT, check=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
