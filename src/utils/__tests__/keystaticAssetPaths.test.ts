/**
 * Keystatic Asset Path Tests
 *
 * Every `fields.image` / `fields.file` in keystatic.config.ts must pair its
 * `directory` with a compatible `publicPath`, otherwise the Keystatic admin
 * UI can't preview uploads and the stored value won't resolve on the public
 * site. The rules live in CLAUDE.md under "fields.image publicPath":
 *
 *   - Per-entry uploads (inside a collection) → `publicPath: ''` + directory
 *     under `src/assets/` → stored value like `/<slug>/<filename>`.
 *   - Shared singleton assets under `src/assets/<dir>/` → stored value like
 *     `/src/assets/<dir>/<filename>` (so the admin preview and Astro's Vite
 *     dev server resolve the same URL).
 *   - Public assets (`directory: 'public'`) → stored value like `/<filename>`
 *     (served at the site root, not through Astro's asset pipeline).
 *
 * Drift here is silent: the admin UI shows a broken preview only when an
 * editor actually opens the affected form. These tests probe every asset
 * field by calling its `serialize()` with a fake upload and asserting the
 * resulting stored value matches the rule for its location.
 */

import { describe, it, expect } from 'vitest';
import { fields } from '@keystatic/core';
import keystaticConfig from '../../../keystatic.config';

type AnyField = {
  kind: string;
  formKind?: string;
  fields?: Record<string, AnyField>;
  element?: AnyField;
  values?: Record<string, AnyField>;
  directory?: string;
  serialize?: (value: unknown, extra: { suggestedFilenamePrefix: string | undefined; slug: string | undefined }) => { value: string | null };
};

type OwnerKind = 'collection' | 'singleton';

interface AssetLocation {
  ownerKind: OwnerKind;
  ownerName: string;
  path: string;
  field: AnyField;
}

function walk(field: AnyField, path: string, out: AssetLocation[], owner: { kind: OwnerKind; name: string }) {
  if (field.kind === 'form' && field.formKind === 'asset') {
    out.push({ ownerKind: owner.kind, ownerName: owner.name, path, field });
    return;
  }
  if (field.kind === 'object' && field.fields) {
    for (const [k, child] of Object.entries(field.fields)) walk(child, path ? `${path}.${k}` : k, out, owner);
    return;
  }
  if (field.kind === 'array' && field.element) {
    walk(field.element, `${path}[]`, out, owner);
    return;
  }
  if (field.kind === 'conditional' && field.values) {
    for (const [k, child] of Object.entries(field.values)) walk(child, `${path}?${k}`, out, owner);
    return;
  }
}

function collectAssetFields(): AssetLocation[] {
  const out: AssetLocation[] = [];
  for (const [name, col] of Object.entries(keystaticConfig.collections ?? {})) {
    const schema = (col as { schema: Record<string, AnyField> }).schema;
    for (const [k, f] of Object.entries(schema)) walk(f, k, out, { kind: 'collection', name });
  }
  for (const [name, sg] of Object.entries(keystaticConfig.singletons ?? {})) {
    const schema = (sg as { schema: Record<string, AnyField> }).schema;
    for (const [k, f] of Object.entries(schema)) walk(f, k, out, { kind: 'singleton', name });
  }
  return out;
}

// Singletons have no slug; collections do. Passing the wrong value changes
// Keystatic's asset-path logic, so the probe mirrors what the admin UI passes
// for each owner kind.
function serializeProbe(field: AnyField, ownerKind: OwnerKind): string {
  const fake = { data: new Uint8Array([1, 2, 3]), extension: 'png', filename: 'probe.png' };
  const slug = ownerKind === 'collection' ? 'test-slug' : undefined;
  const out = field.serialize!(fake, { suggestedFilenamePrefix: 'probe', slug });
  if (out.value === null) throw new Error('serialize returned null');
  return out.value;
}

// Returns null if the field is configured correctly, or a human-readable
// reason string if it violates a CLAUDE.md rule. Pulled out so the teeth-check
// test below can exercise it against synthetic broken configs.
function describeAssetPathViolation(loc: Pick<AssetLocation, 'ownerKind' | 'field'>, stored: string): string | null {
  const dir = loc.field.directory ?? '';

  if (!stored.startsWith('/')) return `stored value "${stored}" must start with "/"`;
  if (stored.startsWith('/undefined') || stored.includes('/undefined/')) {
    return `stored value "${stored}" contains "undefined" — publicPath/slug mismatch`;
  }

  if (dir === 'public') {
    if (stored.startsWith('/src/')) return `directory is "public" but stored value "${stored}" starts with "/src/"; use publicAssetField()`;
    if (stored.startsWith('/test-slug/')) return `directory is "public" but stored value "${stored}" uses per-entry subfolder pattern`;
    if (stored.split('/').length !== 2) return `directory is "public" but stored value "${stored}" has a nested subfolder — expected "/<filename>"`;
    return null;
  }

  if (dir.startsWith('src/assets/')) {
    const expectedAbsPrefix = `/${dir}/`;
    if (loc.ownerKind === 'collection') {
      if (!stored.startsWith('/test-slug/')) {
        return `collection asset under "${dir}" should use per-entry pattern (publicPath: '') giving "/<slug>/<filename>". Got "${stored}". Use imageField() helper.`;
      }
      return null;
    }
    // Singleton
    if (!stored.startsWith(expectedAbsPrefix)) {
      return `singleton asset under "${dir}" must store "${expectedAbsPrefix}<filename>" so admin previews resolve. Got "${stored}". Use brandingAssetField(label, '${dir}') or set publicPath: '${expectedAbsPrefix}'.`;
    }
    return null;
  }

  return `directory "${dir}" is neither "public" nor under "src/assets/". Update the rules in this test (and CLAUDE.md) if a new asset root is intentional.`;
}

const assetFields = collectAssetFields();

describe('Keystatic asset paths (directory + publicPath)', () => {
  it('finds at least one asset field (sanity — schema walker is working)', () => {
    expect(assetFields.length).toBeGreaterThan(5);
  });

  // One `it` per field so a regression pinpoints the exact owner/path instead
  // of one opaque failure for the whole suite.
  for (const loc of assetFields) {
    const label = `${loc.ownerKind} "${loc.ownerName}" field "${loc.path}"`;
    it(`${label} — directory/publicPath pairing matches CLAUDE.md rules`, () => {
      const stored = serializeProbe(loc.field, loc.ownerKind);
      const violation = describeAssetPathViolation(loc, stored);
      expect(violation, `${label}: ${violation}`).toBeNull();
    });
  }
});

// ---------------------------------------------------------------------------
// Teeth check — verifies describeAssetPathViolation catches the bugs we care
// about. Without this, a refactor could silently weaken the validator and the
// real tests would keep passing on a still-correct config.
// ---------------------------------------------------------------------------

describe('describeAssetPathViolation rejects known broken configs', () => {
  const cases: { name: string; owner: OwnerKind; field: AnyField; expect: RegExp }[] = [
    {
      name: 'singleton with empty publicPath under src/assets/',
      owner: 'singleton',
      field: fields.image({ label: 'x', directory: 'src/assets/foo', publicPath: '' }) as AnyField,
      expect: /singleton asset under "src\/assets\/foo"/,
    },
    {
      name: 'singleton with wrong absolute publicPath',
      owner: 'singleton',
      field: fields.image({ label: 'x', directory: 'src/assets/foo', publicPath: '/wrong/' }) as AnyField,
      expect: /singleton asset under "src\/assets\/foo"/,
    },
    {
      name: 'collection with absolute publicPath (would collide across entries)',
      owner: 'collection',
      field: fields.image({ label: 'x', directory: 'src/assets/foo', publicPath: '/src/assets/foo/' }) as AnyField,
      expect: /per-entry pattern/,
    },
    {
      name: 'public dir with /src/ publicPath',
      owner: 'singleton',
      field: fields.image({ label: 'x', directory: 'public', publicPath: '/src/' }) as AnyField,
      expect: /directory is "public"/,
    },
    {
      name: 'unknown directory root',
      owner: 'singleton',
      field: fields.image({ label: 'x', directory: 'weird-root', publicPath: '/weird-root/' }) as AnyField,
      expect: /neither "public" nor under "src\/assets\/"/,
    },
  ];

  for (const c of cases) {
    it(`rejects: ${c.name}`, () => {
      const stored = serializeProbe(c.field, c.owner);
      const violation = describeAssetPathViolation({ ownerKind: c.owner, field: c.field }, stored);
      expect(violation).not.toBeNull();
      expect(violation!).toMatch(c.expect);
    });
  }

  it('accepts: correct singleton under src/assets/', () => {
    const f = fields.image({ label: 'x', directory: 'src/assets/foo', publicPath: '/src/assets/foo/' }) as AnyField;
    const stored = serializeProbe(f, 'singleton');
    expect(describeAssetPathViolation({ ownerKind: 'singleton', field: f }, stored)).toBeNull();
  });

  it('accepts: correct per-entry collection', () => {
    const f = fields.image({ label: 'x', directory: 'src/assets/foo', publicPath: '' }) as AnyField;
    const stored = serializeProbe(f, 'collection');
    expect(describeAssetPathViolation({ ownerKind: 'collection', field: f }, stored)).toBeNull();
  });

  it('accepts: correct public asset', () => {
    const f = fields.image({ label: 'x', directory: 'public', publicPath: '/' }) as AnyField;
    const stored = serializeProbe(f, 'singleton');
    expect(describeAssetPathViolation({ ownerKind: 'singleton', field: f }, stored)).toBeNull();
  });
});
