#!/usr/bin/env node
// Rename every content entry to the slug Keystatic would generate for it
// from the scratch. Derives the new slug by running @sindresorhus/slugify
// over the entry's `slugField` frontmatter value (title / name / alt / …),
// then moves:
//   1. The entry file           <dir>/<old>.<ext>    → <dir>/<new>.<ext>
//   2. The per-entry asset dir  assets/<col>/<old>/  → assets/<col>/<new>/
//   3. The frontmatter image    /<old>/foo.jpg       → /<new>/foo.jpg
//   4. Any body `<Img src>`     /src/assets/<col>/<old>/...  → /.../<new>/...
//
// After the dry run prints the plan, pass `--apply` to execute.
//
// Scope:
//   node scripts/rename-to-title-slug.mjs <collection> [--apply]
// where <collection> ∈ events | projects | testimonials | faces-of-bears
//                     | sponsors | hero-slides | docs | all

import { readdir, readFile, writeFile, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, relative, posix } from 'node:path';
import slugifyDefault from '@sindresorhus/slugify';

const slugify = slugifyDefault.default ?? slugifyDefault;

const APPLY = process.argv.includes('--apply');
const COLLECTION = process.argv[2];

if (!COLLECTION) {
  console.error('usage: rename-to-title-slug.mjs <collection|all> [--apply]');
  process.exit(2);
}

// --- Collection wiring ------------------------------------------------------

const CONFIGS = {
  events: {
    contentDirs: ['src/content/events/en', 'src/content/events/de'],
    assetDir: 'src/assets/events',
    slugField: 'title',
    imageField: 'coverImage',
  },
  projects: {
    contentDirs: ['src/content/projects/en', 'src/content/projects/de'],
    assetDir: 'src/assets/projects',
    slugField: 'title',
    imageField: 'coverImage',
  },
  testimonials: {
    contentDirs: ['src/content/testimonials/en', 'src/content/testimonials/de'],
    assetDir: 'src/assets/testimonials',
    slugField: 'name',
    imageField: 'coverImage',
  },
  'faces-of-bears': {
    contentDirs: ['src/content/faces-of-bears/en', 'src/content/faces-of-bears/de'],
    assetDir: 'src/assets/faces-of-bears',
    slugField: 'name',
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
    slugField: 'name',
    imageField: 'logo',
  },
  'hero-slides': {
    contentDirs: ['src/content/hero-slides'],
    assetDir: 'src/assets/hero/landingpage',
    slugField: 'alt',
    imageField: null, // media field is a file, not an image; stays in the flat dir
  },
  docs: {
    contentDirs: ['src/content/docs/guides', 'src/content/docs/dev'],
    assetDir: null,
    slugField: 'title',
    imageField: null,
  },
};

function resolveCollections(name) {
  if (name === 'all') return Object.keys(CONFIGS);
  if (!CONFIGS[name]) {
    console.error(`Unknown collection: ${name}. Available: ${Object.keys(CONFIGS).join(', ')}, all`);
    process.exit(2);
  }
  return [name];
}

// --- Helpers ----------------------------------------------------------------

const log = (msg) => console.log(msg);

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

// --- Plan phase -------------------------------------------------------------

async function listEntries(cfg) {
  const out = [];
  for (const dir of cfg.contentDirs) {
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      const full = join(dir, name);
      const st = await stat(full);
      if (!st.isFile()) continue;
      if (!/\.(md|mdx)$/.test(name)) continue;
      out.push({ dir, name });
    }
  }
  return out;
}

function assetDirFor(cfg, entry) {
  if (cfg.assetDirFromEntry) return cfg.assetDirFromEntry(posix.join(entry.dir, entry.name));
  return cfg.assetDir;
}

async function buildPlan(collectionName) {
  const cfg = CONFIGS[collectionName];
  const entries = await listEntries(cfg);
  const plans = [];

  for (const entry of entries) {
    const entryPath = join(entry.dir, entry.name);
    const raw = await readFile(entryPath, 'utf8');
    const split = splitFrontmatter(raw);
    if (!split) continue;

    const slugSource = getField(split.fm, cfg.slugField);
    if (!slugSource) {
      log(`  SKIP ${entryPath}: no "${cfg.slugField}" field`);
      continue;
    }

    const oldSlug = basename(entry.name, extname(entry.name));
    const newSlug = slugify(slugSource);
    if (!newSlug) {
      log(`  SKIP ${entryPath}: slugify("${slugSource}") → empty`);
      continue;
    }

    plans.push({
      collectionName,
      entry,
      entryPath,
      oldSlug,
      newSlug,
      newName: newSlug + extname(entry.name),
      assetDir: assetDirFor(cfg, entry),
      imageField: cfg.imageField,
      original: raw,
      split,
    });
  }
  return plans;
}

// --- Collision detection ----------------------------------------------------

function detectCollisions(plans) {
  const bySlug = new Map();
  for (const p of plans) {
    const key = `${p.entry.dir}::${p.newSlug}`;
    if (!bySlug.has(key)) bySlug.set(key, []);
    bySlug.get(key).push(p);
  }
  const collisions = [];
  for (const [key, group] of bySlug) {
    if (group.length > 1) collisions.push({ key, group });
  }
  return collisions;
}

// --- Execute phase ----------------------------------------------------------

async function execute(plans) {
  // 1. Rewrite frontmatter + body for every plan (uses old paths to find
  //    content; writes new paths). Done before any file moves so content is
  //    already pointing at the new layout when we start renaming.
  const allSlugMoves = []; // { assetDir, oldSlug, newSlug }
  for (const p of plans) {
    if (p.oldSlug === p.newSlug) continue;
    let fmText = p.split.fm;

    // Update frontmatter image path if it embeds the old slug
    if (p.imageField) {
      const img = getField(fmText, p.imageField);
      if (img) {
        const patched = img.replace(
          new RegExp(`^/?${escapeRegExp(p.oldSlug)}(/|$)`),
          `/${p.newSlug}$1`,
        );
        if (patched !== img) fmText = setField(fmText, p.imageField, patched);
      }
    }

    // Update body `<Img src="/src/assets/<col>/<oldSlug>/…">` references
    let body = p.split.body;
    const bodyRe = new RegExp(
      `("${escapeRegExp('/' + p.assetDir)}/)${escapeRegExp(p.oldSlug)}(/)`,
      'g',
    );
    body = body.replace(bodyRe, (_, prefix, suffix) => `${prefix}${p.newSlug}${suffix}`);

    const updated = `---\n${fmText}\n---\n${body}`;
    if (updated !== p.original) {
      if (APPLY) await writeFile(p.entryPath, updated);
      log(`  rewrote ${p.entryPath}`);
    }

    // Schedule the asset subfolder rename
    if (p.assetDir) {
      allSlugMoves.push({ assetDir: p.assetDir, oldSlug: p.oldSlug, newSlug: p.newSlug });
    }
  }

  // 2. Rename per-entry asset subfolders. Dedupe because EN + DE share one.
  const seenMoves = new Set();
  for (const mv of allSlugMoves) {
    const key = `${mv.assetDir}/${mv.oldSlug}->${mv.newSlug}`;
    if (seenMoves.has(key)) continue;
    seenMoves.add(key);
    const from = join(mv.assetDir, mv.oldSlug);
    const to = join(mv.assetDir, mv.newSlug);
    if (!existsSync(from)) continue;
    if (existsSync(to)) {
      log(`  SKIP (target exists) ${from} → ${to}`);
      continue;
    }
    if (APPLY) await rename(from, to);
    log(`  assets ${from} → ${to}`);
  }

  // 3. Rename entry files
  for (const p of plans) {
    if (p.oldSlug === p.newSlug) continue;
    const newPath = join(p.entry.dir, p.newName);
    if (existsSync(newPath)) {
      log(`  SKIP (target exists) ${p.entryPath} → ${newPath}`);
      continue;
    }
    if (APPLY) await rename(p.entryPath, newPath);
    log(`  entry  ${p.entryPath} → ${newPath}`);
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Main -------------------------------------------------------------------

const collectionsToRun = resolveCollections(COLLECTION);
const mode = APPLY ? 'APPLY' : 'DRY RUN';
log(`== ${mode} ==\n`);

let totalRenames = 0;

for (const cn of collectionsToRun) {
  log(`# ${cn}`);
  const plans = await buildPlan(cn);
  const collisions = detectCollisions(plans);
  if (collisions.length) {
    log(`  ⚠️  ${collisions.length} slug collision(s):`);
    for (const c of collisions) {
      log(`    - ${c.key}:`);
      for (const p of c.group) log(`        ${p.entryPath}`);
    }
    log(`  Aborting collection (resolve by editing the slugField source).`);
    log('');
    continue;
  }
  const changes = plans.filter((p) => p.oldSlug !== p.newSlug);
  if (changes.length === 0) {
    log(`  (no renames needed)`);
    log('');
    continue;
  }
  for (const p of changes) {
    log(`  ${p.oldSlug} → ${p.newSlug}`);
  }
  log('');
  await execute(plans);
  totalRenames += changes.length;
  log('');
}

log(`\n${mode} complete. ${totalRenames} entries ${APPLY ? 'renamed' : 'would be renamed'}.`);
if (!APPLY && totalRenames > 0) log(`Re-run with --apply to execute.`);
