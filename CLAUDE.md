# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a website for BEARS built with Astro.js and Tailwind CSS v4. The project uses a minimal Astro setup with file-based routing.

## Development Commands

Run commands from the project root:

- `npm run dev` - Start development server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally
- `npm run astro -- --help` - Get help with Astro CLI commands

**Important for Claude Code**: If you start a development server (e.g., `npm run dev`) during a task, you MUST stop it before completing the task. Use the KillShell tool with the appropriate shell ID to terminate background processes. This prevents resource accumulation across multiple prompts.

## Architecture

### Technology Stack
- **Framework**: Astro.js 5.x (SSG/hybrid rendering)
- **Styling**: Tailwind CSS v4 (via Vite plugin)
- **Interactivity**: Alpine.js for lightweight client-side JavaScript features
- **TypeScript**: Strict mode enabled (extends astro/tsconfigs/strict)

### Project Structure
```
src/
├── pages/          # File-based routing - each .astro or .md file becomes a route
├── layouts/        # Layout components (BaseLayout.astro imports global styles)
└── styles/         # global.css imports Tailwind
```

### Key Configuration
- Astro config: [astro.config.mjs](astro.config.mjs) - Tailwind integrated via Vite plugin
- TypeScript: [tsconfig.json](tsconfig.json) - Strict Astro configuration
- Global styles: [src/styles/global.css](src/styles/global.css) - Single Tailwind import
- Layout: [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro) - Imports global.css

### Routing
Astro uses file-based routing. Files in `src/pages/` automatically become routes:
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/[slug].astro` → `/blog/:slug` (dynamic routes)

### Styling Pattern
This project uses Tailwind CSS v4 with the Vite plugin. Global styles are imported via BaseLayout. Use Tailwind utility classes directly in Astro components.

**Mobile-First Design**: All new components and features should be designed with mobile devices in mind first. Use Tailwind's responsive breakpoints (sm, md, lg, xl) to progressively enhance for larger screens. Start with mobile styles as the base, then add breakpoint modifiers for larger screens.

**Responsive Breakpoint Strategy**: This website primarily uses `sm:` (640px) and `lg:` (1024px) as the main breakpoints for layout changes. Avoid using `md:` (768px) for major layout transitions, as the 768px-1024px range often creates awkward, cramped layouts on tablets. More granular controlled layouts with `md:` are often too fiddly and don't provide good user experience. Reserve `md:` for fine-tuning details like spacing or font sizes, not for major structural changes.

**Recommended breakpoint usage:**
- Base (mobile): Core layout and styling
- `sm:` (640px+): Small adjustments for larger phones
- `lg:` (1024px+): Major layout changes (column to row, single to multi-column grids)
- `xl:` (1280px+): Optional refinements for very large screens

Examples:
- Grid layouts: `grid-cols-1 lg:grid-cols-2` (skip md:)
- Flex direction: `flex-col lg:flex-row` (skip md:)
- Component sizing: Fine-tune with all breakpoints as needed

**Headline Spacing**: All h2 headlines should use consistent spacing below them (unless explicitly specified otherwise for a particular component). The standard spacing pattern for headlines is:
```
mb-8 sm:mb-10 lg:mb-14
```
This provides:
- Mobile (< 640px): 2rem (32px)
- Small screens (640px+): 2.5rem (40px)
- Large screens (1024px+): 3.5rem (56px)

This ensures a coherent visual rhythm across all sections of the website. Apply this spacing to all h2 headlines in components that appear on pages, maintaining consistency with the overall design system.

### Static Assets
Place static files (images, fonts, etc.) in the `public/` directory. They're served from the root path.

### Images and Astro's Image Component

This project uses Astro's `<Image/>` component for all images to enable automatic optimization, responsive image generation, and control over loading behavior.

**CRITICAL: No Remote Image URLs**
- **NEVER use remote URLs** (e.g., `https://placehold.co/...`, `https://via.placeholder.com/...`) for images
- **ALL images MUST be local files** stored in `/src/assets/`
- Placeholder images must be actual image files imported from `/src/assets/`

**Image Architecture:**
- All images are stored in `/src/assets/` with subdirectories:
  - `/src/assets/events/` - Event cover images
  - `/src/assets/projects/` - Project cover images
  - `/src/assets/sponsors/` - Sponsor logos
  - `/src/assets/testimonials/` - Testimonial portraits
- Components pass `ImageMetadata` objects (not URL strings) as props
- The `<Image/>` component handles optimization automatically

**Usage Pattern:**
```astro
---
import { Image } from 'astro:assets';
import placeholderImage from '../assets/events/event-1.jpg';
---

<Image
  src={placeholderImage}
  alt="Description"
  class="..."
  loading="lazy"  // or "eager" for above-the-fold
  format="webp"
/>
```

**Loading Strategy:**
- Use `loading="eager"` for above-the-fold images (e.g., cover images on detail pages)
- Use `loading="lazy"` for below-the-fold images (e.g., cards, carousels, logos)

**Img and Responsive Sizing:**

When using `Img`, provide a `sizes` prop when the display size can be calculated. This helps the browser load appropriately sized images from the srcset.

Examples:
- For marquees/carousels with known image count: `sizes={`calc(100vh / ${images.length})`}`
- For grid layouts: `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"`
- For fixed-width containers: `sizes="300px"`

The `sizes` prop tells the browser the expected display width, allowing it to select the optimal image from the generated srcset without downloading unnecessarily large files.

### MDX Components

When creating reusable components intended for use in `.mdx` files, consider supporting Markdown input for string content properties. This allows content creators to format text with rich styling (bold, lists, links, code blocks, etc.) without writing HTML.

**When to support Markdown:**
- Components with string content properties (e.g., `content`, `description`, `text`)
- Not needed for components using slots, where content comes from MDX as JSX/HTML
- Typical examples: components that display collapsible content, cards with descriptions, tooltips

**Implementation Pattern:**

Use the `markdownToHtml` utility from [src/utils/markdown.ts](src/utils/markdown.ts) to process Markdown strings server-side:

```astro
---
import { markdownToHtml } from '../../utils/markdown';

interface Props {
  items: Array<{
    title: string;
    content: string;  // Markdown format
  }>;
}

const { items } = Astro.props;

// Process Markdown to HTML server-side
const processedItems = await Promise.all(
  items.map(async (item) => ({
    ...item,
    content: await markdownToHtml(item.content)
  }))
);
---

<div>
  {processedItems.map((item) => (
    <div set:html={item.content} />
  ))}
</div>
```

**Reference Implementation:**
See [Accordion.astro](src/components/mdx/Accordion.astro) for a complete example of Markdown support in a reusable component. It accepts content in Markdown format and processes it server-side for optimal performance.

### Editable Page Content

Static text in components and pages — such as headings, descriptions, and button labels — should be sourced from `.md` files in the `page-text` content collection (`src/content/page-text/`) rather than hardcoded, when useful and practical. This allows content creators to update copy without touching component code.

**Subfolder conventions:**
- `landing/` — content for homepage sections (e.g., `landing/what-is-bears`)
- Each page has its own subfolder (e.g., `about-us/`, `events/`, `sponsors/`)
- Page hero title/subtitle files use a `-title` suffix (e.g., `events/events-title`)
- Section-specific content goes alongside the title file (e.g., `about-us/our-mission`, `about-us/find-us`)

**Querying content:**
Use `getPageContent(id)` from `src/utils/contentQueries.ts` to fetch a page content entry by its ID:

```astro
---
import { getPageContent } from '../utils/contentQueries';

const content = await getPageContent('events/events-title');
---

<h2>{content.data.title}</h2>
<p>{content.data.description}</p>
```

**When to extract content:** Not every string needs to be pulled into a content file. Use this pattern for user-facing text that content creators are likely to want to edit (section headings, intro paragraphs, CTA labels). Internal labels, aria attributes, and structural text can stay hardcoded.

## Documentation

All documentation lives in `src/content/docs/` as a content collection, served at `/docs/` on the website. Files are `.md` or `.mdx` (MDX allows importing and live-demoing components).

- **Guides** (`src/content/docs/guides/`): User-facing guides for content creators
- **Dev Docs** (`src/content/docs/dev/`): Technical reference for developers

Documentation pages use `DocsLayout.astro` with a sidebar navigation auto-generated from the collection. Each doc file has frontmatter with `title`, `description` (optional), and `order` (numeric sort order within its section).

**Important**: When you make code changes that affect documented behavior or data structures, update the corresponding doc file in `src/content/docs/`.

### When to Update Documentation

Update documentation files when:
- Changing content collection schemas (e.g., adding/removing frontmatter fields)
- Modifying sort/filter logic (e.g., how items are ordered)
- Changing file organization or naming conventions
- Updating asset paths or directory structures
- Modifying how content is displayed or validated
- Adding or changing MDX component props or behavior
