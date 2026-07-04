/** 判定画像ゴミ箱 — 素材フォルダの `_trash/` とファイル名ルール */

export const IMAGE_TRASH_DIR = "_trash";

/** ゴミ箱へ移動したらサイト・同期・監査から除外 */
const TRASH_FILENAME_PATTERNS: RegExp[] = [
  /_test\.(jpe?g|png|webp)$/i,
  /test\.(jpe?g|png|webp)$/i,
  /名称未設定/i,
  /未設定-\d+\.(jpe?g|png|webp)$/i,
];

export function isTrashedImageFilename(filename: string): boolean {
  const base = filename.replace(/^.*[\\/]/, "");
  return TRASH_FILENAME_PATTERNS.some((pattern) => pattern.test(base));
}
