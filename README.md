# Astro.js Website for BEARS
>
> **TODO:** Write SEO meta descriptions (~150 characters each) in the `seoDescription` field of these content files (in both `en/` and `de/` folders):
> - `src/content/page-text/en/hero.md` (homepage)
> - `src/content/page-text/en/about-us/about-us-title.md`
> - `src/content/page-text/en/events/events-title.md`
> - `src/content/page-text/en/projects/projects-title.md`
> - `src/content/page-text/en/sponsors/sponsors-title.md`
> - `src/content/page-text/en/media-categories.md`
> - `src/content/page-text/en/contact/contact-title.md`
>
> **TODO:** Add benefits section to sponsors and link in footer, or remove entry in footer.
>
> **TODO (Keystatic follow-up — MDX with components):** Keystatic can currently edit plain-markdown bodies but not MDX files that use components like `<Callout>`, `<Carousel>`, etc. Two remaining tasks to fix this:
> 1. **Strip imports from existing `.mdx` files** under `src/content/events/`, `src/content/projects/`, and `src/content/docs/`. Keystatic's MDX parser crashes on any file whose body starts with `import … from` statements. Until a file is cleaned up, opening it in Keystatic will fail.
> 2. **Wire the MDX component barrel (`src/components/mdx/index.ts`) into Astro's MDX renderer globally** — via a shared MDX layout or the `components` option on `render()` — so bare tags like `<Button>` / `<Img>` resolve without explicit imports. Once both steps are done, wire `mdxComponents` from `src/keystatic/mdxComponents.tsx` into `keystatic.config.ts` (`mdBodyField` / `mdxBodyField` → `fields.mdx({ components: mdxComponents, … })`) to re-enable the component picker in the editor.
>
> **TODO (Keystatic follow-up — extension split):** Each Keystatic collection pins a single file extension. Projects and docs use `.md`; events uses `.mdx`. Files in those collections that use the "other" extension (e.g., the 2 `.mdx` files in `projects/`) are invisible in the admin UI — they still render on the public site but can't be edited through Keystatic. Normalise extensions (e.g., rename the few outliers) or split each collection into two (`…Md` + `…Mdx`) to surface them.

## Prerequisites

You need **Node.js** (v18 or later) and **npm** (bundled with Node.js).

1. Download and install Node.js from [nodejs.org](https://nodejs.org/) (the LTS version is recommended).
2. Verify the installation by opening a terminal and running:
   ```sh
   node -v
   npm -v
   ```
   Both commands should print a version number.

## Local Quickstart

```sh
npm install
npm run dev
```

## Adding New Content

When adding or editing content (events, projects, sponsors, page text, etc.), **always work on a new branch** — never commit directly to `main`.

1. Create a new branch before making changes:
   ```sh
   git checkout -b my-content-update
   ```
2. Make your changes, then commit them:
   ```sh
   git add .
   git commit -m "Add new event: Spring Workshop 2026"
   ```
3. Push your branch:
   ```sh
   git push -u origin my-content-update
   ```
4. *(Optional)* If you're comfortable with GitHub, you can open a **Pull Request** on GitHub to have your changes reviewed before they go live.

## Project Structure

```text
/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images organized by content type
│   │   ├── about-us/        # About page section images (our-mission/)
│   │   ├── default-images/  # Placeholder/fallback images
│   │   ├── events/          # Event cover images
│   │   ├── faces-of-bears/  # Team member portraits
│   │   ├── hero/            # Hero images by page (about-us/, events/, etc.)
│   │   ├── projects/        # Project cover images
│   │   ├── sponsors/        # Sponsor logos by tier (diamond/, gold/, etc.)
│   │   ├── testimonials/    # Testimonial portraits
│   │   └── whatIsBears/     # "What is BEARS" section images
│   │
│   ├── components/          # Astro components
│   │   ├── about/           # About page sections
│   │   ├── contact/         # Contact page components
│   │   ├── docs/            # Documentation page components
│   │   ├── events/          # Events page components
│   │   ├── landing/         # Homepage sections
│   │   ├── layout/          # Header, Footer, BackToTop
│   │   ├── mdx/             # Components for use in MDX content
│   │   ├── post/            # Event/project detail page components
│   │   ├── posts-catalog/   # Listing pages: cards, filters, pagination
│   │   ├── projects/        # Projects page components
│   │   ├── reusable/        # Generic reusable UI components
│   │   └── sponsors/        # Sponsors page components
│   │
│   ├── content/             # Astro content collections
│   │   ├── docs/            # Documentation pages (guides/, dev/)
│   │   ├── events/          # Event entries (.md/.mdx)
│   │   │   ├── en/          #   English (default)
│   │   │   └── de/          #   German translations
│   │   ├── faces-of-bears/  # Team member profiles
│   │   │   ├── en/          #   English (default)
│   │   │   └── de/          #   German translations
│   │   ├── hero-slides/     # Landing page hero carousel slides
│   │   ├── instagram/       # Instagram feed entries
│   │   ├── page-text/       # Editable page copy by section
│   │   │   ├── en/          #   English (default)
│   │   │   │   ├── landing/ #     Homepage sections
│   │   │   │   ├── about-us/#     About page
│   │   │   │   ├── events/  #     Events page
│   │   │   │   ├── projects/#     Projects page
│   │   │   │   ├── sponsors/#     Sponsors page
│   │   │   │   └── ...      #     404/, contact/, footer/, site/, etc.
│   │   │   └── de/          #   German translations (same structure)
│   │   ├── projects/        # Project entries (.md/.mdx)
│   │   │   ├── en/          #   English (default)
│   │   │   └── de/          #   German translations
│   │   ├── sponsors/        # Sponsor entries by tier (diamond/, gold/, etc.)
│   │   ├── testimonials/    # Testimonial entries
│   │   │   ├── en/          #   English (default)
│   │   │   └── de/          #   German translations
│   │   └── config.ts        # Collection schemas (Zod)
│   │
│   ├── layouts/             # Page layouts (BaseLayout, DocsLayout, PostLayout)
│   ├── pages/               # File-based routing (English, default locale)
│   │   ├── de/              # German locale wrappers (re-render root pages)
│   │   │   ├── index.astro  #   Each file imports + renders the root page
│   │   │   ├── events/[slug].astro
│   │   │   └── ...          #   about-us, projects, sponsors, contact, etc.
│   │   ├── docs/[...slug].astro   # Documentation pages (English only)
│   │   ├── events/[slug].astro    # Dynamic event detail pages
│   │   └── projects/[slug].astro  # Dynamic project detail pages
│   ├── styles/              # Global CSS (Tailwind v4)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helpers (content queries, image loading, etc.)
│       └── __tests__/       # Vitest unit tests
│
├── astro.config.mjs
├── wrangler.jsonc        # Cloudflare Pages deployment config
├── vitest.config.ts
├── CLAUDE.md             # AI assistant instructions
├── package.json
└── tsconfig.json
```

## Internationalization (i18n)

The site supports two languages: **English** (default) and **German**.

- English pages live at the root URL (e.g., `/about-us`)
- German pages live under `/de/` (e.g., `/de/about-us`)

Localized content collections (`events`, `projects`, `page-text`, `testimonials`, `faces-of-bears`) use `en/` and `de/` subfolders. Collections that are language-neutral (`sponsors`, `instagram`, `hero-slides`) stay flat. If a German translation is missing, the English version is shown as fallback.

The language switcher in the header toggles between locales. Locale utilities live in `src/utils/i18n.ts`.

## Images

All images must be local files in `src/assets/` subdirectories — remote URLs are not supported. Accepted formats: `.jpg`, `.jpeg`, `.png`, `.webp`. Hero slides also accept video formats (`.mp4`, `.webm`, `.ogg`). See the [image system docs](src/content/docs/dev/image-system.md) for details on the loading pipeline and fallback behavior.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`       |
| `npm run build`           | Build your production site to `./dist/`           |
| `npm run preview`         | Preview your build locally, before deploying      |
| `npm test`                | Run unit tests once                               |
| `npm run test:watch`      | Run unit tests in watch mode                      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`  |
| `npm run astro -- --help` | Get help using the Astro CLI                      |
