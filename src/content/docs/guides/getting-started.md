---
title: "Getting Started"
description: "How to add and edit content on the BEARS website."
order: 10
---

This guide covers the basics of managing content on the BEARS website.

## How Content Files Work

All website content is managed through Markdown files in `src/content/`. Each file has a **frontmatter** block at the top (between `---` delimiters) that defines metadata, followed by optional Markdown body content:

```yaml
---
title: "My Event Title"
description: "A short description."
date: 2026-01-15
---

Body content goes here — this becomes the detail page text.
```

Most files use `.md` (Markdown). Event and project posts can use `.mdx` instead, which allows importing interactive components like accordions, carousels, and image galleries into the page body. Other content types (sponsors, testimonials, page text, etc.) only use `.md`.

## MDX Components

When writing an event or project post as `.mdx`, paste the following import line at the top of the file (right after the frontmatter closing `---`). This gives you access to every available component:

```mdx
import { Accordion, Button, Callout, Carousel, Center, Img, Instagram, Marquee, YouTube, SideBySide, Left, Right } from '@mdx';
```

Unused imports are automatically removed during the build, so there is no performance cost to importing everything upfront. This way you can simply use any component and never worry about missing an import. See the **MDX Components** section in the sidebar for guides on each component.

## Content Types

Each type of content has its own folder and schema. Click through for field references and examples:

- **[Events](/docs/guides/managing-events/)** &mdash; workshops, talks, and competitions
- **[Projects](/docs/guides/managing-projects/)** &mdash; ongoing and completed team projects
- **[Sponsors](/docs/guides/managing-sponsors/)** &mdash; company sponsors organized by tier
- **[Testimonials](/docs/guides/managing-testimonials/)** &mdash; quotes from members and partners
- **[Hero Slides](/docs/guides/managing-hero-slides/)** &mdash; landing page background slideshow
- **[Instagram Posts](/docs/guides/managing-instagram-posts/)** &mdash; embedded Instagram posts
- **[Faces of BEARS](/docs/guides/managing-faces-of-bears/)** &mdash; team member profiles on About Us
- **[Page Text](/docs/guides/managing-page-text/)** &mdash; editable headings, descriptions, and CTAs

## Common Patterns

**Drafts:** Events, projects, and Instagram posts support `isDraft: true` to hide content in production while keeping it visible during development.

**Images:** All images must be local files in `src/assets/` subdirectories. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`. Never use remote URLs.

**File naming:** Conventions vary by content type &mdash; check the individual guide for details. Common patterns are date prefixes (`YYYY MM DD title.md`) and numeric prefixes (`NN-name.md`).