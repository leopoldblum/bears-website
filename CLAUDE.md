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

### Static Assets
Place static files (images, fonts, etc.) in the `public/` directory. They're served from the root path.
