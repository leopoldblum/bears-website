# Astro.js Website for BEARS

> **TODO:** Add an `og-default.jpg` image (1200 x 630 px) to `/public/` for social media link previews (WhatsApp, LinkedIn, X, etc.). Without it, shared links will have text but no preview image.
>
> **TODO:** Write SEO meta descriptions (~150 characters each) in the `seoDescription` field of these content files:
> - `src/content/page-text/landing/hero.md` (homepage)
> - `src/content/page-text/about-us/about-us-title.md`
> - `src/content/page-text/events/events-title.md`
> - `src/content/page-text/projects/projects-title.md`
> - `src/content/page-text/sponsors/sponsors-title.md`
> - `src/content/page-text/media/media-title.md`
> - `src/content/page-text/contact/contact-title.md`

## Local Quickstart

```sh
npm install
npm run dev
```

## Project Structure

```text
/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── assets/              # Images organized by content type
│   │   ├── about-us/        # About page section images
│   │   ├── default-images/  # Placeholder/fallback images
│   │   ├── events/          # Event cover images
│   │   ├── hero/            # Hero images by page (about-us/, events/, etc.)
│   │   ├── projects/        # Project cover images
│   │   ├── sponsors/        # Sponsor logos by tier (diamond/, gold/, etc.)
│   │   ├── testimonials/    # Testimonial portraits
│   │   └── whatIsBears/     # "What is BEARS" section images
│   │
│   ├── components/          # Astro & React components
│   │   ├── about/           # About page sections
│   │   ├── events/          # Events page components
│   │   ├── landing/         # Homepage sections
│   │   ├── layout/          # Header, Footer, BackToTop
│   │   ├── mdx/             # Components for use in MDX content
│   │   ├── post/            # Event/project detail page components
│   │   ├── posts-catalog/   # Listing pages: cards, filters, pagination
│   │   ├── projects/        # Projects page components
│   │   └── reusable/        # Generic reusable UI components
│   │
│   ├── content/             # Astro content collections
│   │   ├── events/          # Event entries (.md/.mdx)
│   │   ├── projects/        # Project entries (.md/.mdx)
│   │   ├── sponsors/        # Sponsor entries by tier (diamond/, gold/, etc.)
│   │   ├── testimonials/    # Testimonial entries
│   │   ├── hero-slides/     # Landing page hero carousel slides
│   │   ├── instagram/       # Instagram feed entries
│   │   ├── page-text/       # Editable page copy by section
│   │   │   ├── landing/     #   Homepage sections
│   │   │   ├── about-us/    #   About page
│   │   │   ├── events/      #   Events page
│   │   │   ├── projects/    #   Projects page
│   │   │   ├── sponsors/    #   Sponsors page
│   │   │   └── ...          #   contact/, media/, footer/, imprint/
│   │   └── config.ts        # Collection schemas (Zod)
│   │
│   ├── layouts/             # Page layouts (BaseLayout, PostLayout)
│   ├── pages/               # File-based routing
│   │   ├── events/[slug].astro   # Dynamic event detail pages
│   │   └── projects/[slug].astro # Dynamic project detail pages
│   ├── styles/              # Global CSS (Tailwind v4)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helpers (content queries, image loading, etc.)
│       └── __tests__/       # Vitest unit tests
│
├── guides/              # Documentation for content creators
├── astro.config.mjs
├── vitest.config.ts
├── CLAUDE.md            # AI assistant instructions
├── package.json
└── tsconfig.json
```

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
