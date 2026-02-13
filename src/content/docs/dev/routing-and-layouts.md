---
title: "Routing & Layouts"
description: "File-based routing, dynamic routes, and the layout system."
order: 11
group: "Architecture"
---

## File-Based Routing

Astro maps files in `src/pages/` directly to URLs:

| File | URL | Description |
|------|-----|-------------|
| `index.astro` | `/` | Homepage |
| `events.astro` | `/events` | Events listing with filtering |
| `projects.astro` | `/projects` | Projects listing with filtering |
| `about-us.astro` | `/about-us` | About page |
| `sponsors.astro` | `/sponsors` | Sponsors page |
| `contact.astro` | `/contact` | Contact page |
| `media.astro` | `/media` | Media gallery |
| `imprint.astro` | `/imprint` | Legal imprint |
| `datenschutz.astro` | `/datenschutz` | Privacy policy |
| `404.astro` | N/A | Custom 404 page |
| `events/[slug].astro` | `/events/:slug` | Event detail page |
| `projects/[slug].astro` | `/projects/:slug` | Project detail page |
| `docs/index.astro` | `/docs/` | Documentation index |
| `docs/[...slug].astro` | `/docs/*` | Documentation pages |

## Dynamic Routes

Dynamic route pages export a `getStaticPaths()` function that returns all valid paths at build time.

### Single-segment (`[slug].astro`)

Used by events and projects:

```astro
---
import { getPublishedEvents } from "@utils/contentQueries";
import { loadCoverImage } from "@utils/imageLoader";

export async function getStaticPaths() {
  const events = await getPublishedEvents();
  return events.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const coverImage = await loadCoverImage(entry.data.coverImage, "event", entry.slug);
const { Content } = await entry.render();
---
```

### Rest parameter (`[...slug].astro`)

Used by docs to support nested paths (e.g., `/docs/guides/managing-events`):

```astro
---
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const docs = await getCollection("docs");
  return docs.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}
---
```

## Layout Hierarchy

```
BaseLayout.astro          ← All public pages
├── PostLayout.astro      ← Event & project detail pages
└── (page).astro          ← Direct usage by listing/static pages

DocsLayout.astro          ← Standalone (not based on BaseLayout)
```

### BaseLayout

**File:** `src/layouts/BaseLayout.astro`
**Props:** `title`, `description?`, `ogImage?`

Provides the HTML shell for all public pages:

- **SEO meta tags** &mdash; canonical URL, Open Graph, Twitter Card
- **Structured data** &mdash; Organization schema with social links (loaded from `site/social-links` page-text)
- **Hash scroll handling** &mdash; intercepts hash before browser's native scroll, then smooth-scrolls after Alpine initializes (with a `load` event fallback for non-Alpine pages)
- **Global layout** &mdash; Header + main content slot + Footer + BackToTopButton

### PostLayout

**File:** `src/layouts/PostLayout.astro`
**Extends:** BaseLayout
**Props:** `title`, `description`, `slug`, `date`, `coverImage?`, `category`, `isCompleted?`, `headOfProject?`, `type` (`'event' | 'project'`)

Used for event and project detail pages:

- **Structured data** &mdash; Event schema (for events) or Article schema (for projects)
- **Reading progress** &mdash; Top-of-page progress bar
- **Two-column layout** &mdash; Prose content + sticky metadata sidebar (mobile: sidebar above content, desktop: sidebar on right)
- **Prose styling** &mdash; Custom styles for h2-h4, lists, blockquotes, code blocks, tables

### DocsLayout

**File:** `src/layouts/DocsLayout.astro`
**Props:** `title`, `description?`, `headings?`

Standalone layout (does not extend BaseLayout) used for documentation pages:

- **Sticky header** &mdash; "BEARS Docs" branding with back-to-site link and mobile hamburger
- **Three-column layout** &mdash; Sidebar (left) + article content (center) + table of contents (right, XL+ only)
- **Code block copy buttons** &mdash; Auto-generated with checkmark feedback
- **Docs prose styling** &mdash; Custom heading, list, table, and code block styles
- **Hash scroll** &mdash; Same pattern as BaseLayout

## Hash Scroll Handling

Both BaseLayout and DocsLayout share the same hash scroll pattern. It works in two phases:

1. **Inline head script** &mdash; Captures `window.location.hash` into `window.__scrollTarget` and strips the hash from the URL (prevents the browser's default jump)
2. **Body script** &mdash; After Alpine initializes (or on `load` as fallback), smooth-scrolls to the target element using `requestAnimationFrame` double-call for timing safety
