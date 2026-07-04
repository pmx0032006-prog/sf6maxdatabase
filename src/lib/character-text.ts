import fs from "fs";
import path from "path";

export type CharacterTextVariant = "c" | "m";

const VARIANT_LABELS: Record<CharacterTextVariant, string> = {
  c: "クラシック",
  m: "モダン",
};

export function getCharacterTextVariantLabel(variant: CharacterTextVariant): string {
  return VARIANT_LABELS[variant];
}

export function getCharacterArticlePath(
  characterSlug: string,
  variant: CharacterTextVariant,
): string {
  return path.join(process.cwd(), "public", "text", `${characterSlug}_${variant}.txt`);
}

export function getCharacterArticleText(
  characterSlug: string,
  variant: CharacterTextVariant,
): string | null {
  const filePath = getCharacterArticlePath(characterSlug, variant);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

/** 空行で段落分割（サイト内スライダーUIのゴミ行は除去） */
export function splitArticleParagraphs(text: string): string[] {
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/^\d+(?:\s+\d+)*\s+Previous\s+Next\s*/gm, "");

  return cleaned
    .split(/\n{2,}/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(""),
    )
    .filter((p) => p.length > 0);
}
