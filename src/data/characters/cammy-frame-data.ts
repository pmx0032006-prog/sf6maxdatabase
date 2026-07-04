/**
 * フレームデータ出典: https://wiki.supercombo.gg/w/Street_Fighter_6/Cammy
 * Startup / Active / Recovery → total = startup + active + recovery - 1（先頭active重複）
 */
import type { MoveFrameData } from "@/data/characters/cammy";
import { expandCammyLookupKeys } from "@/lib/cammy-move-lookup";

export type CammyFrameEntry = Omit<
  MoveFrameData,
  "imageSlug" | "imageExt" | "imageFrames"
>;

function t(
  startup: number,
  active: number | string,
  recovery: number | string,
): string {
  const aStr = String(active);
  const rStr = String(recovery);
  if (rStr.includes("+") || aStr.includes("(") || aStr.includes("+")) {
    return "—";
  }
  const a = Number.parseInt(aStr, 10) || 0;
  const r = Number.parseInt(rStr, 10) || 0;
  return String(startup + a + r - 1);
}

function moveKeyFromSlug(slug: string): string {
  return slug
    .replace(/\.(jpe?g|png|webp)$/i, "")
    .replace(/^cyam_/i, "")
    .replace(/_\d+$/, "")
    .toLowerCase();
}

function row(
  nameJa: string,
  nameEn: string,
  startup: number,
  active: number | string,
  recovery: number | string,
  onHit: string,
  onBlock: string,
): CammyFrameEntry {
  const activeStr = String(active);
  const recoveryStr = String(recovery);
  const activeNum = Number.parseInt(activeStr, 10) || 0;
  const recoveryNum = Number.parseInt(recoveryStr, 10) || 0;
  return {
    nameJa,
    nameEn,
    startup: String(startup),
    active: activeStr,
    total: t(startup, activeNum, recoveryNum),
    onHit,
    onBlock,
  };
}

/** 画像ベース slug（cyam_ 除去・小文字）で参照 */
export const cammyFrameDataByKey: Record<string, CammyFrameEntry> = {
  // 立ち通常
  "5lp": row("立ち弱P", "5LP", 4, 3, 7, "+5", "-2"),
  "5mp": row("立ち中P", "5MP", 6, 4, 13, "+6", "-1"),
  "5hp": row("立ち強P", "5HP", 8, 3, 20, "+2", "-3"),
  "5lk": row("立ち弱K", "5LK", 5, 3, 10, "+2", "-3"),
  "5mk": row("立ち中K", "5MK", 8, 3, 18, "+3", "-4"),
  "5hk": row("立ち強K", "5HK", 11, 3, 19, "+2", "-3"),

  // しゃがみ通常
  "2lp": row("しゃがみ弱P", "2LP", 4, 2, 8, "+5", "-2"),
  "2mp": row("しゃがみ中P", "2MP", 7, 3, 14, "+5", "-2"),
  "2hp": row("しゃがみ強P", "2HP", 10, 4, 15, "+7", "+1"),
  "2lk": row("しゃがみ弱K", "2LK", 5, 3, 7, "+3", "-2"),
  "2mk": row("しゃがみ中K", "2MK", 8, 3, 18, "+1", "-5"),
  "2hk": row("しゃがみ強K", "2HK", 9, 3, 24, "KD+38", "-10"),

  // ジャンプ
  jlp: row("ジャンプ弱P", "j.LP", 4, 10, 3, "+6", "+2"),
  jmp: row("ジャンプ中P", "j.MP", 6, 8, 3, "+10", "+1"),
  jhp: row("ジャンプ強P", "j.HP", 8, 5, 3, "+8", "+4"),
  jlk: row("ジャンプ弱K", "j.LK", 4, 10, 3, "+6", "+2"),
  jmk: row("ジャンプ中K", "j.MK", 7, 6, 3, "+12", "+8"),
  jhk: row("ジャンプ強K", "j.HK", 10, 6, 3, "+11", "+7"),

  // ターゲットコンボ
  "5hphk": row("スイングコンボ", "5HP~HK", 13, "4(12)3", 29, "KD+26", "-12"),
  "4mphk": row("リフトコンボ", "4MP~HK", 9, 3, 23, "KD+49", "-12"),

  // レバー技
  "4mp": row("リフトアッパー", "4MP", 5, 5, 12, "+4", "-1"),
  "4hk": row("アサルトブレード", "4HK", 9, 3, 18, "KD+54", "-7"),
  "6hk": row("ディレイドリッパー", "6HK", 18, 3, 20, "KD+31", "-12"),

  // 236 スパイラルアロー
  "236lk": row("スパイラルアロー（弱）", "236LK", 9, 13, 21, "KD+26", "-12"),
  "236mk": row("スパイラルアロー（中）", "236MK", 9, 15, 21, "KD+26", "-14"),
  "236hk": row("スパイラルアロー（強）", "236HK", 15, "3(1)12", 21, "KD+29", "-12"),
  "236kk": row("ODスパイラルアロー", "236KK", 13, "3(1)12", 20, "KD+47", "-14"),
  "236hp": row("スパイラルアロー（強）", "236HP", 15, "3(1)12", 21, "KD+29", "-12"),
  "236lp_2lk": row("スパイラルアロー派生", "236LP~2LK", 9, 13, 21, "KD+26", "-12"),
  "236lp_lp+lk": row("スパイラルアロー派生", "236LP~LP+LK", 9, 13, 21, "KD+26", "-12"),
  "236hp_lp": row("スパイラルアロー派生", "236HP~LP", 15, "3(1)12", 21, "KD+29", "-12"),
  "236ppod_2lk": row("ODスパイラルアロー派生", "236PP~2LK", 13, "3(1)12", 20, "KD+47", "-14"),

  // 623 キャノンスパイク
  "623lk": row("キャノンスパイク（弱）", "623LK", 5, 12, "24+16", "KD+20", "-36"),
  "623mk": row("キャノンスパイク（中）", "623MK", 6, 12, "25+16", "KD+21", "-36"),
  "623hk": row("キャノンスパイク（強）", "623HK", 7, 12, "28+16", "KD+22", "-36"),
  "623kk": row("ODキャノンスパイク", "623KK", 6, 12, "30+16", "KD+19", "-40"),

  // 214 クイックスピンナックル
  "214lp": row("クイックスピン（弱）", "214LP", 21, 4, 16, "+2", "-3"),
  "214mp": row("クイックスピン（中）", "214MP", 24, 4, 16, "+3", "-2"),
  "214hp": row("クイックスピン（強）", "214HP", 28, 4, 17, "+5", "+3"),
  "214pp": row("ODクイックスピン", "214PP", 25, 4, 17, "+7", "-2"),

  // スーパーアーツ
  "236236lk": row("スピンドライブスマッシャー", "SA1", 9, 16, 38, "KD+10", "-24"),
  "236236lp": row("デルタレッドアサルト", "SA3", 9, 15, 38, "HKD+17", "-33"),
  "214214lp": row("キラービースピン", "SA2", 13, 9, 37, "HKD+12", "-24"),

  // 画像名の別名（Wikiに直接ないものは近い技へ）
  j896lk: row("ODキャノンストライク", "j.214KK", 13, 12, 3, "0", "-2"),
  "896od": row("OD技", "896OD", 13, "3(1)12", 20, "KD+47", "-14"),
  "9j214od": row("ジャンプ派生", "9j214OD", 13, 9, 37, "HKD+12", "-24"),
  "9l214hk": row("ジャンプ派生", "9L214HK", 13, 9, 37, "HKD+12", "-24"),
};

/** ファイル名 → データキーの別名（cammy-move-lookup と同期） */
const cammyFrameAliases: Record<string, string> = {
  "236od": "236kk",
  "623od": "623kk",
  "214od": "214pp",
  "236236lp_sa3": "236236lp",
  "214214lp_sa2": "214214lp",
  "236236lk_sa1": "236236lk",
};

export function lookupCammyFrameData(
  slug: string,
): CammyFrameEntry | undefined {
  const key = moveKeyFromSlug(slug);
  const keys = [
    key,
    ...expandCammyLookupKeys(key),
    ...(cammyFrameAliases[key] ? [cammyFrameAliases[key]] : []),
  ];
  for (const candidate of keys) {
    const hit = cammyFrameDataByKey[candidate];
    if (hit) return hit;
  }
  return undefined;
}

/** 旧 cammyMoves 互換（手動データ配列） */
export const cammyMoves: MoveFrameData[] = Object.entries(cammyFrameDataByKey).map(
  ([key, data]) => ({
    imageSlug: key.toUpperCase(),
    ...data,
  }),
);
