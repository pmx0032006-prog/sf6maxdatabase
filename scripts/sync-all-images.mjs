import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const MATERIALS_ROOT =
  "C:\\Users\\pmx00\\Desktop\\ストリートファイター6　攻略サイト　素材\\ストリートファイター6　攻略サイト　素材　20260620";

const IMAGE_TRASH_DIR = "_trash";

const TRASH_FILENAME_PATTERNS = [
  /_test\.(jpe?g|png|webp)$/i,
  /test\.(jpe?g|png|webp)$/i,
  /名称未設定/i,
  /未設定-\d+\.(jpe?g|png|webp)$/i,
];

function isTrashedImageFilename(filename) {
  return TRASH_FILENAME_PATTERNS.some((pattern) => pattern.test(filename));
}

const CHARACTER_IMAGE_DIRS = {
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

const THUMB_MAP = {
  "aki_sam.jpg": "aki.jpg",
  "are_sam.jpg": "alex.jpg",
  "bra_sam.jpg": "blanka.jpg",
  "cam_sam.jpg": "cammy.jpg",
  "chun_sam.jpg": "chun-li.jpg",
  "cv_sam.jpg": "c-viper.jpg",
  "dar_sam.jpg": "dhalsim.jpg",
  "dee_sam.jpg": "dee-jay.jpg",
  "ed_sam.jpg": "ed.jpg",
  "ere_sam.jpg": "elena.jpg",
  "gou_sam.jpg": "akuma.jpg",
  "gui_sam.jpg": "guile.jpg",
  "honda_sam.jpg": "e-honda.jpg",
  "jei_sam.jpg": "jamie.jpg",
  "jp_sam.jpg": "jp.jpg",
  "ju_sam.jpg": "juri.jpg",
  "ken_sam.jpg": "ken.jpg",
  "kin_sam.jpg": "kimberly.jpg",
  "m.baison_sam.jpg": "m-bison.jpg",
  "mai_sam.jpg": "mai.jpg",
  "man_sam.jpg": "manon.jpg",
  "mari_sam.jpg": "marisa.jpg",
  "ras_sam.jpg": "rashid.jpg",
  "riri_sam.jpg": "lily.jpg",
  "ruu_sam.jpg": "luke.jpg",
  "ryu_sam.jpg": "ryu.jpg",
  "sagat_sam.jpg": "sagat.jpg",
  "ter_sam.jpg": "terry.jpg",
  "zan_sam.jpg": "zangief.jpg",
  "ing_sam.jpg": "ingrid.jpg",
};

function findSourceDir(dirName) {
  const candidates = [
    path.join(MATERIALS_ROOT, dirName),
    path.join("C:\\Users\\sf6_site", dirName),
    path.join(projectRoot, dirName),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function syncCharacterImages() {
  let totalFiles = 0;
  let syncedChars = 0;

  for (const [slug, dirName] of Object.entries(CHARACTER_IMAGE_DIRS)) {
    const src = findSourceDir(dirName);
    const dest = path.join(projectRoot, "public", "images", "characters", dirName);

    if (!src) {
      console.log(`[skip] ${slug}: ${dirName} が見つかりません`);
      continue;
    }

    mkdirSync(dest, { recursive: true });
    const files = readdirSync(src).filter(
      (f) => /\.(jpe?g|png|webp)$/i.test(f) && !isTrashedImageFilename(f),
    );

    for (const file of files) {
      try {
        cpSync(path.join(src, file), path.join(dest, file), { force: true });
      } catch (error) {
        console.log(`[warn] ${slug}/${file}: ${error.message}`);
      }
    }

    totalFiles += files.length;
    syncedChars += 1;
    console.log(`[sync] ${slug}: ${files.length} 枚 (${dirName})`);
  }

  return { totalFiles, syncedChars };
}

function syncThumbnails() {
  const thumbSrcDir = path.join(MATERIALS_ROOT, "sf6_samuneiru");
  const thumbDestDir = path.join(projectRoot, "public", "characters");
  mkdirSync(thumbDestDir, { recursive: true });

  if (!existsSync(thumbSrcDir)) {
    console.log("[skip] sf6_samuneiru が見つかりません");
    return 0;
  }

  let thumbCount = 0;
  for (const [srcName, destName] of Object.entries(THUMB_MAP)) {
    const srcFile = path.join(thumbSrcDir, srcName);
    if (!existsSync(srcFile)) continue;
    cpSync(srcFile, path.join(thumbDestDir, destName), { force: true });
    thumbCount += 1;
  }

  console.log(`[sync] thumbnails: ${thumbCount} 枚 → public/characters/`);
  return thumbCount;
}

const { totalFiles, syncedChars } = syncCharacterImages();
const thumbCount = syncThumbnails();

console.log(
  `\n[done] ${syncedChars} キャラ / ${totalFiles} 枚 + サムネ ${thumbCount} 枚`,
);

const watermarkScript = path.join(projectRoot, "scripts", "watermark-images.py");
if (existsSync(watermarkScript)) {
  console.log("\n[watermark] applying sf6maxdatabase.com tags...");
  const result = spawnSync("python", [watermarkScript], {
    cwd: projectRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.log("[warn] watermark step exited with errors");
  }
} else {
  console.log("[skip] watermark-images.py not found");
}
