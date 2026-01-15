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
mb-6 sm:mb-8 md:mb-12
```
This provides:
- Mobile (< 640px): 1.5rem (24px)
- Small screens (640px+): 2rem (32px)
- Medium+ screens (768px+): 3rem (48px)

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

## Documentation

The `/documentation/` directory contains user-facing guides for content creators and maintainers. These documents explain how to add and manage content on the website.

**Important**: When you make code changes that affect documented behavior or data structures, you must update the corresponding documentation files to keep them in sync with the implementation.

### When to Update Documentation

Update documentation files when:
- Changing content collection schemas (e.g., adding/removing frontmatter fields)
- Modifying sort/filter logic (e.g., how items are ordered)
- Changing file organization or naming conventions
- Updating asset paths or directory structures
- Modifying how content is displayed or validated

### Documentation Files

- `how-to-add-and-manage-sponsors.md` - Guide for managing sponsor content
- `how-to-add-and-manage-testimonials.md` - Guide for managing testimonials
- `how-to-add-and-manage-events-and-projects.md` - Guide for managing events and projects
