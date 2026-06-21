import sharp from "sharp";
import { stat } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.resolve("public/dental");
const TARGETS = [
  { from: "39.jpg", to: "39.webp" },
  { from: "40.jpg", to: "40.webp" },
  { from: "DSC04628_HDR.JPG", to: "DSC04628_HDR.webp" },
];

const MAX_WIDTH = 2000;

for (const { from, to } of TARGETS) {
  const srcPath = path.join(SRC_DIR, from);
  const dstPath = path.join(SRC_DIR, to);
  const srcSize = (await stat(srcPath)).size;

  await sharp(srcPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(dstPath);

  const dstSize = (await stat(dstPath)).size;
  const pct = ((1 - dstSize / srcSize) * 100).toFixed(1);
  console.log(
    `${from} (${(srcSize / 1e6).toFixed(2)} MB)  →  ${to} (${(dstSize / 1e6).toFixed(2)} MB)   −${pct}%`,
  );
}
