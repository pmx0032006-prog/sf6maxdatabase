/** Official JA / kanji label for display under English move names. */
export function formatKanjiMoveName(
  nameJa: string | undefined | null,
): string {
  if (!nameJa?.trim()) return "";

  const paren = nameJa.match(/[（(]([^（）()]+)[）)]/);
  if (paren?.[1] && /[\u4e00-\u9fff]/.test(paren[1])) {
    return paren[1].trim();
  }

  return nameJa
    .replace(/^\[[^\]]+\]/, "")
    .replace(/^(?:SA\d|CA)\s+/i, "")
    .replace(/^(?:弱|中|強|OD)\s*/, "")
    .trim();
}

export function getMoveTitleLines(move: {
  nameEn?: string;
  nameJa?: string;
}): { primary: string; kanji?: string } {
  const en = move.nameEn?.trim();
  const kanji = formatKanjiMoveName(move.nameJa);
  const primary = en || kanji || "—";
  const showKanji =
    Boolean(kanji) && kanji !== primary && /[\u4e00-\u9fff]/.test(kanji);

  return {
    primary,
    kanji: showKanji ? kanji : undefined,
  };
}
