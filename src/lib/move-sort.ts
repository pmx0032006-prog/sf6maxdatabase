import type { MoveImageFile } from "@/lib/character-images";
import type { MoveFrameData } from "@/data/characters/cammy";

const CHAR_PREFIX = /^[a-z0-9]+_/i;
/** 判定画像の連番のみ（_1, _2 …）。技名の数字（例: ras_4479）は残す */
const FRAME_SUFFIX = /_(\d{1,2})$/;

export type MoveSectionId =
  | "standing"
  | "crouch"
  | "target"
  | "lever"
  | "jump"
  | "special"
  | "super";

export const MOVE_SECTION_ORDER: MoveSectionId[] = [
  "standing",
  "crouch",
  "target",
  "lever",
  "jump",
  "special",
  "super",
];

export const MOVE_SECTION_LABELS: Record<MoveSectionId, string> = {
  standing: "立ち通常技",
  crouch: "しゃがみ通常技",
  target: "ターゲットコンボ",
  lever: "レバー技",
  jump: "ジャンプ技",
  special: "必殺技",
  super: "スーパーアーツ",
};

/** キャラ接頭辞を除いた技キー（例: cyam_5lp → 5lp） */
export function stripCharPrefix(slug: string): string {
  return slug.replace(CHAR_PREFIX, "");
}

/** 連番サフィックス _1, _2 を除いたベース slug */
export function getBaseSlug(slug: string): string {
  return slug.replace(FRAME_SUFFIX, "");
}

/** 連番（なし=0, _1=1 …） */
export function getFrameIndex(slug: string): number {
  const match = slug.match(FRAME_SUFFIX);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function getMoveKey(slug: string): string {
  return stripCharPrefix(getBaseSlug(slug)).toLowerCase();
}

const NORMAL_BUTTON_ORDER: Record<string, number> = {
  lp: 1,
  mp: 2,
  hp: 3,
  lk: 4,
  mk: 5,
  hk: 6,
};

const SIMPLE_STANDING = /^5(lp|mp|hp|lk|mk|hk)$/i;
const SIMPLE_CROUCH = /^2(lp|mp|hp|lk|mk|hk)$/i;
const SIMPLE_JUMP = /^j(lp|mp|hp|lk|mk|hk)$/i;

const NORMAL_DISPLAY_NAMES: Record<string, { nameJa: string; nameEn: string }> =
  {
    "5lp": { nameJa: "立ち弱P", nameEn: "5LP" },
    "5mp": { nameJa: "立ち中P", nameEn: "5MP" },
    "5hp": { nameJa: "立ち強P", nameEn: "5HP" },
    "5lk": { nameJa: "立ち弱K", nameEn: "5LK" },
    "5mk": { nameJa: "立ち中K", nameEn: "5MK" },
    "5hk": { nameJa: "立ち強K", nameEn: "5HK" },
    "2lp": { nameJa: "しゃがみ弱P", nameEn: "2LP" },
    "2mp": { nameJa: "しゃがみ中P", nameEn: "2MP" },
    "2hp": { nameJa: "しゃがみ強P", nameEn: "2HP" },
    "2lk": { nameJa: "しゃがみ弱K", nameEn: "2LK" },
    "2mk": { nameJa: "しゃがみ中K", nameEn: "2MK" },
    "2hk": { nameJa: "しゃがみ強K", nameEn: "2HK" },
    jlp: { nameJa: "ジャンプ弱P", nameEn: "j.LP" },
    jmp: { nameJa: "ジャンプ中P", nameEn: "j.MP" },
    jhp: { nameJa: "ジャンプ強P", nameEn: "j.HP" },
    jlk: { nameJa: "ジャンプ弱K", nameEn: "j.LK" },
    jmk: { nameJa: "ジャンプ中K", nameEn: "j.MK" },
    jhk: { nameJa: "ジャンプ強K", nameEn: "j.HK" },
  };

function isSimpleStanding(key: string): boolean {
  return SIMPLE_STANDING.test(key);
}

function isSimpleCrouch(key: string): boolean {
  return SIMPLE_CROUCH.test(key);
}

function isCommandMotion(key: string): boolean {
  return /^(236|623|214|412|360|720|22|44|66|886|898|896|9)/.test(key);
}

export function getMoveSectionId(slug: string): MoveSectionId {
  const key = getMoveKey(slug);

  if (/sa[123]/.test(key)) return "super";
  if (/^j[a-z0-9_+]/i.test(key)) return "jump";
  if (isCommandMotion(key)) return "special";
  if (/^[346][a-z0-9_+]/i.test(key)) return "lever";
  if (/^5/.test(key)) {
    return isSimpleStanding(key) ? "standing" : "target";
  }
  if (/^2/.test(key)) {
    return isSimpleCrouch(key) ? "crouch" : "target";
  }

  return "special";
}

function getSectionIndex(slug: string): number {
  return MOVE_SECTION_ORDER.indexOf(getMoveSectionId(slug));
}

function getNormalButtonOrder(key: string): number {
  const match = key.match(/(lp|mp|hp|lk|mk|hk)/i);
  return match ? (NORMAL_BUTTON_ORDER[match[1].toLowerCase()] ?? 99) : 99;
}

function getNormalSortTuple(key: string): [number, number, string] {
  if (SIMPLE_STANDING.test(key) || SIMPLE_CROUCH.test(key)) {
    const btn = key.slice(1).toLowerCase();
    return [0, NORMAL_BUTTON_ORDER[btn] ?? 99, key];
  }
  return [1, 0, key];
}

function compareNormalKeys(keyA: string, keyB: string): number {
  const tupleA = getNormalSortTuple(keyA);
  const tupleB = getNormalSortTuple(keyB);
  for (let i = 0; i < 3; i += 1) {
    if (tupleA[i] !== tupleB[i]) {
      return tupleA[i] < tupleB[i] ? -1 : 1;
    }
  }
  return 0;
}

function getLeverSortTuple(key: string): [number, number, string] {
  const dir = key.match(/^([346])/);
  const dirOrder = dir ? Number.parseInt(dir[1], 10) : 9;
  return [dirOrder, getNormalButtonOrder(key), key];
}

function compareLeverKeys(keyA: string, keyB: string): number {
  const tupleA = getLeverSortTuple(keyA);
  const tupleB = getLeverSortTuple(keyB);
  for (let i = 0; i < 3; i += 1) {
    if (tupleA[i] !== tupleB[i]) {
      return tupleA[i] < tupleB[i] ? -1 : 1;
    }
  }
  return 0;
}

/** ジャンプ通常: j弱P→中P→強P→弱K→中K→強K、OD/派生は最後 */
function isJumpOdOrVariant(key: string): boolean {
  if (!/^j/i.test(key)) return false;
  if (SIMPLE_JUMP.test(key)) return false;
  return /od|kk|pp|896|214/i.test(key);
}

function getJumpSortTuple(key: string): [number, number, string] {
  if (isJumpOdOrVariant(key)) {
    return [2, getNormalButtonOrder(key), key];
  }
  const simple = key.match(SIMPLE_JUMP);
  if (simple) {
    return [0, NORMAL_BUTTON_ORDER[simple[1].toLowerCase()] ?? 99, key];
  }
  if (/^j/i.test(key)) {
    return [1, getNormalButtonOrder(key), key];
  }
  return [3, 99, key];
}

function compareJumpKeys(keyA: string, keyB: string): number {
  const tupleA = getJumpSortTuple(keyA);
  const tupleB = getJumpSortTuple(keyB);
  for (let i = 0; i < 3; i += 1) {
    if (tupleA[i] !== tupleB[i]) {
      return tupleA[i] < tupleB[i] ? -1 : 1;
    }
  }
  return 0;
}

function getSpecialMotionOrder(key: string): number {
  if (key.startsWith("236")) return 1;
  if (key.startsWith("623")) return 2;
  if (key.startsWith("214")) return 3;
  if (key.startsWith("886") || key.startsWith("896") || key.startsWith("898"))
    return 4;
  if (key.startsWith("9")) return 5;
  return 99;
}

function getSuperOrder(key: string): number {
  if (/sa1/.test(key)) return 1;
  if (/sa2/.test(key)) return 2;
  if (/sa3/.test(key)) return 3;
  return 99;
}

export function compareMoveSlugs(a: string, b: string): number {
  const sectionDiff = getSectionIndex(a) - getSectionIndex(b);
  if (sectionDiff !== 0) return sectionDiff;

  const keyA = getMoveKey(a);
  const keyB = getMoveKey(b);
  const section = getMoveSectionId(a);

  switch (section) {
    case "standing":
    case "crouch":
      return compareNormalKeys(keyA, keyB);
    case "lever":
      return compareLeverKeys(keyA, keyB);
    case "jump":
      return compareJumpKeys(keyA, keyB);
    case "special": {
      const motionDiff =
        getSpecialMotionOrder(keyA) - getSpecialMotionOrder(keyB);
      if (motionDiff !== 0) return motionDiff;
      return keyA.localeCompare(keyB, "en", { numeric: true });
    }
    case "super": {
      const saDiff = getSuperOrder(keyA) - getSuperOrder(keyB);
      if (saDiff !== 0) return saDiff;
      return keyA.localeCompare(keyB, "en", { numeric: true });
    }
    default:
      return keyA.localeCompare(keyB, "en", { numeric: true });
  }
}

export function getNormalDisplayName(
  slug: string,
): { nameJa: string; nameEn: string } | null {
  const key = getMoveKey(slug);
  return NORMAL_DISPLAY_NAMES[key] ?? null;
}

function formatSlugLabel(key: string): string {
  return key.replace(/_/g, " ").toUpperCase();
}

export function getMoveDisplayName(
  slug: string,
): { nameJa: string; nameEn: string } {
  const normal = getNormalDisplayName(slug);
  if (normal) return normal;

  const key = getMoveKey(slug);
  const section = getMoveSectionId(slug);

  if (section === "target") {
    return {
      nameJa: `ターゲット ${formatSlugLabel(key)}`,
      nameEn: key.toUpperCase(),
    };
  }
  if (section === "lever") {
    return {
      nameJa: `レバー ${formatSlugLabel(key)}`,
      nameEn: key.toUpperCase(),
    };
  }
  if (section === "super") {
    const sa = key.match(/sa[123]/i)?.[0]?.toUpperCase() ?? "";
    return {
      nameJa: `スーパーアーツ ${sa}`,
      nameEn: key.toUpperCase(),
    };
  }

  return { nameJa: formatSlugLabel(key), nameEn: key.toUpperCase() };
}

/** カード内の並び順で _1 _2 _3 … と表示 */
export function getFrameLabel(_slug: string, indexInList: number): string {
  return `_${indexInList + 1}`;
}

export function groupImageFilesByMove(
  files: MoveImageFile[],
): Map<string, MoveImageFile[]> {
  const groups = new Map<string, MoveImageFile[]>();

  for (const file of files) {
    const key = getBaseSlug(file.slug).toLowerCase();
    const list = groups.get(key) ?? [];
    list.push(file);
    groups.set(key, list);
  }

  for (const list of groups.values()) {
    list.sort((a, b) => getFrameIndex(a.slug) - getFrameIndex(b.slug));
  }

  return groups;
}

export function pickPrimaryImageFile(files: MoveImageFile[]): MoveImageFile {
  return files.find((f) => getFrameIndex(f.slug) === 1) ?? files[0];
}

export function sortImageFileGroups(
  groups: Map<string, MoveImageFile[]>,
): MoveImageFile[][] {
  return [...groups.values()].sort((a, b) =>
    compareMoveSlugs(a[0].slug, b[0].slug),
  );
}

export type MoveSectionGroup = {
  id: MoveSectionId;
  label: string;
  moves: MoveFrameData[];
};

/** ソート済み技リストをセクション見出し付きに分割 */
export function splitMovesIntoSections(
  moves: MoveFrameData[],
): MoveSectionGroup[] {
  const sections: MoveSectionGroup[] = [];

  for (const move of moves) {
    const id = getMoveSectionId(move.imageSlug);
    const last = sections[sections.length - 1];
    if (!last || last.id !== id) {
      sections.push({
        id,
        label: MOVE_SECTION_LABELS[id],
        moves: [move],
      });
    } else {
      last.moves.push(move);
    }
  }

  return sections;
}
