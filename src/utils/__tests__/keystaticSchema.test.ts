/**
 * Keystatic Schema Tests
 *
 * The sibling suite `contentValidation.test.ts` checks every content file
 * against the Astro Zod schemas in src/content/config.ts. That catches
 * mistakes on the *Astro* side — but Keystatic has its own parallel schema
 * in keystatic.config.ts, with no shared type, so the two can silently drift.
 *
 * When they drift, nothing breaks until someone opens the Keystatic admin UI
 * and an entry fails to load. These tests close that loop by running every
 * content file through Keystatic's Reader API — the same code path the admin
 * UI uses to parse entries — so drift is caught at test time.
 *
 * Reader API docs: https://keystatic.com/docs/reader-api
 *
 * Run with: npm test
 */

import { describe, it, expect } from 'vitest';
import { createReader } from '@keystatic/core/reader';
import { join } from 'path';
import keystaticConfig from '../../../keystatic.config';
import { collections as astroCollections } from '../../content/config';

const ROOT = join(__dirname, '..', '..', '..');

// ---------------------------------------------------------------------------
// Group 1 — Config loads
// ---------------------------------------------------------------------------

describe('keystatic.config.ts', () => {
  it('loads and exports collections', () => {
    expect(keystaticConfig).toBeDefined();
    expect(keystaticConfig.collections).toBeDefined();
    const names = Object.keys(keystaticConfig.collections ?? {});
    expect(names.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Group 2 — Reader API resolves every entry
//
// For each Keystatic collection, list every slug on disk and read it back
// through the Reader API with resolveLinkedFiles so MDX bodies are parsed.
// A null return means the file exists but doesn't satisfy Keystatic's schema
// — exactly the regression we want to catch before an editor sees it.
// ---------------------------------------------------------------------------

type CollectionName = keyof typeof keystaticConfig.collections;

describe('Keystatic Reader API resolves every collection', () => {
  const reader = createReader(ROOT, keystaticConfig);
  const collectionNames = Object.keys(keystaticConfig.collections ?? {}) as CollectionName[];

  for (const name of collectionNames) {
    it(`"${String(name)}" — all entries load`, async () => {
      const collection = reader.collections[name];
      const slugs = await collection.list();

      const failures: string[] = [];
      for (const slug of slugs) {
        try {
          const entry = await collection.read(slug, { resolveLinkedFiles: true });
          if (entry === null) {
            failures.push(`  - "${slug}" — Keystatic could not parse the file against its schema (returned null)`);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          failures.push(`  - "${slug}" — threw: ${msg}`);
        }
      }

      if (failures.length > 0) {
        const entryWord = failures.length === 1 ? 'entry' : 'entries';
        throw new Error(
          `Keystatic collection "${String(name)}" has ${failures.length} broken ${entryWord}:\n${failures.join('\n')}\n` +
          `\nFix hint: check that the frontmatter matches the fields defined in keystatic.config.ts for this collection, ` +
          `and that any referenced images exist under the collection's asset directory.`
        );
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Group 3 — Astro ↔ Keystatic parity smoke check
//
// For every Astro collection, at least one Keystatic collection must write
// into the corresponding src/content/<name>/ folder. This catches the
// "renamed Keystatic collection but forgot to update Astro schema" class of
// bug. Shallow on purpose — field-by-field parity isn't tractable because
// Zod and Keystatic use different primitives.
// ---------------------------------------------------------------------------

describe('Astro ↔ Keystatic collection parity', () => {
  const keystaticCollections = (keystaticConfig.collections ?? {}) as Record<string, { path: string }>;
  const keystaticSingletons = (keystaticConfig.singletons ?? {}) as Record<string, { path: string }>;
  const keystaticPaths = [
    ...Object.values(keystaticCollections).map((c) => c.path),
    ...Object.values(keystaticSingletons).map((s) => s.path),
  ];

  for (const astroName of Object.keys(astroCollections)) {
    it(`Astro collection "${astroName}" is backed by at least one Keystatic collection or singleton`, () => {
      const expectedPrefix = `src/content/${astroName}/`;
      const match = keystaticPaths.some((p) => p.startsWith(expectedPrefix));
      expect(
        match,
        `No Keystatic collection or singleton in keystatic.config.ts writes to ${expectedPrefix}. ` +
        `Either add one, or remove "${astroName}" from src/content/config.ts.`
      ).toBe(true);
    });
  }
});
