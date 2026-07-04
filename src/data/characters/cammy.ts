export type MoveImageFrame = {
  imageSlug: string;
  imageExt?: string;
};

export type MoveFrameData = {
  /** ファイル名（拡張子なし）= cyam_jpg/[imageSlug].jpg など */
  imageSlug: string;
  imageExt?: string;
  /** 連番画像（_1, _2 …）を1技にまとめたときの全フレーム */
  imageFrames?: MoveImageFrame[];
  /** Wiki input 列（例: 5LP） */
  input?: string;
  nameJa: string;
  nameEn: string;
  startup: string;
  active: string;
  /** 回復フレーム */
  recovery?: string;
  total: string;
  /** ガード属性（LH 等） */
  guard?: string;
  /** キャンセルルート（Chn Sp SA 等） */
  cancel?: string;
  onBlock: string;
  onHit: string;
  damage?: string;
  invuln?: string;
  drCancelHit?: string;
  drCancelBlk?: string;
  afterDrHit?: string;
  afterDrBlk?: string;
  hitconfirm?: string;
  notes?: string;
};

export const cammyProfile = {
  slug: "cammy",
  en: "CAMMY",
  ja: "キャミィ",
};

/** SuperCombo Wiki 準拠 — https://wiki.supercombo.gg/w/Street_Fighter_6/Cammy */
export { cammyMoves } from "@/data/characters/cammy-frame-data";
