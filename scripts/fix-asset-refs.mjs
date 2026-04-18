#!/usr/bin/env node
// Walks every .md / .mdx file under src/content/ and fixes `<Img src="/src/assets/...">`
// references that no longer resolve (e.g. because the migration moved an
// asset into a per-slug subfolder). For each broken src, we look up the
// filename under its asset tree; if exactly one match is found, we rewrite
// the src to the new location. Ambiguous or missing matches are reported
// so they can be fixed by hand.
//
// Usage: node scripts/fix-asset-refs.mjs [--dry]

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename, relative } from 'node:path';

const DRY = process.argv.includes('--dry');

const CONTENT = 'src/content';
const ASSETS = 'src/assets';

async function walk(dir, out = []) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    const st = await stat(p);
    if (st.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

async function findByBasename(root, wanted) {
  const hits = [];
  for (const p of await walk(root)) {
    if (basename(p) === wanted) hits.push(p);
  }
  return hits;
}

const contentFiles = (await walk(CONTENT)).filter((f) => /\.mdx?$/.test(f));

let fixed = 0;
let ambiguous = 0;
let missing = 0;

for (const file of contentFiles) {
  const original = await readFile(file, 'utf8');
  let changed = original;
  const re = /src="(\/src\/assets\/[^"]+)"/g;
  const matches = [...original.matchAll(re)];
  for (const m of matches) {
    const href = m[1];
    const onDisk = href.slice(1);
    if (existsSync(onDisk)) continue;
    const name = basename(href);
    const bucket = href.split('/')[3];
    const hits = await findByBasename(join(ASSETS, bucket), name);
    if (hits.length === 1) {
      const newHref = '/' + hits[0];
      changed = changed.replaceAll(`src="${href}"`, `src="${newHref}"`);
      console.log(`  ${relative('.', file)}: ${href} → ${newHref}`);
      fixed++;
    } else if (hits.length > 1) {
      console.log(`  AMBIGUOUS ${relative('.', file)}: ${href} — candidates: ${hits.map((h) => '/' + h).join(', ')}`);
      ambiguous++;
    } else {
      console.log(`  MISSING ${relative('.', file)}: ${href} — no file named ${name} anywhere under ${ASSETS}/${bucket}`);
      missing++;
    }
  }
  if (changed !== original && !DRY) await writeFile(file, changed);
}

console.log(`\nFixed: ${fixed}  Ambiguous: ${ambiguous}  Missing: ${missing}${DRY ? '  (dry run)' : ''}`);
