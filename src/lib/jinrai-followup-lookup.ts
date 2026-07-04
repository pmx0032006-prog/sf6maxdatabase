/** 迅雷脚派生 — 画像 236mk_6hk → Wiki 236k_6hk */

const METERLESS_JINRAI_FOLLOWUP =
  /^236(?:lk|mk|hk)_(6hk|6lk|6mk)$/i;

export function expandJinraiFollowupKeys(rawKey: string): string[] {
  const key = rawKey.toLowerCase();
  const m = key.match(METERLESS_JINRAI_FOLLOWUP);
  if (!m) return [];
  return [`236k_${m[1].toLowerCase()}`];
}
