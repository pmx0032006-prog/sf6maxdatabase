export const AFFILIATE_TAG = "sf6maxdatabas-20" as const;

export type AffiliateGearItem = {
  shortLabel: string;
  badge: string;
  tagline: string;
  asin: string;
};

/** US dollar-box order: left rail [0-4], right rail [5-9]. */
export const AFFILIATE_GEAR = [
  {
    shortLabel: "Victrix Pro FS-12",
    badge: "Premium",
    tagline: "Aircraft-grade aluminum leverless for PS5, PS4, and PC.",
    asin: "B0B3VQKGHW",
  },
  {
    shortLabel: "8BitDo Leverless",
    badge: "Buzz Pick",
    tagline: "Mechanical all-button. Official Xbox Series X|S and PC.",
    asin: "B0F7RMB4RH",
  },
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
    badge: "US #1",
    tagline: "PS5/PC official leverless. The US FGC standard.",
    asin: "B0CCX2DMXV",
  },
  {
    shortLabel: "Haute42 M Ultra",
    badge: "Value King",
    tagline: "16-key aluminum leverless. High CVR US budget meta.",
    asin: "B0DQ4PTBCW",
  },
  {
    shortLabel: "Haute42 Booter5",
    badge: "PS5 Add-on",
    tagline: "Dongle for Haute42 pads on PS5 fighting games.",
    asin: "B0GSHLBQSB",
  },
  {
    shortLabel: "Brook Wingman FGC2",
    badge: "Converter",
    tagline: "PS5 adapter for fight sticks and leverless boards.",
    asin: "B0DLWD1WMQ",
  },
  {
    shortLabel: "Street Fighter 6",
    badge: "PS5 Game",
    tagline: "The frame data on this site, in your hands.",
    asin: "B0BPJRGNSD",
  },
] as const satisfies readonly AffiliateGearItem[];

export const HOME_PRIME_ASINS = ["B0CCX2DMXV", "B0DQ4PTBCW"] as const;

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
