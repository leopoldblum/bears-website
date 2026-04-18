#!/usr/bin/env node
// Migrate legacy content entries to Keystatic's per-slug asset layout.
//
// Strategy: two phases in one run.
//   1. PLAN — walk every entry, compute its normalized slug, and decide
//      whether the `coverImage`/`logo` file should be moved into
//      src/assets/<col>/<slug>/<basename>. Build an asset move map shared
//      across entries so body rewrites stay consistent.
//   2. EXECUTE — move files, then rewrite each entry:
//        - rename the file (spaces → hyphens, case preserved)
//        - rewrite the frontmatter image path iff the file exists at the
//          planned destination after the move
//        - strip top-of-file MDX `import` statements (Keystatic can't parse
//          them) and rewrite `<Img src={Ident} ... />` to the string-src
//          form that Img.astro accepts — using the move map so imports that
//          matched a moved cover image resolve to the new path.
//
// Body-referenced images that are NOT the cover stay at their original
// asset location; the bare `/src/assets/...` src resolves via Img.astro's
// flat `allAssetImages` glob.
//
// Usage:
//   node scripts/migrate-keystatic.mjs <collection> [--dry]

import { readdir, readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, dirname, posix } from 'node:path';

const DRY = process.argv.includes('--dry');
const COLLECTION = process.argv[2];

if (!COLLECTION) {
  console.error('usage: migrate-keystatic.mjs <collection> [--dry]');
  process.exit(2);
}

// --- Collection wiring ------------------------------------------------------

const CONFIGS = {
  events: {
    contentDirs: ['src/content/events/en', 'src/content/events/de'],
    assetDir: 'src/assets/events',
    imageField: 'coverImage',
  },
  projects: {
    contentDirs: ['src/content/projects/en', 'src/content/projects/de'],
    assetDir: 'src/assets/projects',
    imageField: 'coverImage',
  },
  testimonials: {
    contentDirs: ['src/content/testimonials/en', 'src/content/testimonials/de'],
    assetDir: 'src/assets/testimonials',
    imageField: 'coverImage',
  },
  'faces-of-bears': {
    contentDirs: ['src/content/faces-of-bears/en', 'src/content/faces-of-bears/de'],
    assetDir: 'src/assets/faces-of-bears',
    imageField: 'coverImage',
  },
  sponsors: {
    contentDirs: [
      'src/content/sponsors/diamond',
      'src/content/sponsors/platinum',
      'src/content/sponsors/gold',
      'src/content/sponsors/silver',
      'src/content/sponsors/bronze',
    ],
    assetDirFromEntry: (entryPath) => {
      const tier = entryPath.split('/')[3];
      return `src/assets/sponsors/${tier}`;
    },
    imageField: 'logo',
  },
};

const cfg = CONFIGS[COLLECTION];
if (!cfg) {
  console.error(`Unknown collection: ${COLLECTION}`);
  console.error(`Available: ${Object.keys(CONFIGS).join(', ')}`);
  process.exit(2);
}

// --- Helpers ----------------------------------------------------------------

const log = (msg) => console.log(`${DRY ? '[dry] ' : ''}${msg}`);

function normalizeFilename(name) {
  const ext = extname(name);
  const stem = basename(name, ext);
  return (
    stem.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + ext
  );
}

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function getField(fmText, key) {
  const re = new RegExp(`^${key}:\\s*(.*)$`, 'm');
  const m = fmText.match(re);
  if (!m) return null;
  let val = m[1].trim();
  const q = val[0];
  if ((q === '"' || q === "'") && val[val.length - 1] === q) val = val.slice(1, -1);
  return val;
}

function setField(fmText, key, value) {
  const re = new RegExp(`^(${key}:\\s*).*$`, 'm');
  if (!re.test(fmText)) return fmText;
  const quoted = /[:#@\s]/.test(value) ? `"${value}"` : value;
  return fmText.replace(re, `$1${quoted}`);
}

// --- MDX body transforms ----------------------------------------------------

// Extract top-of-file import statements. Keystatic's MDX parser crashes on
// them, and the component imports are redundant — buildMdxComponents()
// injects them via the editor's `components` prop.
function extractImports(body) {
  const map = {};
  const importRe = /^import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?\s*$/gm;
  const cleaned = body.replace(importRe, (_, ident, src) => {
    map[ident] = src;
    return '';
  });
  return { body: cleaned.replace(/^(\s*\n){2,}/, '\n'), map };
}

// Turn an import specifier into the `/src/assets/...` form. Component
// imports (@mdx/*) return null so the attribute is left untouched.
function resolveImport(spec) {
  if (spec.startsWith('@assets/')) return '/src/assets/' + spec.slice('@assets/'.length);
  if (spec.startsWith('/src/')) return spec;
  return null;
}

// Replace `src={Ident}` with a string src based on the import map. If the
// resolved path was moved (via the shared move map), use the new path.
function rewriteImgExpressions(body, importMap, fileMoves) {
  return body.replace(/src=\{(\w+)\}/g, (match, ident) => {
    const spec = importMap[ident];
    if (!spec) return match;
    const raw = resolveImport(spec);
    if (!raw) return match;
    const moved = fileMoves.get(raw.replace(/^\/+/, ''));
    const finalSrc = moved ? `/${moved}` : raw;
    return `src="${finalSrc}"`;
  });
}

// --- Plan phase -------------------------------------------------------------

async function listEntries() {
  const out = [];
  for (const dir of cfg.contentDirs) {
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      if (!/\.(md|mdx)$/.test(name)) continue;
      out.push({ dir, name });
    }
  }
  return out;
}

function assetDirFor(entry) {
  if (cfg.assetDirFromEntry) return cfg.assetDirFromEntry(posix.join(entry.dir, entry.name));
  return cfg.assetDir;
}

async function planEntry(entry) {
  const entryPath = join(entry.dir, entry.name);
  const newName = normalizeFilename(entry.name);
  const newPath = join(entry.dir, newName);
  const slug = basename(newName, extname(newName));
  const assetDir = assetDirFor(entry);

  const raw = await readFile(entryPath, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) return null;

  const imgRaw = getField(split.fm, cfg.imageField);
  let imgPlan = null;
  if (imgRaw) {
    const targetValue = `/${slug}/${basename(imgRaw.replace(/^\/+/, ''))}`;
    const alreadyDone = imgRaw === targetValue;
    const sourceCandidates = alreadyDone
      ? []
      : [
          join(assetDir, imgRaw.replace(/^\/+/, '')),
          join(assetDir, basename(imgRaw.replace(/^\/+/, ''))),
        ];
    const sourcePath = sourceCandidates.find((p) => existsSync(p)) || null;
    const targetPath = join(assetDir, slug, basename(imgRaw.replace(/^\/+/, '')));
    imgPlan = { imgRaw, sourcePath, targetPath, targetValue, alreadyDone };
  }

  return {
    entryPath,
    newPath,
    slug,
    renameNeeded: entryPath !== newPath,
    original: raw,
    split,
    assetDir,
    imgPlan,
  };
}

// --- Execute phase ----------------------------------------------------------

async function ensureMove(source, target, movedSet) {
  if (!source) return false;
  if (source === target) return false;
  const key = `${source}->${target}`;
  if (movedSet.has(key)) return true;
  if (!existsSync(source)) return false;
  if (existsSync(target)) {
    movedSet.add(key);
    return true;
  }
  log(`  move ${source} -> ${target}`);
  if (!DRY) {
    await mkdir(dirname(target), { recursive: true });
    await rename(source, target);
  }
  movedSet.add(key);
  return true;
}

async function executeEntry(plan, fileMoves) {
  log(`\n-> ${plan.entryPath}  (slug: ${plan.slug})`);

  // Cover move (may be a no-op if another plan already moved the same file)
  let fmText = plan.split.fm;
  if (plan.imgPlan) {
    const { imgRaw, sourcePath, targetPath, targetValue, alreadyDone } = plan.imgPlan;
    if (alreadyDone) {
      log(`  cover already migrated (${imgRaw})`);
    } else if (!sourcePath && !existsSync(targetPath)) {
      log(`  WARN: cover file not found for ${cfg.imageField}="${imgRaw}" — leaving frontmatter as-is`);
    } else {
      // Record move in the shared map so body rewrites can redirect.
      if (sourcePath && sourcePath !== targetPath) {
        const rel = sourcePath;
        fileMoves.set(rel, targetPath);
      }
      fmText = setField(fmText, cfg.imageField, targetValue);
    }
  }

  // Body transforms
  let body = plan.split.body;
  if (plan.entryPath.endsWith('.mdx')) {
    const { body: stripped, map } = extractImports(body);
    body = rewriteImgExpressions(stripped, map, fileMoves);
  }

  const updated = `---\n${fmText}\n---\n${body}`;
  if (!DRY && updated !== plan.original) await writeFile(plan.entryPath, updated);
  if (updated !== plan.original) log(`  wrote ${plan.entryPath}`);

  if (plan.renameNeeded) {
    if (existsSync(plan.newPath) && plan.newPath !== plan.entryPath) {
      log(`  WARN: rename target exists: ${plan.newPath}`);
    } else if (!DRY) {
      await rename(plan.entryPath, plan.newPath);
      log(`  renamed -> ${plan.newPath}`);
    } else {
      log(`  would rename -> ${plan.newPath}`);
    }
  }
}

// --- Main -------------------------------------------------------------------

const entries = await listEntries();
log(`Found ${entries.length} entries in ${COLLECTION}`);

const plans = [];
for (const e of entries) {
  const p = await planEntry(e);
  if (p) plans.push(p);
}

// First: do all image moves so the move map is complete before any entry is
// rewritten. That way, any body `src={Ident}` referencing a moved cover in a
// sibling entry will be rewritten to the new path.
const fileMoves = new Map(); // oldAbsPath -> newAbsPath
const doneMoves = new Set();
for (const p of plans) {
  if (!p.imgPlan) continue;
  const { sourcePath, targetPath, alreadyDone } = p.imgPlan;
  if (alreadyDone) continue;
  const moved = await ensureMove(sourcePath, targetPath, doneMoves);
  if (moved && sourcePath) fileMoves.set(sourcePath, targetPath);
}

// Second: rewrite entries using the complete move map.
for (const p of plans) {
  try {
    await executeEntry(p, fileMoves);
  } catch (err) {
    console.error(`FAILED ${p.entryPath}:`, err);
    process.exit(1);
  }
}

log(`\nDone.${DRY ? ' (dry run)' : ''}`);
