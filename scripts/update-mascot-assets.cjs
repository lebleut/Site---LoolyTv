const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = "C:/Users/jamel/OneDrive/Bureau/loolytv-mascot.png";
const outDir = "E:/React Projects/My TV - MVP/site - LoolyTv/public/brand";

async function main() {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const sample = (x, y) => {
    const i = (y * w + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  console.log("corners", sample(2, 2), sample(w - 3, 2), sample(2, h - 3), sample(w - 3, h - 3));

  let transparent = 0;
  let black = 0;
  const total = w * h;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 20) transparent++;
    else if (data[i] < 12 && data[i + 1] < 12 && data[i + 2] < 12) black++;
  }
  console.log({
    transparentPct: Math.round((100 * transparent) / total),
    blackPct: Math.round((100 * black) / total),
  });

  await sharp(src)
    .trim({ threshold: 8 })
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, "mascot-hero.png"));

  await sharp(src)
    .trim({ threshold: 8 })
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, "mascot.png"));

  const mascotBuf = await sharp(src)
    .trim({ threshold: 8 })
    .resize(520, 520, { fit: "inside" })
    .png()
    .toBuffer();
  const mascotMeta = await sharp(mascotBuf).metadata();
  const left = Math.round((1200 - mascotMeta.width) / 2);
  const top = Math.round((675 - mascotMeta.height) / 2);

  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#e8f7ff"/>
          <stop offset="45%" stop-color="#fff4e8"/>
          <stop offset="100%" stop-color="#ffe8e4"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#g)"/>
    </svg>`,
  );

  await sharp(svg)
    .composite([{ input: mascotBuf, left, top }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, "og.jpg"));

  for (const f of ["mascot-hero.png", "mascot.png", "og.jpg"]) {
    console.log(f, Math.round(fs.statSync(path.join(outDir, f)).size / 1024) + "KB");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
