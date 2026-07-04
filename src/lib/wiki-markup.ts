/** SuperCombo Wiki のマークアップ・空テンプレートを表示用に整形 */

export function cleanWikiText(value: string | null | undefined): string {
  if (value == null) return "";
  let s = String(value);
  s = s.replace(/\{\{\{[^}]*\}\}\}/g, "");
  s = s.replace(/'''/g, "");
  s = s.replace(/<br\s*\/?>/gi, " / ");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/&nbsp;/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

export function displayWikiValue(value: string | null | undefined): string {
  const cleaned = cleanWikiText(value);
  return cleaned || "—";
}

export type FrameAdvantageTone = "positive" | "negative" | "neutral";

/** ヒット時 / オンブロック の +/- 表示用 */
export function getFrameAdvantageTone(
  value: string | null | undefined,
): FrameAdvantageTone {
  const cleaned = cleanWikiText(value);
  if (!cleaned || cleaned === "-") return "neutral";
  if (/^\+/.test(cleaned) || /\s\+/.test(cleaned)) return "positive";
  if (/^-/.test(cleaned) || /\s-/.test(cleaned)) return "negative";
  return "neutral";
}

export function frameAdvantageClass(tone: FrameAdvantageTone): string {
  if (tone === "positive") return "text-emerald-600";
  if (tone === "negative") return "text-rose-600";
  return "text-foreground";
}

/** 5LP → 5L など短縮表記（Wikiヒットボックス表記用） */
export function getShortInput(input: string | null | undefined): string {
  const cleaned = cleanWikiText(input);
  if (!cleaned) return "—";
  return cleaned
    .replace(/LP$/i, "L")
    .replace(/MP$/i, "M")
    .replace(/HP$/i, "H")
    .replace(/LK$/i, "L")
    .replace(/MK$/i, "M")
    .replace(/HK$/i, "H");
}

export function isCancelable(cancel: string | null | undefined): boolean {
  const c = cleanWikiText(cancel);
  if (!c || c === "-" || c === "—") return false;
  return true;
}

export function isDriveRushSupported(move: {
  drCancelHit?: string | null;
  drCancelBlk?: string | null;
  afterDrHit?: string | null;
  afterDrBlk?: string | null;
  cancel?: string | null;
}): boolean {
  const fields = [
    move.drCancelHit,
    move.drCancelBlk,
    move.afterDrHit,
    move.afterDrBlk,
  ];
  if (fields.some((f) => cleanWikiText(f) && cleanWikiText(f) !== "-")) {
    return true;
  }
  const cancel = cleanWikiText(move.cancel);
  return /\bDR\b/i.test(cancel);
}

export function yesNoJa(flag: boolean): string {
  return flag ? "可" : "不可";
}

const INVULN_TYPE_JA: Record<string, string> = {
  full: "全身無敵",
  "strike/throw": "打投無敵",
  air: "空中無敵",
  "lower body projectile": "下半身投無敵",
  "upper body projectile": "上半身投無敵",
  strike: "打撃無敵",
  projectile: "投無敵",
  throw: "投無敵",
};

function invulnTypeJa(raw: string): string {
  const base = raw.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase();
  return INVULN_TYPE_JA[base] ?? raw.trim();
}

function formatInvulnRange(start: string, end: string): string {
  return `${start}〜${end}f`;
}

function formatInvulnSegment(segment: string): string {
  const s = segment.trim();
  if (!s) return "";

  const rangeType = s.match(
    /^(\d+(?:\(\d+\))?)\s*[-–]\s*(\d+(?:\(\d+\))?)\s+(.+)$/i,
  );
  if (rangeType) {
    return `${formatInvulnRange(rangeType[1], rangeType[2])} ${invulnTypeJa(rangeType[3])}`;
  }

  const singleType = s.match(/^(\d+)\s+(.+)$/i);
  if (singleType) {
    return `${singleType[1]}f ${invulnTypeJa(singleType[2])}`;
  }

  const typeRange = s.match(/^(.+?)\s+(\d+)\s*[-–]\s*(\d+(?:\(\d+\))?)$/i);
  if (typeRange) {
    return `${formatInvulnRange(typeRange[2], typeRange[3])} ${invulnTypeJa(typeRange[1])}`;
  }

  const typeRangeNote = s.match(
    /^(\w+(?:\s+\w+)*)\s+(\d+)\s*[-–]\s*(\d+)\s*\(([^)]+)\)$/i,
  );
  if (typeRangeNote) {
    const type = `${typeRangeNote[1]} (${typeRangeNote[4]})`;
    return `${formatInvulnRange(typeRangeNote[2], typeRangeNote[3])} ${invulnTypeJa(type)}`;
  }

  return s.replace(/(\d+)\s*[-–]\s*(\d+)/g, "$1〜$2f");
}

/** Wiki無敵表記 → 1〜13f 全身無敵 など */
export function formatInvulnJa(value: string | null | undefined): string | null {
  const cleaned = cleanWikiText(value);
  if (!cleaned) return null;

  const segments = cleaned.split(/,\s*/).map(formatInvulnSegment).filter(Boolean);
  return segments.length > 0 ? segments.join(" / ") : null;
}

export function hasInvuln(value: string | null | undefined): boolean {
  return formatInvulnJa(value) !== null;
}
