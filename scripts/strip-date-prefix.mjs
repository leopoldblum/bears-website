#!/usr/bin/env node
// Strip the legacy `YYYY-MM-DD-` prefix from events and projects filenames so
// they match the clean slug shape Keystatic will generate for new entries
// (derived from `title`, no date). Chronological sorting has been driven by
// the `date` frontmatter field for a while, so the prefix is cosmetic debt.
//
// For each entry matching /^\d{4}-\d{2}-\d{2}-(.+)\.(md|mdx)$/:
//   1. Rename  src/content/<col>/<locale>/<old>.<ext>  →  <new>.<ext>
//   2. Rename  src/assets/<col>/<old>/                 →  <col>/<new>/
//      (shared between locales — dedupe before moving)
//   3. Rewrite the frontmatter image path to reference the new slug folder.
//   4. Rewrite any body `<Img src="/src/assets/<col>/<old>/...">` to `<new>`.
//
// Usage:
//   node scripts/strip-date-prefix.mjs            # dry run
//   node scripts/strip-date-prefix.mjs --apply    # execute

import { readdir, readFile, writeFile, rename, stat, mkdir, rmdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, extname, dirname } from 'node:path';

const APPLY = process.argv.includes('--apply');
const log = (msg) => console.log(msg);

const COLLECTIONS = [
  { contentDirs: ['src/content/events/en', 'src/content/events/de'],       assetDir: 'src/assets/events'   },
  { contentDirs: ['src/content/projects/en', 'src/content/projects/de'],   assetDir: 'src/assets/projects' },
];

const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

function splitFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const plans = [];

for (const { contentDirs, assetDir } of COLLECTIONS) {
  for (const dir of contentDirs) {
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      const st = await stat(join(dir, name));
      if (!st.isFile()) continue;
      const ext = extname(name);
      if (ext !== '.md' && ext !== '.mdx') continue;
      const stem = basename(name, ext);
      const m = stem.match(DATE_PREFIX);
      if (!m) continue;
      const newStem = m[4];
      plans.push({
        entryPath: join(dir, name),
        newPath: join(dir, newStem + ext),
        oldSlug: stem,
        newSlug: newStem,
        assetDir,
      });
    }
  }
}

if (plans.length === 0) {
  log('Nothing to rename.');
  process.exit(0);
}

log(`${APPLY ? 'APPLY' : 'DRY RUN'}: ${plans.length} entries will have their date prefix stripped\n`);

// 1. Rewrite frontmatter + body for every plan. Doing all rewrites before any
//    file rename keeps the on-disk paths we read from stable.
for (const p of plans) {
  const raw = await readFile(p.entryPath, 'utf8');
  const split = splitFrontmatter(raw);
  if (!split) { log(`  SKIP ${p.entryPath}: no frontmatter`); continue; }

  let fm = split.fm;
  // coverImage: /<oldSlug>/foo.jpg → /<newSlug>/foo.jpg
  fm = fm.replace(
    new RegExp(`(coverImage:\\s*"?)/?${escapeRegExp(p.oldSlug)}(/)`, 'g'),
    `$1/${p.newSlug}$2`,
  );

  // Body `<Img src="/src/assets/<col>/<oldSlug>/...">`
  const body = split.body.replace(
    new RegExp(`("/${escapeRegExp(p.assetDir)}/)${escapeRegExp(p.oldSlug)}(/)`, 'g'),
    `$1${p.newSlug}$2`,
  );

  const updated = `---\n${fm}\n---\n${body}`;
  if (updated !== raw) {
    if (APPLY) await writeFile(p.entryPath, updated);
    log(`  rewrote ${p.entryPath}`);
  }
}

// 2. Move assets into the un-prefixed subfolder. EN + DE share one folder,
//    so dedupe. If the target already exists (e.g. legacy body-referenced
//    assets live there), merge file-by-file instead of failing.
const seen = new Set();
for (const p of plans) {
  const key = `${p.assetDir}/${p.oldSlug}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const from = join(p.assetDir, p.oldSlug);
  const to = join(p.assetDir, p.newSlug);
  if (!existsSync(from)) continue;
  if (!existsSync(to)) {
    if (APPLY) await rename(from, to);
    log(`  assets ${from} → ${to}`);
    continue;
  }
  log(`  merging ${from}/ into existing ${to}/`);
  for (const name of await readdir(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    if (existsSync(dst)) {
      log(`    SKIP ${name}: already exists in target`);
      continue;
    }
    if (APPLY) {
      await mkdir(dirname(dst), { recursive: true });
      await rename(src, dst);
    }
    log(`    ${src} → ${dst}`);
  }
  // Remove the now-empty source dir if we drained it.
  if (APPLY) {
    try { await rmdir(from); log(`    removed empty ${from}`); } catch {}
  }
}

// 3. Rename entry files
for (const p of plans) {
  if (existsSync(p.newPath)) { log(`  SKIP (target exists) ${p.entryPath} → ${p.newPath}`); continue; }
  if (APPLY) await rename(p.entryPath, p.newPath);
  log(`  entry  ${p.entryPath} → ${p.newPath}`);
}

log(`\n${APPLY ? 'Done.' : 'Dry run complete. Re-run with --apply to execute.'}`);
