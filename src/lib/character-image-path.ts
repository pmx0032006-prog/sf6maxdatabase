/** キャラ slug → 画像フォルダ名（デスクトップ素材と一致） */
export const CHARACTER_IMAGE_DIRS: Record<string, string> = {
  cammy: "cyam_jpg",
  ryu: "ryu_jpg",
  ken: "ken_jpg",
  luke: "ruke_jpg",
  jamie: "je_jpg",
  manon: "mannon_jpg",
  kimberly: "kin_jpg",
  marisa: "mariza_jpg",
  lily: "riri_jpg",
  jp: "jp_jpg",
  juri: "juri_jpg",
  guile: "guile_jpg",
  "chun-li": "chun_jpg",
  blanka: "bla_jpg",
  dhalsim: "daru_jpg",
  "e-honda": "honda_jpg",
  "dee-jay": "dj_jpg",
  zangief: "zan_jpg",
  aki: "aki_jpg",
  ed: "ed_jpg",
  rashid: "ras_jpg",
  akuma: "akuma_jpg",
  elena: "ere_jpg",
  terry: "ter_jpg",
  mai: "mai_jpg",
  sagat: "sag_jpg",
  "c-viper": "cv_jpg",
  alex: "are_jpg",
  "m-bison": "ve_jpg",
  ingrid: "ing_jpg",
};

export function getCharacterImageDirName(characterSlug: string): string {
  return CHARACTER_IMAGE_DIRS[characterSlug] ?? characterSlug;
}

export function characterMoveImagePath(
  characterSlug: string,
  imageSlug: string,
  ext = ".jpg",
): string {
  const dirName = getCharacterImageDirName(characterSlug);
  const normalizedExt = ext.startsWith(".") ? ext : `.${ext}`;
  return `/images/characters/${dirName}/${imageSlug}${normalizedExt}`;
}
