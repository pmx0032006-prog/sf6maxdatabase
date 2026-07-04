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
  { label: "Startup", shortLabel: "Start", key: "startup" },
  { label: "On Hit", shortLabel: "Hit", key: "onHit", advantage: true },
  { label: "On Block", shortLabel: "Blk", key: "onBlock", advantage: true },
  { label: "Damage", shortLabel: "DMG", key: "damage" },
];

export const PLAYER_CANCEL: WikiFrameColumn = {
  label: "Cancel Route",
  shortLabel: "Cancel",
  key: "cancel",
};

/** Wiki詳細 — 2段目以降 */
export const DETAIL_FRAME_COLUMNS: WikiFrameColumn[] = [
  { label: "Active", shortLabel: "Active", key: "active" },
  { label: "Recovery", shortLabel: "Rec", key: "recovery" },
  { label: "Total", shortLabel: "Total", key: "total" },
  { label: "Guard", shortLabel: "LH", key: "guard" },
];

/** DR・無敵など */
export const WIKI_FRAME_EXTRA_ROWS: {
  label: string;
  key: keyof MoveFrameData;
  advantage?: boolean;
}[] = [
  { label: "DR Cancel (Hit)", key: "drCancelHit", advantage: true },
  { label: "DR Cancel (Block)", key: "drCancelBlk", advantage: true },
  { label: "After DR (Hit)", key: "afterDrHit", advantage: true },
  { label: "After DR (Block)", key: "afterDrBlk", advantage: true },
  { label: "Hit Confirm", key: "hitconfirm" },
  { label: "Invuln", key: "invuln" },
];
