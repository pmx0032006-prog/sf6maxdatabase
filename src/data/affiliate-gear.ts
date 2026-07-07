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
