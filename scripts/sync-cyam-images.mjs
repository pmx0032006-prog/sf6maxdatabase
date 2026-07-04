import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dest = path.join(projectRoot, "public", "images", "characters", "cyam_jpg");

const sourceCandidates = [
  "C:\\Users\\sf6_site\\cyam_jpg",
  "C:\\Users\\sf6_site\\cyam_jp",
  path.join(projectRoot, "cyam_jpg"),
  path.join(projectRoot, "cyam_jp"),
  path.join(projectRoot, "public", "images", "characters", "cyam_jp"),
];

mkdirSync(dest, { recursive: true });

const src = sourceCandidates.find((candidate) => existsSync(candidate));

if (!src) {
  console.log("[sync-camy] 画像フォルダが見つかりません");
  sourceCandidates.forEach((p) => console.log(`  - ${p}`));
  process.exit(1);
}

const files = readdirSync(src).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  cpSync(path.join(src, file), path.join(dest, file), { force: true });
}

console.log(`[sync-camy] ${files.length} 枚を同期`);
console.log(`  元: ${src}`);
console.log(`  先: ${dest}`);
