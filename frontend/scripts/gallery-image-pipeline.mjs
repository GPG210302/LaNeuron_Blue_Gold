// gallery-image-pipeline.mjs
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

async function convertHeicToJpeg(srcPath) {
  const dir = path.dirname(srcPath);
  const base = path.basename(srcPath, path.extname(srcPath));
  const outJpeg = path.join(dir, `${base}-converted.jpg`);

  // Use macOS `sips` to convert
  await execFileAsync("sips", ["-s", "format", "jpeg", srcPath, "--out", outJpeg]);

  return outJpeg;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Where you drop the raw photos (inside frontend)
const SOURCE_DIR = path.resolve(__dirname, "../raw-gallery-source");

// 2) Where processed, watermarked webp files will go (served by the app)
const OUTPUT_DIR = path.resolve(__dirname, "../public/gallery");

// Allowed image extensions
const IMAGE_EXTS = [
  ".jpg", ".jpeg", ".png", ".heic", ".HEIC", ".JPG", ".JPEG", ".PNG"
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function isImage(filename) {
  const ext = path.extname(filename);
  return IMAGE_EXTS.includes(ext);
}

// Generate a diagonal "La Neuron" SVG watermark, with slight random offset near centre
function makeWatermarkSvg(width, height) {
  const cx = width * (0.4 + Math.random() * 0.2);
  const cy = height * (0.4 + Math.random() * 0.2);
  const fontSize = Math.round(Math.min(width, height) * 0.07);

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${cx},${cy}) rotate(-30)">
        <text
          x="0" y="0"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="system-ui, sans-serif"
          font-size="${fontSize}"
          font-weight="800"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(0,0,0,0.55)"
          stroke-width="${fontSize * 0.045}"
        >
          La Neuron
        </text>
      </g>
    </svg>
  `);
}

async function processImage(srcPath) {
  const rel = path.relative(SOURCE_DIR, srcPath);
  const outDir = path.join(OUTPUT_DIR, path.dirname(rel));
  const base = path.basename(srcPath, path.extname(srcPath));
  await ensureDir(outDir);

  const outWebp = path.join(outDir, `${base}.webp`);

  let inputPath = srcPath;

  // If HEIC, first convert to JPEG via sips
  const ext = path.extname(srcPath);
  if (ext.toLowerCase() === ".heic") {
    try {
      inputPath = await convertHeicToJpeg(srcPath);
    } catch (err) {
      console.error("HEIC → JPEG conversion failed for", srcPath, err.message);
      return; // skip this file if conversion fails
    }
  }

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const maxWidth = 1600;

  const originalWidth = metadata.width || maxWidth;
  const originalHeight = metadata.height || maxWidth;
  const finalWidth = Math.min(originalWidth, maxWidth);
  const finalHeight = Math.round(
    originalHeight * (finalWidth / originalWidth)
  );

    const watermarkSvg = makeWatermarkSvg(finalWidth, finalHeight);

    await image
    .rotate() // auto-orient using EXIF, then remove the orientation tag
    .resize({ width: finalWidth, withoutEnlargement: true })
    .composite([{ input: watermarkSvg, blend: "over" }])
    .toFormat("webp", { quality: 80 })
    .toFile(outWebp);

    console.log("Processed:", rel, "→", path.relative(SOURCE_DIR, outWebp));
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && isImage(entry.name)) {
      try {
        await processImage(full);
      } catch (err) {
        console.error("Error processing", full, err.message);
      }
    }
  }
}

async function main() {
  console.log("Source:", SOURCE_DIR);
  console.log("Output:", OUTPUT_DIR);
  await ensureDir(OUTPUT_DIR);
  await walk(SOURCE_DIR);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});