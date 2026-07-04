import type { MoveFrameData } from "@/data/characters/cammy";

export type WikiFrameColumn = {
  label: string;
  shortLabel: string;
  key: keyof MoveFrameData;
  /** +/- フレーム（ヒット・ガード） */
  advantage?: boolean;
};

/** プレイヤー目線 — 先に見たい5項目 */
export const PLAYER_FRAME_COLUMNS: WikiFrameColumn[] = [
  { label: "発生", shortLabel: "発生", key: "startup" },
  { label: "ヒット", shortLabel: "ヒット", key: "onHit", advantage: true },
  { label: "ガード", shortLabel: "ガード", key: "onBlock", advantage: true },
  { label: "ダメージ", shortLabel: "ダメ", key: "damage" },
];

export const PLAYER_CANCEL: WikiFrameColumn = {
  label: "キャンセルルート",
  shortLabel: "キャンセル",
  key: "cancel",
};

/** Wiki詳細 — 2段目以降 */
export const DETAIL_FRAME_COLUMNS: WikiFrameColumn[] = [
  { label: "持続", shortLabel: "持続", key: "active" },
  { label: "回復", shortLabel: "回復", key: "recovery" },
  { label: "全体", shortLabel: "全体", key: "total" },
  { label: "ガード属性", shortLabel: "LH", key: "guard" },
];

/** DR・無敵など */
export const WIKI_FRAME_EXTRA_ROWS: {
  label: string;
  key: keyof MoveFrameData;
  advantage?: boolean;
}[] = [
  { label: "DRキャンセル(ヒット)", key: "drCancelHit", advantage: true },
  { label: "DRキャンセル(ガード)", key: "drCancelBlk", advantage: true },
  { label: "DR後(ヒット)", key: "afterDrHit", advantage: true },
  { label: "DR後(ガード)", key: "afterDrBlk", advantage: true },
  { label: "ヒット確認", key: "hitconfirm" },
  { label: "無敵", key: "invuln" },
];
