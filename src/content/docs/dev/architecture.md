---
title: "Architecture"
description: "Overview of the project structure and technology stack."
order: 1
---

The BEARS website is built with Astro.js 5.x, Tailwind CSS v4, and Alpine.js.

## Technology Stack

- **Astro.js 5.x** &mdash; static site generation with file-based routing
- **Tailwind CSS v4** &mdash; utility-first styling via Vite plugin
- **Alpine.js** &mdash; lightweight client-side interactivity
- **TypeScript** &mdash; strict mode enabled
- **MDX** &mdash; Markdown with component support for rich content pages

## Project Structure

```
src/
├── pages/           # File-based routing
├── layouts/         # Page layouts (BaseLayout, PostLayout, DocsLayout)
├── components/      # UI components organized by feature
├── content/         # Content collections (events, projects, docs, etc.)
├── utils/           # Shared utilities and query functions
├── styles/          # Global CSS and Tailwind theme
├── assets/          # Images and static assets (processed by Astro)
└── types/           # Shared TypeScript types
```

## Content Collections

Content is managed through Astro's content collections, defined in `src/content/config.ts`. Each collection has a Zod schema that validates frontmatter fields.

## Routing

Astro uses file-based routing. Files in `src/pages/` map directly to URLs:

- `src/pages/index.astro` &rarr; `/`
- `src/pages/events.astro` &rarr; `/events`
- `src/pages/events/[slug].astro` &rarr; `/events/:slug`
