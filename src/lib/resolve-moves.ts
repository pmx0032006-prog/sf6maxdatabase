import type { MoveFrameData } from "@/data/characters/cammy";
import type { MoveImageFile } from "@/lib/character-images";
import {
  getBaseSlug,
  getMoveDisplayName,
  getMoveKey,
  groupImageFilesByMove,
  pickPrimaryImageFile,
  sortImageFileGroups,
} from "@/lib/move-sort";
import { lookupWikiFrameData } from "@/lib/wiki-frame-lookup";

function wikiToMoveFields(
  wiki: ReturnType<typeof lookupWikiFrameData>,
): Partial<MoveFrameData> {
  if (!wiki) return {};
  return {
    input: wiki.input,
    startup: wiki.startup,
    active: wiki.active,
    recovery: wiki.recovery,
    total: wiki.total,
    guard: wiki.guard,
    cancel: wiki.cancel,
    onBlock: wiki.onBlock,
    onHit: wiki.onHit,
    damage: wiki.damage,
    invuln: wiki.invuln,
    drCancelHit: wiki.drCancelHit,
    drCancelBlk: wiki.drCancelBlk,
    afterDrHit: wiki.afterDrHit,
    afterDrBlk: wiki.afterDrBlk,
    hitconfirm: wiki.hitconfirm,
    notes: wiki.notes,
  };
}

const EMPTY = "—";

function labelsForMove(
  characterSlug: string,
  imageSlug: string,
  wiki: ReturnType<typeof lookupWikiFrameData>,
) {
  const fallback = getMoveDisplayName(imageSlug);
  if (!wiki) {
    return fallback;
  }
  return {
    nameJa: wiki.nameJa ?? fallback.nameJa,
    nameEn: wiki.nameEn || fallback.nameEn,
  };
}

function stubMoveFromImageFile(
  characterSlug: string,
  primary: MoveImageFile,
  frames: MoveImageFile[],
): MoveFrameData {
  const wiki = lookupWikiFrameData(characterSlug, primary.slug);
  const labels = labelsForMove(characterSlug, primary.slug, wiki);

  return {
    imageSlug: primary.slug,
    imageExt: primary.ext,
    imageFrames: frames.map((f) => ({ imageSlug: f.slug, imageExt: f.ext })),
    nameJa: labels.nameJa,
    nameEn: labels.nameEn,
    startup: wiki?.startup ?? EMPTY,
    active: wiki?.active ?? EMPTY,
    total: wiki?.total ?? EMPTY,
    onBlock: wiki?.onBlock ?? EMPTY,
    onHit: wiki?.onHit ?? EMPTY,
    ...wikiToMoveFields(wiki),
  };
}

function withImageFiles(
  move: MoveFrameData,
  primary: MoveImageFile,
  frames: MoveImageFile[],
): MoveFrameData {
  return {
    ...move,
    imageSlug: primary.slug,
    imageExt: primary.ext,
    imageFrames: frames.map((f) => ({ imageSlug: f.slug, imageExt: f.ext })),
  };
}

function lookupKeys(slug: string): string[] {
  const lower = slug.toLowerCase();
  const base = getBaseSlug(lower);
  const stripped = getMoveKey(base);
  return [
    lower,
    base,
    stripped,
    stripped.replace(/_/g, ""),
  ];
}

function buildDataMap(
  dataMoves: MoveFrameData[],
): Map<string, MoveFrameData> {
  const map = new Map<string, MoveFrameData>();
  for (const move of dataMoves) {
    for (const key of lookupKeys(move.imageSlug)) {
      if (!map.has(key)) {
        map.set(key, move);
      }
    }
  }
  return map;
}

function findDataMove(
  characterSlug: string,
  dataMap: Map<string, MoveFrameData>,
  baseSlug: string,
): MoveFrameData | undefined {
  for (const key of lookupKeys(baseSlug)) {
    const found = dataMap.get(key);
    if (found) return found;
  }
  const wiki = lookupWikiFrameData(characterSlug, baseSlug);
  if (wiki) {
    const labels = labelsForMove(characterSlug, baseSlug, wiki);
    return {
      imageSlug: baseSlug,
      ...wiki,
      ...labels,
      startup: wiki.startup || EMPTY,
      active: wiki.active || EMPTY,
      total: wiki.total || EMPTY,
      onBlock: wiki.onBlock || EMPTY,
      onHit: wiki.onHit || EMPTY,
    };
  }
  return undefined;
}

/** フォルダ内の画像をグループ化・ソートして表示（データがあれば数値をマージ） */
export function resolveMoves(
  characterSlug: string,
  dataMoves: MoveFrameData[],
  imageFiles: MoveImageFile[],
): MoveFrameData[] {
  if (imageFiles.length === 0) {
    return dataMoves;
  }

  const dataMap = buildDataMap(dataMoves);
  const groups = groupImageFilesByMove(imageFiles);
  const sortedGroups = sortImageFileGroups(groups);

  return sortedGroups.map((frames) => {
    const primary = pickPrimaryImageFile(frames);
    const baseSlug = getBaseSlug(primary.slug);
    const data = findDataMove(characterSlug, dataMap, baseSlug);
    return data
      ? withImageFiles(data, primary, frames)
      : stubMoveFromImageFile(characterSlug, primary, frames);
  });
}
