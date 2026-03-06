import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtemp, mkdir, writeFile, readFile, rm, stat, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

import {
  walk,
  walkSourceFiles,
  findBestQuality,
  updateReferences,
  formatSize,
  THRESHOLD,
  TARGET,
  QUALITY_FLOOR,
} from "../optimize-images.mjs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let tmpDir;

async function makeTmpDir() {
  tmpDir = await mkdtemp(join(tmpdir(), "opt-img-test-"));
  return tmpDir;
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// formatSize
// ---------------------------------------------------------------------------

describe("formatSize", () => {
  it("formats bytes as MB with two decimals", () => {
    expect(formatSize(10 * 1024 * 1024)).toBe("10.00 MB");
    expect(formatSize(1024 * 1024)).toBe("1.00 MB");
    expect(formatSize(512 * 1024)).toBe("0.50 MB");
  });

  it("handles zero bytes", () => {
    expect(formatSize(0)).toBe("0.00 MB");
  });
});

// ---------------------------------------------------------------------------
// walk
// ---------------------------------------------------------------------------

describe("walk", () => {
  beforeEach(async () => {
    await makeTmpDir();
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it("recursively finds all files", async () => {
    await mkdir(join(tmpDir, "sub"), { recursive: true });
    await writeFile(join(tmpDir, "a.txt"), "a");
    await writeFile(join(tmpDir, "sub", "b.txt"), "b");

    const files = await walk(tmpDir);
    const names = files.map((f) => f.replace(tmpDir, "").replace(/\\/g, "/"));
    expect(names).toContain("/a.txt");
    expect(names).toContain("/sub/b.txt");
  });

  it("returns empty array for empty directory", async () => {
    const files = await walk(tmpDir);
    expect(files).toEqual([]);
  });

  it("handles deeply nested directories", async () => {
    await mkdir(join(tmpDir, "a", "b", "c"), { recursive: true });
    await writeFile(join(tmpDir, "a", "b", "c", "deep.txt"), "deep");

    const files = await walk(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain("deep.txt");
  });
});

// ---------------------------------------------------------------------------
// walkSourceFiles
// ---------------------------------------------------------------------------

describe("walkSourceFiles", () => {
  beforeEach(async () => {
    await makeTmpDir();
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it("finds .md, .mdx, .astro, .ts, .tsx, .js, .jsx files", async () => {
    const extensions = [".md", ".mdx", ".astro", ".ts", ".tsx", ".js", ".jsx"];
    for (const ext of extensions) {
      await writeFile(join(tmpDir, `file${ext}`), "content");
    }
    // non-matching files
    await writeFile(join(tmpDir, "image.jpg"), "binary");
    await writeFile(join(tmpDir, "style.css"), "css");

    const files = await walkSourceFiles(tmpDir);
    expect(files).toHaveLength(extensions.length);
  });

  it("recurses into subdirectories", async () => {
    await mkdir(join(tmpDir, "deep", "nested"), { recursive: true });
    await writeFile(join(tmpDir, "deep", "nested", "page.astro"), "content");

    const files = await walkSourceFiles(tmpDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toContain("page.astro");
  });

  it("ignores non-source files", async () => {
    await writeFile(join(tmpDir, "photo.png"), "data");
    await writeFile(join(tmpDir, "data.json"), "{}");

    const files = await walkSourceFiles(tmpDir);
    expect(files).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// findBestQuality
// ---------------------------------------------------------------------------

describe("findBestQuality", () => {
  it("returns quality 100 if output already fits", async () => {
    const compressFn = async (q) => Buffer.alloc(100); // always tiny
    const result = await findBestQuality(compressFn, 1000);
    expect(result.quality).toBe(100);
    expect(result.buffer.length).toBe(100);
  });

  it("binary searches to find highest fitting quality", async () => {
    // Simulate: size decreases as quality decreases
    const compressFn = async (q) => Buffer.alloc(q * 100);
    const target = 5000; // quality 50 -> 5000 bytes, quality 51 -> 5100

    const result = await findBestQuality(compressFn, target);
    expect(result.quality).toBe(50);
    expect(result.buffer.length).toBeLessThanOrEqual(target);
  });

  it("returns QUALITY_FLOOR when nothing fits", async () => {
    // Even lowest quality produces too-large output
    const compressFn = async (q) => Buffer.alloc(999999);
    const result = await findBestQuality(compressFn, 100);
    expect(result.quality).toBe(QUALITY_FLOOR);
  });

  it("converges correctly with realistic sharp compression", async () => {
    const raw = Buffer.alloc(200 * 200 * 3);
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 13) & 0xff;
    }
    const inputBuffer = await sharp(raw, {
      raw: { width: 200, height: 200, channels: 3 },
    })
      .jpeg({ quality: 100 })
      .toBuffer();

    const compressFn = async (q) =>
      sharp(inputBuffer).webp({ quality: q }).toBuffer();

    const target = inputBuffer.length;
    const result = await findBestQuality(compressFn, target);

    expect(result.quality).toBeGreaterThanOrEqual(QUALITY_FLOOR);
    expect(result.quality).toBeLessThanOrEqual(100);
    expect(result.buffer.length).toBeLessThanOrEqual(target);
  });

  it("handles quality 100 fitting exactly at target", async () => {
    const compressFn = async (q) => Buffer.alloc(1000);
    const result = await findBestQuality(compressFn, 1000);
    expect(result.quality).toBe(100);
  });

  it("handles monotonically decreasing sizes", async () => {
    const sizes = {};
    for (let q = 30; q <= 100; q++) {
      sizes[q] = q * 50;
    }
    const compressFn = async (q) => Buffer.alloc(sizes[q] || q * 50);
    const target = 3000; // quality 60 = 3000

    const result = await findBestQuality(compressFn, target);
    expect(result.quality).toBe(60);
    expect(result.buffer.length).toBe(3000);
  });
});

// ---------------------------------------------------------------------------
// updateReferences (using real function with custom searchRoot)
// ---------------------------------------------------------------------------

describe("updateReferences", () => {
  let logSpy;

  beforeEach(async () => {
    await makeTmpDir();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
    logSpy.mockRestore();
  });

  it("replaces old filename with new in .md files", async () => {
    await writeFile(
      join(tmpDir, "test.md"),
      'coverImage: "photo.jpg"\nother: stuff'
    );

    const count = await updateReferences("photo.jpg", "photo.webp", tmpDir);

    const result = await readFile(join(tmpDir, "test.md"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("photo.webp");
    expect(result).not.toContain("photo.jpg");
    expect(result).toContain("other: stuff");
  });

  it("replaces references in .astro files", async () => {
    await writeFile(
      join(tmpDir, "Hero.astro"),
      'import heroImg from "../assets/hero.png";\n<Image src={heroImg} />'
    );

    const count = await updateReferences("hero.png", "hero.webp", tmpDir);

    const result = await readFile(join(tmpDir, "Hero.astro"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("hero.webp");
    expect(result).not.toContain("hero.png");
  });

  it("replaces references in .ts files", async () => {
    await writeFile(
      join(tmpDir, "utils.ts"),
      'const img = "banner.jpg";'
    );

    const count = await updateReferences("banner.jpg", "banner.webp", tmpDir);

    const result = await readFile(join(tmpDir, "utils.ts"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("banner.webp");
  });

  it("replaces multiple occurrences in the same file", async () => {
    await writeFile(
      join(tmpDir, "test.md"),
      'image: "hero.png"\ngallery: ["hero.png", "other.jpg"]'
    );

    const count = await updateReferences("hero.png", "hero.webp", tmpDir);

    const result = await readFile(join(tmpDir, "test.md"), "utf-8");
    expect(count).toBe(1); // 1 file updated
    expect(result).not.toContain("hero.png");
    expect(result.match(/hero\.webp/g)).toHaveLength(2);
  });

  it("updates across multiple files in subdirectories", async () => {
    await mkdir(join(tmpDir, "content"), { recursive: true });
    await mkdir(join(tmpDir, "components"), { recursive: true });

    await writeFile(
      join(tmpDir, "content", "post.md"),
      'coverImage: "photo.jpg"'
    );
    await writeFile(
      join(tmpDir, "components", "Gallery.astro"),
      'import photo from "../assets/photo.jpg";'
    );

    const count = await updateReferences("photo.jpg", "photo.webp", tmpDir);
    expect(count).toBe(2);

    const md = await readFile(join(tmpDir, "content", "post.md"), "utf-8");
    const astro = await readFile(join(tmpDir, "components", "Gallery.astro"), "utf-8");
    expect(md).toContain("photo.webp");
    expect(astro).toContain("photo.webp");
  });

  it("does not modify files that don't contain the filename", async () => {
    const original = 'coverImage: "other-image.jpg"';
    await writeFile(join(tmpDir, "unrelated.md"), original);

    const count = await updateReferences("photo.jpg", "photo.webp", tmpDir);

    const result = await readFile(join(tmpDir, "unrelated.md"), "utf-8");
    expect(count).toBe(0);
    expect(result).toBe(original);
  });

  it("does not match partial filenames (prefix collision)", async () => {
    await writeFile(
      join(tmpDir, "test.md"),
      'coverImage: "my-event-1.jpg"'
    );

    const count = await updateReferences("event-1.jpg", "event-1.webp", tmpDir);

    const result = await readFile(join(tmpDir, "test.md"), "utf-8");
    expect(count).toBe(0);
    expect(result).toContain("my-event-1.jpg");
  });

  it("matches exact filename even with similar names in same file", async () => {
    await writeFile(
      join(tmpDir, "test.md"),
      'hero: "my-event-1.jpg"\ncover: "event-1.jpg"'
    );

    const count = await updateReferences("event-1.jpg", "event-1.webp", tmpDir);

    const result = await readFile(join(tmpDir, "test.md"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("my-event-1.jpg"); // untouched
    expect(result).toContain("event-1.webp"); // replaced
  });

  it("matches filename after a slash (import path)", async () => {
    await writeFile(
      join(tmpDir, "page.astro"),
      'import img from "../assets/events/event-1.jpg";'
    );

    const count = await updateReferences("event-1.jpg", "event-1.webp", tmpDir);

    const result = await readFile(join(tmpDir, "page.astro"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("event-1.webp");
  });

  it("matches filename in frontmatter with quotes", async () => {
    await writeFile(
      join(tmpDir, "post.md"),
      '---\ncoverImage: "project-9.png"\n---'
    );

    const count = await updateReferences("project-9.png", "project-9.webp", tmpDir);

    const result = await readFile(join(tmpDir, "post.md"), "utf-8");
    expect(count).toBe(1);
    expect(result).toContain("project-9.webp");
  });

  it("does not touch non-source files like .json or .css", async () => {
    await writeFile(join(tmpDir, "data.json"), '{"image": "photo.jpg"}');
    await writeFile(join(tmpDir, "style.css"), '/* photo.jpg */');

    const count = await updateReferences("photo.jpg", "photo.webp", tmpDir);
    expect(count).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Integration: full optimization flow with real sharp
// ---------------------------------------------------------------------------

describe("integration: optimize oversized image", () => {
  let logSpy;

  beforeEach(async () => {
    await makeTmpDir();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
    logSpy.mockRestore();
  });

  it("compresses a WebP image below target using findBestQuality", async () => {
    const side = 500;
    const raw = Buffer.alloc(side * side * 3);
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 7) & 0xff;
    }
    const inputBuffer = await sharp(raw, {
      raw: { width: side, height: side, channels: 3 },
    })
      .webp({ quality: 100 })
      .toBuffer();

    const smallTarget = Math.floor(inputBuffer.length * 0.5);
    const compressFn = async (q) =>
      sharp(inputBuffer).webp({ quality: q }).toBuffer();

    const result = await findBestQuality(compressFn, smallTarget);

    expect(result.buffer.length).toBeLessThanOrEqual(smallTarget);
    expect(result.quality).toBeLessThan(100);
    expect(result.quality).toBeGreaterThanOrEqual(QUALITY_FLOOR);
  });

  it("converts JPEG to WebP and produces valid WebP output", async () => {
    const side = 300;
    const raw = Buffer.alloc(side * side * 3);
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 11) & 0xff;
    }
    const jpegBuffer = await sharp(raw, {
      raw: { width: side, height: side, channels: 3 },
    })
      .jpeg({ quality: 95 })
      .toBuffer();

    const webpBuffer = await sharp(jpegBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Verify WebP magic bytes: RIFF....WEBP
    expect(webpBuffer.slice(0, 4).toString("ascii")).toBe("RIFF");
    expect(webpBuffer.slice(8, 12).toString("ascii")).toBe("WEBP");
  });

  it("converts PNG with alpha to WebP and produces valid output", async () => {
    const side = 200;
    const raw = Buffer.alloc(side * side * 4); // RGBA
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 3) & 0xff;
    }
    const pngBuffer = await sharp(raw, {
      raw: { width: side, height: side, channels: 4 },
    })
      .png()
      .toBuffer();

    const webpBuffer = await sharp(pngBuffer)
      .webp({ quality: 90 })
      .toBuffer();

    expect(webpBuffer.slice(0, 4).toString("ascii")).toBe("RIFF");
    expect(webpBuffer.slice(8, 12).toString("ascii")).toBe("WEBP");
  });

  it("end-to-end: write oversized file, compress, verify on disk", async () => {
    const imgPath = join(tmpDir, "big.webp");

    const side = 600;
    const raw = Buffer.alloc(side * side * 3);
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 17) & 0xff;
    }
    const bigBuffer = await sharp(raw, {
      raw: { width: side, height: side, channels: 3 },
    })
      .webp({ quality: 100 })
      .toBuffer();

    await writeFile(imgPath, bigBuffer);

    const targetSize = Math.floor(bigBuffer.length * 0.6);
    const inputBuffer = await readFile(imgPath);
    const compressFn = async (q) =>
      sharp(inputBuffer).webp({ quality: q }).toBuffer();

    const result = await findBestQuality(compressFn, targetSize);
    await writeFile(imgPath, result.buffer);

    const info = await stat(imgPath);
    expect(info.size).toBeLessThanOrEqual(targetSize);
    expect(info.size).toBeGreaterThan(0);
  });

  it("end-to-end: JPEG to WebP with reference update", async () => {
    // Set up: a JPEG image and a .md file referencing it
    const assetsDir = join(tmpDir, "assets");
    const contentDir = join(tmpDir, "content");
    await mkdir(assetsDir, { recursive: true });
    await mkdir(contentDir, { recursive: true });

    const side = 200;
    const raw = Buffer.alloc(side * side * 3);
    for (let i = 0; i < raw.length; i++) {
      raw[i] = (i * 7) & 0xff;
    }
    const jpegBuffer = await sharp(raw, {
      raw: { width: side, height: side, channels: 3 },
    })
      .jpeg({ quality: 100 })
      .toBuffer();

    const jpegPath = join(assetsDir, "photo.jpg");
    await writeFile(jpegPath, jpegBuffer);
    await writeFile(
      join(contentDir, "post.md"),
      'coverImage: "photo.jpg"'
    );
    await writeFile(
      join(contentDir, "page.astro"),
      'import img from "../assets/photo.jpg";'
    );

    // Simulate what main() does for a non-webp file
    const inputBuffer = await readFile(jpegPath);
    const compressFn = async (q) =>
      sharp(inputBuffer).webp({ quality: q }).toBuffer();
    const { buffer } = await findBestQuality(compressFn, jpegBuffer.length);

    const { basename: bn, extname: ext } = await import("node:path");
    const newName = bn(jpegPath, ext(jpegPath)) + ".webp";
    const newPath = join(dirname(jpegPath), newName);

    await writeFile(newPath, buffer);
    const refs = await updateReferences("photo.jpg", "photo.webp", tmpDir);
    await (await import("node:fs/promises")).unlink(jpegPath);

    // Verify: .webp exists, .jpg gone, references updated
    expect(await fileExists(newPath)).toBe(true);
    expect(await fileExists(jpegPath)).toBe(false);
    expect(refs).toBe(2);

    const md = await readFile(join(contentDir, "post.md"), "utf-8");
    expect(md).toContain("photo.webp");
    expect(md).not.toContain("photo.jpg");

    const astro = await readFile(join(contentDir, "page.astro"), "utf-8");
    expect(astro).toContain("photo.webp");
    expect(astro).not.toContain("photo.jpg");

    // Verify it's valid WebP
    const webpBuf = await readFile(newPath);
    expect(webpBuf.slice(0, 4).toString("ascii")).toBe("RIFF");
    expect(webpBuf.slice(8, 12).toString("ascii")).toBe("WEBP");
  });
});

// ---------------------------------------------------------------------------
// Constants sanity
// ---------------------------------------------------------------------------

describe("constants", () => {
  it("THRESHOLD and TARGET are sensible", () => {
    expect(THRESHOLD).toBe(10 * 1024 * 1024);
    expect(TARGET).toBe(THRESHOLD - 100 * 1024);
    expect(TARGET).toBeLessThan(THRESHOLD);
    expect(QUALITY_FLOOR).toBe(30);
  });
});
