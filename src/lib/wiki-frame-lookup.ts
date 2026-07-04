import type { MoveFrameData } from "@/data/characters/cammy";
import wikiFrameData from "@/data/wiki-frame-data.json";
import { getCharacterImageDirName } from "@/lib/character-image-path";
import { getBaseSlug, getMoveKey, stripCharPrefix } from "@/lib/move-sort";
import {
  expandDrinkFallbackKeys,
  expandDrinkPriorityKeys,
} from "@/lib/drink-level-lookup";
import { expandHoldLookupKeys } from "@/lib/hold-move-lookup";
import { expandAirSpecialLookupKeys } from "@/lib/air-special-lookup";
import { expandAkumaLookupKeys } from "@/lib/akuma-move-lookup";
import { expandAkiLookupKeys } from "@/lib/aki-move-lookup";
import { expandAlexLookupKeys } from "@/lib/alex-move-lookup";
import { expandJamieLookupKeys } from "@/lib/jamie-move-lookup";
import { expandJinraiFollowupKeys } from "@/lib/jinrai-followup-lookup";
import { expandBlankaLookupKeys } from "@/lib/blanka-move-lookup";
import { expandCammyLookupKeys } from "@/lib/cammy-move-lookup";
import { expandChunLiLookupKeys } from "@/lib/chun-li-move-lookup";
import { expandDhalsimLookupKeys } from "@/lib/dhalsim-move-lookup";
import { expandDeeJayLookupKeys } from "@/lib/dee-jay-move-lookup";
import { expandEdLookupKeys } from "@/lib/ed-move-lookup";
import { expandElenaLookupKeys } from "@/lib/elena-move-lookup";
import { expandEHondaLookupKeys } from "@/lib/e-honda-move-lookup";
import { expandGuileLookupKeys } from "@/lib/guile-move-lookup";
import { expandIngridLookupKeys } from "@/lib/ingrid-move-lookup";
import { expandJpLookupKeys } from "@/lib/jp-move-lookup";
import { expandJuriLookupKeys } from "@/lib/juri-move-lookup";
import { expandKenLookupKeys } from "@/lib/ken-move-lookup";
import { expandKimberlyLookupKeys } from "@/lib/kimberly-move-lookup";
import { expandLilyLookupKeys } from "@/lib/lily-move-lookup";
import { expandLukeLookupKeys } from "@/lib/luke-move-lookup";
import { expandMaiLookupKeys } from "@/lib/mai-move-lookup";
import { expandManonLookupKeys } from "@/lib/manon-move-lookup";
import { expandMBisonLookupKeys } from "@/lib/m-bison-move-lookup";
import { expandMarisaLookupKeys } from "@/lib/marisa-move-lookup";
import { expandZangiefLookupKeys } from "@/lib/zangief-move-lookup";
import { expandOdLookupKeys } from "@/lib/od-move-lookup";
import { expandCViperLookupKeys } from "@/lib/c-viper-move-lookup";
import { expandRashidLookupKeys } from "@/lib/rashid-move-lookup";
import { expandRyuLookupKeys } from "@/lib/ryu-move-lookup";
import { expandSagatLookupKeys } from "@/lib/sagat-move-lookup";
import { expandSuperLookupKeys, stripSuperImageSuffix } from "@/lib/super-move-lookup";
import { expandTerryLookupKeys } from "@/lib/terry-move-lookup";
import { expandTargetComboLookupKeys } from "@/lib/target-combo-lookup";

export type WikiFrameEntry = Omit<
  MoveFrameData,
  "imageSlug" | "imageExt" | "imageFrames" | "nameJa"
> & {
  nameJa: string | null;
};

type WikiFrameStore = Record<string, Record<string, WikiFrameEntry>>;

const store = wikiFrameData as WikiFrameStore;

/** フォルダ名と異なる画像接頭辞（manon_ ≠ mannon_） */
const CHARACTER_IMAGE_PREFIX: Record<string, string> = {
  manon: "manon_",
};

export function getImageFilePrefix(characterSlug: string): string {
  if (CHARACTER_IMAGE_PREFIX[characterSlug]) {
    return CHARACTER_IMAGE_PREFIX[characterSlug];
  }
  const dir = getCharacterImageDirName(characterSlug);
  const base = dir.replace(/_jpe?g$/i, "");
  return `${base}_`;
}

/** 画像 slug → データキー（5lp, 236kk …） */
export function moveKeyFromImageSlug(
  characterSlug: string,
  slug: string,
): string {
  const prefix = getImageFilePrefix(characterSlug);
  return slug
    .replace(/\.(jpe?g|png|webp)$/i, "")
    .replace(new RegExp(`^${prefix}`, "i"), "")
    .replace(/_\d+$/, "")
    .toLowerCase();
}

/** 全キャラ共通の別名（画像名 ↔ Wiki）— OD 等 */
const GLOBAL_FRAME_ALIASES: Record<string, string> = {
  "236od": "236kk",
  "623od": "623kk",
  "214od": "214pp",
  "214kkod": "214kk",
};

function resolveWikiKey(_characterSlug: string, rawKey: string): string {
  const aliases: Record<string, string> = {
    ...GLOBAL_FRAME_ALIASES,
  };
  let key = rawKey.toLowerCase();
  if (aliases[key]) {
    key = aliases[key];
  }
  return key;
}

function lookupKeys(characterSlug: string, slug: string): string[] {
  const slugNoExt = slug.toLowerCase().replace(/\.(jpe?g|png|webp)$/i, "");
  const unprefixedSlug = stripCharPrefix(slugNoExt);
  const raw = moveKeyFromImageSlug(characterSlug, slug);
  const base = getBaseSlug(slugNoExt);
  const stripped = getMoveKey(base);
  const trimmed = stripped.replace(/_+$/, "");
  const resolved = resolveWikiKey(characterSlug, stripped);
  const airKeys = expandAirSpecialLookupKeys(stripped);
  const odKeys = [
    ...expandOdLookupKeys(stripped),
    ...(trimmed !== stripped ? expandOdLookupKeys(trimmed) : []),
  ];
  const drinkPriority =
    characterSlug === "jamie"
      ? [
          ...expandDrinkPriorityKeys(unprefixedSlug),
          ...expandDrinkPriorityKeys(raw),
          ...expandDrinkPriorityKeys(stripped),
          ...(trimmed !== stripped ? expandDrinkPriorityKeys(trimmed) : []),
          ...expandDrinkPriorityKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandDrinkPriorityKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const drinkFallback =
    characterSlug === "jamie"
      ? [
          ...expandDrinkFallbackKeys(unprefixedSlug),
          ...expandDrinkFallbackKeys(raw),
          ...expandDrinkFallbackKeys(stripped),
          ...(trimmed !== stripped ? expandDrinkFallbackKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandDrinkFallbackKeys(key)),
          ...expandDrinkFallbackKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandDrinkFallbackKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const holdKeys = [
    ...expandHoldLookupKeys(stripped),
    ...expandHoldLookupKeys(unprefixedSlug),
  ];
  const tcKeys = [
    ...expandTargetComboLookupKeys(unprefixedSlug),
    ...expandTargetComboLookupKeys(stripped),
    ...(trimmed !== stripped
      ? expandTargetComboLookupKeys(trimmed)
      : []),
  ];
  const kimberlyKeys =
    characterSlug === "kimberly"
      ? [
          ...expandKimberlyLookupKeys(unprefixedSlug),
          ...expandKimberlyLookupKeys(raw),
          ...expandKimberlyLookupKeys(stripped),
          ...(trimmed !== stripped
            ? expandKimberlyLookupKeys(trimmed)
            : []),
          ...odKeys.flatMap((key) => expandKimberlyLookupKeys(key)),
          ...expandKimberlyLookupKeys(
            stripSuperImageSuffix(unprefixedSlug),
          ),
          ...expandKimberlyLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const marisaKeys =
    characterSlug === "marisa"
      ? [
          ...expandMarisaLookupKeys(unprefixedSlug),
          ...expandMarisaLookupKeys(raw),
          ...expandMarisaLookupKeys(stripped),
          ...(trimmed !== stripped
            ? expandMarisaLookupKeys(trimmed)
            : []),
          ...odKeys.flatMap((key) => expandMarisaLookupKeys(key)),
          ...expandMarisaLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandMarisaLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const lilyKeys =
    characterSlug === "lily"
      ? [
          ...expandLilyLookupKeys(unprefixedSlug),
          ...expandLilyLookupKeys(stripped),
          ...(trimmed !== stripped
            ? expandLilyLookupKeys(trimmed)
            : []),
          ...odKeys.flatMap((key) => expandLilyLookupKeys(key)),
          ...expandLilyLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
        ]
      : [];
  const jpKeys =
    characterSlug === "jp"
      ? [
          ...expandJpLookupKeys(unprefixedSlug),
          ...expandJpLookupKeys(stripped),
          ...(trimmed !== stripped ? expandJpLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandJpLookupKeys(key)),
          ...expandJpLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
        ]
      : [];
  const juriKeys =
    characterSlug === "juri"
      ? [
          ...expandJuriLookupKeys(unprefixedSlug),
          ...expandJuriLookupKeys(raw),
          ...expandJuriLookupKeys(stripped),
          ...(trimmed !== stripped ? expandJuriLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandJuriLookupKeys(key)),
          ...expandJuriLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandJuriLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const cammyKeys =
    characterSlug === "cammy"
      ? [
          ...expandCammyLookupKeys(unprefixedSlug),
          ...expandCammyLookupKeys(raw),
          ...expandCammyLookupKeys(stripped),
          ...(trimmed !== stripped ? expandCammyLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandCammyLookupKeys(key)),
          ...expandCammyLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandCammyLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const guileKeys =
    characterSlug === "guile"
      ? [
          ...expandGuileLookupKeys(unprefixedSlug),
          ...expandGuileLookupKeys(raw),
          ...expandGuileLookupKeys(stripped),
          ...(trimmed !== stripped ? expandGuileLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandGuileLookupKeys(key)),
          ...expandGuileLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandGuileLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const chunLiKeys =
    characterSlug === "chun-li"
      ? [
          ...expandChunLiLookupKeys(unprefixedSlug),
          ...expandChunLiLookupKeys(raw),
          ...expandChunLiLookupKeys(stripped),
          ...(trimmed !== stripped ? expandChunLiLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandChunLiLookupKeys(key)),
          ...expandChunLiLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandChunLiLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const blankaKeys =
    characterSlug === "blanka"
      ? [
          ...expandBlankaLookupKeys(unprefixedSlug),
          ...expandBlankaLookupKeys(raw),
          ...expandBlankaLookupKeys(stripped),
          ...(trimmed !== stripped ? expandBlankaLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandBlankaLookupKeys(key)),
          ...expandBlankaLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandBlankaLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const dhalsimKeys =
    characterSlug === "dhalsim"
      ? [
          ...expandDhalsimLookupKeys(unprefixedSlug),
          ...expandDhalsimLookupKeys(raw),
          ...expandDhalsimLookupKeys(stripped),
          ...(trimmed !== stripped ? expandDhalsimLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandDhalsimLookupKeys(key)),
          ...expandDhalsimLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandDhalsimLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const eHondaKeys =
    characterSlug === "e-honda"
      ? [
          ...expandEHondaLookupKeys(unprefixedSlug),
          ...expandEHondaLookupKeys(raw),
          ...expandEHondaLookupKeys(stripped),
          ...(trimmed !== stripped ? expandEHondaLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandEHondaLookupKeys(key)),
          ...expandEHondaLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandEHondaLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const deeJayKeys =
    characterSlug === "dee-jay"
      ? [
          ...expandDeeJayLookupKeys(unprefixedSlug),
          ...expandDeeJayLookupKeys(raw),
          ...expandDeeJayLookupKeys(stripped),
          ...(trimmed !== stripped ? expandDeeJayLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandDeeJayLookupKeys(key)),
          ...expandDeeJayLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandDeeJayLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const zangiefKeys =
    characterSlug === "zangief"
      ? [
          ...expandZangiefLookupKeys(unprefixedSlug),
          ...expandZangiefLookupKeys(raw),
          ...expandZangiefLookupKeys(stripped),
          ...(trimmed !== stripped ? expandZangiefLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandZangiefLookupKeys(key)),
          ...expandZangiefLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandZangiefLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const akiKeys =
    characterSlug === "aki"
      ? [
          ...expandAkiLookupKeys(unprefixedSlug),
          ...expandAkiLookupKeys(raw),
          ...expandAkiLookupKeys(stripped),
          ...(trimmed !== stripped ? expandAkiLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandAkiLookupKeys(key)),
          ...expandAkiLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandAkiLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const edKeys =
    characterSlug === "ed"
      ? [
          ...expandEdLookupKeys(unprefixedSlug),
          ...expandEdLookupKeys(raw),
          ...expandEdLookupKeys(stripped),
          ...(trimmed !== stripped ? expandEdLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandEdLookupKeys(key)),
          ...expandEdLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandEdLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const rashidKeys =
    characterSlug === "rashid"
      ? [
          ...expandRashidLookupKeys(unprefixedSlug),
          ...expandRashidLookupKeys(raw),
          ...expandRashidLookupKeys(stripped),
          ...(trimmed !== stripped ? expandRashidLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandRashidLookupKeys(key)),
          ...expandRashidLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandRashidLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const akumaKeys =
    characterSlug === "akuma"
      ? [
          ...expandAkumaLookupKeys(unprefixedSlug),
          ...expandAkumaLookupKeys(raw),
          ...expandAkumaLookupKeys(stripped),
          ...(trimmed !== stripped ? expandAkumaLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandAkumaLookupKeys(key)),
          ...expandAkumaLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandAkumaLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const elenaKeys =
    characterSlug === "elena"
      ? [
          ...expandElenaLookupKeys(unprefixedSlug),
          ...expandElenaLookupKeys(raw),
          ...expandElenaLookupKeys(stripped),
          ...(trimmed !== stripped ? expandElenaLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandElenaLookupKeys(key)),
          ...expandElenaLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandElenaLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const terryKeys =
    characterSlug === "terry"
      ? [
          ...expandTerryLookupKeys(unprefixedSlug),
          ...expandTerryLookupKeys(raw),
          ...expandTerryLookupKeys(stripped),
          ...(trimmed !== stripped ? expandTerryLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandTerryLookupKeys(key)),
          ...expandTerryLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandTerryLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const maiKeys =
    characterSlug === "mai"
      ? [
          ...expandMaiLookupKeys(unprefixedSlug),
          ...expandMaiLookupKeys(raw),
          ...expandMaiLookupKeys(stripped),
          ...(trimmed !== stripped ? expandMaiLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandMaiLookupKeys(key)),
          ...expandMaiLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandMaiLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const sagatKeys =
    characterSlug === "sagat"
      ? [
          ...expandSagatLookupKeys(unprefixedSlug),
          ...expandSagatLookupKeys(raw),
          ...expandSagatLookupKeys(stripped),
          ...(trimmed !== stripped ? expandSagatLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandSagatLookupKeys(key)),
          ...expandSagatLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandSagatLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const cViperKeys =
    characterSlug === "c-viper"
      ? [
          ...expandCViperLookupKeys(unprefixedSlug),
          ...expandCViperLookupKeys(raw),
          ...expandCViperLookupKeys(stripped),
          ...(trimmed !== stripped ? expandCViperLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandCViperLookupKeys(key)),
          ...expandCViperLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandCViperLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const mBisonKeys =
    characterSlug === "m-bison"
      ? [
          ...expandMBisonLookupKeys(unprefixedSlug),
          ...expandMBisonLookupKeys(raw),
          ...expandMBisonLookupKeys(stripped),
          ...(trimmed !== stripped ? expandMBisonLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandMBisonLookupKeys(key)),
          ...expandMBisonLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandMBisonLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const alexKeys =
    characterSlug === "alex"
      ? [
          ...expandAlexLookupKeys(unprefixedSlug),
          ...expandAlexLookupKeys(raw),
          ...expandAlexLookupKeys(stripped),
          ...(trimmed !== stripped ? expandAlexLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandAlexLookupKeys(key)),
          ...expandAlexLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandAlexLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const ingridKeys =
    characterSlug === "ingrid"
      ? [
          ...expandIngridLookupKeys(unprefixedSlug),
          ...expandIngridLookupKeys(raw),
          ...expandIngridLookupKeys(stripped),
          ...(trimmed !== stripped ? expandIngridLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandIngridLookupKeys(key)),
          ...expandIngridLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandIngridLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const ryuKeys =
    characterSlug === "ryu"
      ? [
          ...expandRyuLookupKeys(unprefixedSlug),
          ...expandRyuLookupKeys(raw),
          ...expandRyuLookupKeys(stripped),
          ...(trimmed !== stripped ? expandRyuLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandRyuLookupKeys(key)),
          ...expandRyuLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandRyuLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const kenKeys =
    characterSlug === "ken"
      ? [
          ...expandKenLookupKeys(unprefixedSlug),
          ...expandKenLookupKeys(raw),
          ...expandKenLookupKeys(stripped),
          ...(trimmed !== stripped ? expandKenLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandKenLookupKeys(key)),
          ...expandKenLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandKenLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const lukeKeys =
    characterSlug === "luke"
      ? [
          ...expandLukeLookupKeys(unprefixedSlug),
          ...expandLukeLookupKeys(raw),
          ...expandLukeLookupKeys(stripped),
          ...(trimmed !== stripped ? expandLukeLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandLukeLookupKeys(key)),
          ...expandLukeLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandLukeLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const jamieKeys =
    characterSlug === "jamie"
      ? [
          ...expandJamieLookupKeys(unprefixedSlug),
          ...expandJamieLookupKeys(raw),
          ...expandJamieLookupKeys(stripped),
          ...(trimmed !== stripped ? expandJamieLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandJamieLookupKeys(key)),
          ...expandJamieLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandJamieLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const manonKeys =
    characterSlug === "manon"
      ? [
          ...expandManonLookupKeys(unprefixedSlug),
          ...expandManonLookupKeys(raw),
          ...expandManonLookupKeys(stripped),
          ...(trimmed !== stripped ? expandManonLookupKeys(trimmed) : []),
          ...odKeys.flatMap((key) => expandManonLookupKeys(key)),
          ...expandManonLookupKeys(stripSuperImageSuffix(unprefixedSlug)),
          ...expandManonLookupKeys(stripSuperImageSuffix(raw)),
        ]
      : [];
  const jinraiKeys = expandJinraiFollowupKeys(stripped);
  const superKeys = expandSuperLookupKeys(stripped);

  return [
    ...drinkPriority,
    ...tcKeys,
    ...kimberlyKeys,
    ...marisaKeys,
    ...lilyKeys,
    ...jpKeys,
    ...juriKeys,
    ...cammyKeys,
    ...guileKeys,
    ...chunLiKeys,
    ...blankaKeys,
    ...dhalsimKeys,
    ...eHondaKeys,
    ...deeJayKeys,
    ...zangiefKeys,
    ...akiKeys,
    ...edKeys,
    ...rashidKeys,
    ...akumaKeys,
    ...elenaKeys,
    ...terryKeys,
    ...maiKeys,
    ...sagatKeys,
    ...cViperKeys,
    ...mBisonKeys,
    ...alexKeys,
    ...ingridKeys,
    ...ryuKeys,
    ...kenKeys,
    ...lukeKeys,
    ...jamieKeys,
    ...manonKeys,
    unprefixedSlug,
    raw,
    stripped,
    ...(trimmed !== stripped ? [trimmed] : []),
    resolved,
    ...holdKeys,
    ...airKeys,
    ...jinraiKeys,
    ...odKeys,
    ...superKeys,
    ...drinkFallback,
    stripped.replace(/_/g, ""),
    resolved.replace(/_/g, ""),
  ].filter((key, index, arr) => key && arr.indexOf(key) === index);
}

export function hasWikiFrameData(characterSlug: string): boolean {
  const moves = store[characterSlug];
  return Boolean(moves && Object.keys(moves).length > 0);
}

export function lookupWikiFrameData(
  characterSlug: string,
  slug: string,
): WikiFrameEntry | undefined {
  const moves = store[characterSlug];
  if (!moves) {
    return undefined;
  }

  for (const key of lookupKeys(characterSlug, slug)) {
    const hit = moves[key];
    if (hit) {
      return hit;
    }
  }

  return undefined;
}

export function listCharactersWithWikiFrameData(): string[] {
  return Object.entries(store)
    .filter(([, moves]) => Object.keys(moves).length > 0)
    .map(([slug]) => slug);
}
