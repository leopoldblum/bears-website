# Consolidate to single Cloudflare Worker deploy

## Context

Today the repo ships two separate deploys:

- **Public site** (`bears-space.de`) — `npm run build`, static, GitHub Pages
- **Admin** (`admin.bears-space.de`) — `npm run build:admin` with `ADMIN_BUILD=true` → `output: 'server'` + `@astrojs/cloudflare` adapter + `keystatic()` integration, Cloudflare Pages

The split exists because Keystatic's `/keystatic` and `/api/keystatic/[...]` routes need SSR for OAuth and the GitHub commit handler. The downside: two build pipelines, two domains, two DNS setups, a separate GitHub App callback, and the public site is locked into GitHub Pages.

**Goal:** one Cloudflare Worker (Workers + Static Assets), one domain (`bears-space.de`), serving the prerendered public pages from the assets binding while the same Worker SSRs only the Keystatic routes.

**Why this works in Astro 5:** the old `output: 'hybrid'` collapsed into `output: 'static'` with per-route opt-outs. `@keystatic/astro`'s `injectRoute()` calls already pass `prerender: false` on both Keystatic routes — verified in `node_modules/@keystatic/astro/dist/keystatic-astro.js` lines 39–52 — so they stay SSR even with a global static output. No other pages use SSR (`src/pages/admin.astro:5` is `prerender = true`, no `src/pages/api/`).

## Code changes

### 1. `astro.config.mjs`
Drop the `ADMIN_BUILD` branch entirely. Always use the Cloudflare adapter, always include the Keystatic integration, always point at the public domain.

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://bears-space.de',
  output: 'static',
  adapter: cloudflare(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
  integrations: [
    alpinejs(),
    mdx(),
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/docs/') &&
        !page.includes('/keystatic') &&
        !page.includes('/admin'),
    }),
    keystatic(),
  ],
});
```

### 2. `package.json`
Drop the dual-build scripts; the single `build` already runs vitest + `astro build` + pagefind, which is what we want.

- Remove `build:admin` and `dev:admin` scripts.
- Remove `cross-env` from `devDependencies` (only those two scripts use it — confirm via grep before deleting).

### 3. `wrangler.jsonc`
The current file is shaped for Workers + Static Assets but missing the worker entry. The `@astrojs/cloudflare` adapter emits `dist/_worker.js/index.js`. Update to:

```jsonc
{
  "name": "bears-website",
  "main": "./dist/_worker.js/index.js",
  "compatibility_date": "2026-02-09",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  }
}
```

Secrets (`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`) stay out of the file — set them in the Cloudflare dashboard or via `wrangler secret put`.

### 4. `keystatic.config.ts`
Storage logic itself (`NODE_ENV === 'production'` → `github`, else `local`) is correct as-is. Update only the comment block at lines 4–12 to drop the `ADMIN_BUILD` and `admin.bears-space.de` references — the new prod target is the unified Worker on `bears-space.de`.

### 5. `src/pages/admin.astro`
- Drop the `ADMIN_BUILD` import gate (line 7) and the conditional fallback section (lines 156–164 — the "only available on the admin site" message that links to `https://admin.bears-space.de/admin`). The page can render unconditionally now; `robots.txt` already disallows `/admin/`.

### 6. `.gitignore`
Add `.wrangler/` (currently untracked, should never be committed). The stray `nul` file in repo root is a 0-byte Windows artifact — delete rather than ignore.

### 7. Documentation
Update references to the dual-deploy world:

- `CLAUDE.md` — rewrite the "Dual deploy" section as "Single Cloudflare Worker deploy" and update the "Keystatic external setup" steps (drop step 2's separate Pages project; merge into one Worker setup).
- `src/content/docs/dev/*.mdx` — grep for `ADMIN_BUILD`, `build:admin`, `dev:admin`, `admin.bears-space.de`, and update each hit.

## External / manual steps (not code, but required for the cut-over)

1. **Cloudflare Worker** — either rename/repurpose the existing `admin.bears-space.de` Pages project as a Worker, or create a fresh Worker. Build command: `npm run build`. Set the three Keystatic secrets.
2. **DNS** — repoint `bears-space.de` from GitHub Pages to the Worker; remove the `admin.bears-space.de` record once cut over.
3. **GitHub Pages** — disable in the repo's Pages settings tab.
4. **GitHub App** — update the Keystatic GitHub App's homepage URL and OAuth callback from `admin.bears-space.de/...` to `bears-space.de/api/keystatic/github/oauth/callback`.

These are sequenced after the code changes land and the Worker is verified working under a `*.workers.dev` URL.

## Critical files

- `astro.config.mjs` — the heart of the change
- `package.json` — script cleanup
- `wrangler.jsonc` — Worker manifest
- `keystatic.config.ts` — comment update only
- `src/pages/admin.astro` — drop the env-gate
- `.gitignore` — add `.wrangler/`
- `CLAUDE.md` — doc rewrite
- `node_modules/@keystatic/astro/dist/keystatic-astro.js:39–52` — reference (already does the right thing, no edit)

## Verification

1. `npm run build` succeeds; inspect `dist/` — should contain prerendered HTML for every public page **and** a `dist/_worker.js/` directory with the SSR bundle.
2. `npx wrangler dev` — both `/` (static HTML from assets binding) and `/keystatic` (Worker-rendered, local storage since NODE_ENV ≠ production) should respond.
3. `npm test` — the Keystatic schema test in `src/utils/__tests__/keystaticSchema.test.ts` should pass (no schema changes, just sanity).
4. Smoke-check `/admin` renders the translation-status report unconditionally now (no env-gate).
5. After Worker deploy: hit `bears-space.de/keystatic` → GitHub OAuth round-trip → land in admin UI → make a trivial edit → confirm the commit appears on `main`.
