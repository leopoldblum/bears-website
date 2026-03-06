---
title: "Managing Testimonials"
description: "How to add member quotes and testimonials."
order: 23
group: "Content"
---

Testimonials are stored in `src/content/testimonials/` as Markdown files, organized by locale.

## Folder Structure

```
src/content/testimonials/
├── en/              ← English (default)
│   ├── 01-member-4.md
│   └── ...
└── de/              ← German translations
    ├── 01-member-4.md
    └── ...
```

Both folders use identical filenames. If a German translation is missing, the English version is displayed on the `/de/` pages.

## Creating a Testimonial

Create a new file in `en/` (or `de/` for German) with the naming convention `NN-name.md` (e.g., `04-jane-doe.md`). The numeric prefix controls the display order.

```yaml
---
quote: "Working at BEARS taught me more about rocket propulsion than any textbook."
name: "Jane Doe"
role: "Propulsion Lead / WS 2025"
coverImage: "jane-doe.jpg"
---
```

The body of testimonial files is not used &mdash; all content comes from the frontmatter.

## Required Fields

All fields are required:

| Field | Type | Description |
|-------|------|-------------|
| `quote` | string | The testimonial text |
| `name` | string | Person's name |
| `role` | string | Their role, year, or team (e.g., "Project Lead / WS 2025") |
| `coverImage` | string | Filename of portrait image in `src/assets/testimonials/` |

## Images

Place portrait images in `src/assets/testimonials/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`.

## Display Order

Testimonials are sorted alphabetically by slug. Use numeric prefixes like `01-`, `02-`, `03-` to control the order.
