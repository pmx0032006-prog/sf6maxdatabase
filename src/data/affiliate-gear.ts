export const AFFILIATE_TAG = "sf6maxdatabas-20" as const;

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
    asin: "B09V7X3CWG",
  },
  {
    shortLabel: "Mad Catz EGO",
    badge: "Mid-Range",
    tagline: "Slim PS5 and PS4 arcade stick with Sanwa feel.",
    asin: "B0CLDC5QZ6",
  },
  {
    shortLabel: "HORI OCTA Pro",
    badge: "Leverless Pro",
    tagline: "Official leverless for PS5, PS4, and PC.",
    asin: "B0DVB2JB1K",
  },
  {
    shortLabel: "Mayflash F500 Elite",
    badge: "Mod Friendly",
    tagline: "Swap parts easily. PS4, Switch, and PC.",
    asin: "B07DLFPG6G",
  },
] as const satisfies readonly AffiliateGearItem[];

export function gearHref(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`;
}
