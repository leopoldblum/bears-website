/**
 * Pre-build image optimization script.
 *
 * Scans src/assets/ for images larger than THRESHOLD (10 MB) and compresses
 * them in-place at the highest quality that fits under TARGET size (~9.9 MB).
 *
 * - All formats (JPEG, PNG, WebP) are converted to WebP with quality binary-search
 * - References across all of src/ are updated when filenames change
 * - Idempotent: files already under threshold are skipped on subsequent runs
 */

import { readdir, stat, readFile, writeFile, unlink } from "node:fs/promises";
import { join, dirname, extname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS_DIR = join(ROOT, "src", "assets");

const THRESHOLD = 10 * 1024 * 1024; // 10 MB
const TARGET = THRESHOLD - 100 * 1024; // ~9.9 MB
const QUALITY_FLOOR = 30;

const PROCESSABLE = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set(["node_modules", ".git", "dist"]);

/** Recursively collect all files under `dir`. */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const REF_EXTENSIONS = new Set([".md", ".mdx", ".astro", ".ts", ".tsx", ".js", ".jsx"]);

/** Recursively collect all files that could reference images under `dir`. */
async function walkSourceFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkSourceFiles(full)));
    } else if (REF_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Binary-search the highest quality whose output fits in `targetBytes`.
 * `compressFn(quality)` must return a Buffer.
 */
async function findBestQuality(compressFn, targetBytes) {
  // Check if quality 100 already fits
  const best = await compressFn(100);
  if (best.length <= targetBytes) return { buffer: best, quality: 100 };

  let lo = QUALITY_FLOOR;
  let hi = 100;
  let resultBuf = null;
  let resultQ = lo;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const buf = await compressFn(mid);
    if (buf.length <= targetBytes) {
      resultBuf = buf;
      resultQ = mid;
      lo = mid + 1; // try higher quality
    } else {
      hi = mid - 1; // need lower quality
    }
  }

  if (!resultBuf) {
    // Even QUALITY_FLOOR didn't fit — return it anyway with a warning
    resultBuf = await compressFn(QUALITY_FLOOR);
    resultQ = QUALITY_FLOOR;
  }

  return { buffer: resultBuf, quality: resultQ };
}

const SRC_DIR = join(ROOT, "src");

/**
 * Replace oldName with newName in all source files under `searchRoot`.
 * Uses a word-boundary regex so partial filenames don't match
 * (e.g. "event-1.jpg" won't match inside "my-event-1.jpg").
 */
async function updateReferences(oldName, newName, searchRoot = SRC_DIR) {
  // Escape regex special chars in the filename
  const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Match only when surrounded by non-filename characters (quotes, slashes,
  // whitespace, start/end of string). This prevents "event-1.jpg" from
  // matching inside "other-event-1.jpg".
  const pattern = new RegExp(`(?<=[^a-zA-Z0-9_-]|^)${escaped}(?=[^a-zA-Z0-9_-]|$)`, "g");

  const sourceFiles = await walkSourceFiles(searchRoot);
  let updatedCount = 0;
  for (const file of sourceFiles) {
    const text = await readFile(file, "utf-8");
    if (pattern.test(text)) {
      // Reset lastIndex since we're reusing the regex with "g" flag
      pattern.lastIndex = 0;
      await writeFile(file, text.replace(pattern, newName), "utf-8");
      updatedCount++;
      const rel = relative(ROOT, file);
      console.log(`  Updated reference in ${rel}`);
    }
  }
  return updatedCount;
}

function formatSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Image optimization: scanning src/assets/ ...");

  const allFiles = await walk(ASSETS_DIR);
  const oversized = [];

  for (const filePath of allFiles) {
    const ext = extname(filePath).toLowerCase();
    if (!PROCESSABLE.has(ext)) continue;
    const info = await stat(filePath);
    if (info.size > THRESHOLD) {
      oversized.push({ filePath, ext, size: info.size });
    }
  }

  if (oversized.length === 0) {
    console.log("Nothing to do — all images are under 10 MB.");
    return;
  }

  console.log(`Found ${oversized.length} image(s) over 10 MB:\n`);

  for (const { filePath, ext, size } of oversized) {
    const rel = relative(ROOT, filePath);
    const name = basename(filePath);
    console.log(`Processing ${rel} (${formatSize(size)}) ...`);

    // Read file into memory so sharp releases its handle before we write back
    const inputBuffer = await readFile(filePath);

    // Convert everything to WebP
    const compressFn = (q) =>
      sharp(inputBuffer).webp({ quality: q }).toBuffer();

    const { buffer, quality } = await findBestQuality(compressFn, TARGET);

    if (ext === ".webp") {
      // Already WebP — overwrite in place
      await writeFile(filePath, buffer);
      console.log(
        `  Compressed WebP: ${formatSize(size)} -> ${formatSize(buffer.length)} (quality ${quality})`
      );
    } else {
      // Different extension — write .webp, update refs, delete original
      const newName = basename(filePath, extname(filePath)) + ".webp";
      const newPath = join(dirname(filePath), newName);

      await writeFile(newPath, buffer);
      const refs = await updateReferences(name, newName);
      await unlink(filePath);

      console.log(
        `  Converted to WebP: ${formatSize(size)} -> ${formatSize(buffer.length)} (quality ${quality})` +
          (refs > 0 ? `, updated ${refs} content file(s)` : "")
      );
    }
  }

  console.log("\nImage optimization complete.");
}

// Export for testing
export {
  walk,
  walkSourceFiles,
  findBestQuality,
  updateReferences,
  formatSize,
  main,
  THRESHOLD,
  TARGET,
  QUALITY_FLOOR,
  PROCESSABLE,
};

// Only run when executed directly (not imported)
const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url).replace(/\\/g, "/") ===
    process.argv[1].replace(/\\/g, "/");

if (isDirectRun) {
  main().catch((err) => {
    console.error("Image optimization failed:", err);
    process.exit(1);
  });
}
