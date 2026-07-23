import capcomMoveNamesJson from "@/data/capcom-move-names.json";
import { expandChunLiLookupKeys } from "@/lib/chun-li-move-lookup";
import { getBaseSlug, getMoveKey } from "@/lib/move-sort";

export type CapcomMoveLabel = {
  nameEn: string;
  nameJa?: string;
};

type CapcomMoveNames = Record<string, Record<string, CapcomMoveLabel | string>>;

const capcomMoveNames = capcomMoveNamesJson as CapcomMoveNames;

function lookupKeys(characterSlug: string, slug: string): string[] {
  const lower = slug.toLowerCase();
  const base = getBaseSlug(lower);
  const stripped = getMoveKey(base);
  const keys = [lower, base, stripped, stripped.replace(/_/g, "")];

  if (characterSlug === "chun-li") {
    for (const seed of [...keys]) {
      for (const expanded of expandChunLiLookupKeys(seed)) {
        if (!keys.includes(expanded)) keys.push(expanded);
      }
    }
  }

  return keys;
}

function normalizeLabel(
  hit: CapcomMoveLabel | string | undefined,
): CapcomMoveLabel | undefined {
  if (!hit) return undefined;
  if (typeof hit === "string") return { nameEn: hit };
  if (hit.nameEn) return hit;
  return undefined;
}

/** Official Capcom move label for a character image slug, if known. */
export function lookupCapcomMoveLabel(
  characterSlug: string,
  imageSlug: string,
): CapcomMoveLabel | undefined {
  const perChar = capcomMoveNames[characterSlug];
  if (!perChar) return undefined;
  for (const key of lookupKeys(characterSlug, imageSlug)) {
    const hit = normalizeLabel(perChar[key]);
    if (hit) return hit;
  }
  return undefined;
}

/** @deprecated Use lookupCapcomMoveLabel */
export function lookupCapcomMoveName(
  characterSlug: string,
  imageSlug: string,
): string | undefined {
  return lookupCapcomMoveLabel(characterSlug, imageSlug)?.nameEn;
}

export function hasCapcomMoveNames(characterSlug: string): boolean {
  return Boolean(capcomMoveNames[characterSlug]);
}
