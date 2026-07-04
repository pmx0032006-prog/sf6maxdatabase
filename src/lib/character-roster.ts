import { roster, type Character } from "@/data/characters";
import { getCharacterMoveImageFiles } from "@/lib/character-images";
import { hasWikiFrameData } from "@/lib/wiki-frame-lookup";

export function getCharacterBySlug(slug: string): Character | undefined {
  return roster.find((character) => character.slug === slug);
}

/** 判定画像が1枚以上あるキャラ */
export function isCharacterReady(slug: string): boolean {
  return getCharacterMoveImageFiles(slug).length > 0;
}

/** Wikiフレーム数値が入っているキャラ */
export function isCharacterFullyReady(slug: string): boolean {
  return hasWikiFrameData(slug);
}
