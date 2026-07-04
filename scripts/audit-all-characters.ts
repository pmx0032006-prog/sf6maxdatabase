import { roster } from "../src/data/characters";
import { getCharacterMoveImageFiles } from "../src/lib/character-images";
import { getBaseSlug, groupImageFilesByMove, pickPrimaryImageFile } from "../src/lib/move-sort";
import { hasWikiFrameData, lookupWikiFrameData } from "../src/lib/wiki-frame-lookup";
import { hasWikiFullUi } from "../src/lib/wiki-full-ui";
import { resolveMoves } from "../src/lib/resolve-moves";
import fs from "fs";
import path from "path";

const EMPTY = "—";

type Row = {
  slug: string;
  ja: string;
  images: number;
  moves: number;
  misses: string[];
  noStartup: number;
  wiki: boolean;
  fullUi: boolean;
  thumb: boolean;
};

function audit(): Row[] {
  return roster.map((character) => {
    const imageFiles = getCharacterMoveImageFiles(character.slug);
    const groups = groupImageFilesByMove(imageFiles);
    const misses: string[] = [];

    for (const frames of groups.values()) {
      const primary = pickPrimaryImageFile(frames);
      const baseSlug = getBaseSlug(primary.slug);
      if (!lookupWikiFrameData(character.slug, baseSlug)) {
        misses.push(primary.slug);
      }
    }

    const resolved = resolveMoves(character.slug, [], imageFiles);
    const noStartup = resolved.filter((move) => move.startup === EMPTY).length;
    const thumbPath = path.join(process.cwd(), "public", character.thumb?.replace(/^\//, "") ?? "");

    return {
      slug: character.slug,
      ja: character.ja,
      images: imageFiles.length,
      moves: groups.size,
      misses,
      noStartup,
      wiki: hasWikiFrameData(character.slug),
      fullUi: hasWikiFullUi(character.slug),
      thumb: fs.existsSync(thumbPath),
    };
  });
}

const rows = audit();
const totalMisses = rows.reduce((sum, row) => sum + row.misses.length, 0);

console.log("=== SF6 30キャラ監査 ===");
console.log(`キャラ数: ${rows.length}`);
console.log(`lookup MISS 合計: ${totalMisses}`);
console.log("");

for (const row of rows) {
  const status =
    row.images === 0
      ? "NO_IMAGES"
      : row.misses.length > 0
        ? "MISS"
        : row.noStartup > 0
          ? "WARN"
          : "OK";
  console.log(
    `${status.padEnd(10)} ${row.slug.padEnd(10)} imgs=${String(row.images).padStart(3)} moves=${String(row.moves).padStart(3)} wiki=${row.wiki ? "Y" : "N"} ui=${row.fullUi ? "Y" : "N"} thumb=${row.thumb ? "Y" : "N"} ${row.ja}`,
  );
  if (row.misses.length > 0) {
    console.log(`           misses: ${row.misses.slice(0, 8).join(", ")}${row.misses.length > 8 ? " ..." : ""}`);
  }
  if (row.noStartup > 0 && row.misses.length === 0) {
    console.log(`           startup=— が ${row.noStartup} 件`);
  }
}

const problems = rows.filter((row) => row.images === 0 || row.misses.length > 0 || !row.wiki || !row.fullUi || !row.thumb);
console.log("");
console.log(`問題ありキャラ: ${problems.length}`);
if (problems.length > 0) {
  for (const row of problems) {
    const issues: string[] = [];
    if (row.images === 0) issues.push("画像0");
    if (!row.wiki) issues.push("wikiなし");
    if (!row.fullUi) issues.push("fullUiなし");
    if (!row.thumb) issues.push("サムネなし");
    if (row.misses.length > 0) issues.push(`MISS ${row.misses.length}`);
    console.log(`- ${row.slug}: ${issues.join(", ")}`);
  }
  process.exit(1);
}

process.exit(0);
