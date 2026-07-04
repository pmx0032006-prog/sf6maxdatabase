import fs from "fs";
import path from "path";
import {
  CHARACTER_IMAGE_DIRS,
  getCharacterImageDirName,
} from "@/lib/character-image-path";
import { isTrashedImageFilename } from "@/lib/image-trash";

/** ドクのデスクトップ素材フォルダ */
export const MATERIALS_ROOT =
  "C:\\Users\\pmx00\\Desktop\\ストリートファイター6　攻略サイト　素材\\ストリートファイター6　攻略サイト　素材　20260620";

export type MoveImageFile = {
  slug: string;
  ext: string;
};

export { getCharacterImageDirName };

function getSourceDirectories(characterSlug: string): string[] {
  const dirName = getCharacterImageDirName(characterSlug);
  return [
    path.join(process.cwd(), "public", "images", "characters", dirName),
    path.join(MATERIALS_ROOT, dirName),
    path.join("C:\\Users\\sf6_site", dirName),
    path.join(process.cwd(), dirName),
  ];
}

function getImageDirectoryOnDisk(characterSlug: string): string | null {
  for (const candidate of getSourceDirectories(characterSlug)) {
    if (!fs.existsSync(candidate)) {
      continue;
    }
    const hasImages = fs
      .readdirSync(candidate)
      .some((file) => /\.(jpe?g|png|webp)$/i.test(file));
    if (hasImages) {
      return candidate;
    }
  }
  return null;
}

export function getCharacterMoveImageFiles(
  characterSlug: string,
): MoveImageFile[] {
  const dir = getImageDirectoryOnDisk(characterSlug);
  if (!dir) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .filter((file) => !isTrashedImageFilename(file))
    .map((file) => {
      const match = file.match(/^(.+)\.(jpe?g|png|webp)$/i);
      if (!match) {
        return null;
      }
      return {
        slug: match[1],
        ext: `.${match[2].toLowerCase()}`,
      };
    })
    .filter((file): file is MoveImageFile => file !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug, "en", { numeric: true }));
}

export function listCharactersWithImages(): string[] {
  return Object.keys(CHARACTER_IMAGE_DIRS).filter(
    (slug) => getCharacterMoveImageFiles(slug).length > 0,
  );
}
