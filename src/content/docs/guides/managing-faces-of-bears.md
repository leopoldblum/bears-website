---
title: "Managing Faces of BEARS"
description: "How to add and manage team member profiles on the About Us page."
order: 26
group: "Content"
---

The "Faces of BEARS" section on the About Us page shows team member profiles. They are stored in `src/content/faces-of-bears/`, organized by locale.

## Folder Structure

```
src/content/faces-of-bears/
├── en/              ← English (default)
│   ├── 01-member.md
│   └── ...
└── de/              ← German translations
    ├── 01-member.md
    └── ...
```

Both folders use identical filenames. If a German translation is missing, the English version is displayed on the `/de/` pages.

## Creating a Member Profile

Create a new file in `en/` (or `de/` for German) with the naming convention `NN-name.md` (e.g., `17-jane-doe.md`). The numeric prefix controls the display order.

```yaml
---
name: "Jane Doe"
role: "Propulsion Lead / WS 2025"
coverImage: "jane-doe.jpg"
---
```

The body of these files is not used &mdash; all content comes from the frontmatter.

## Required Fields

All fields are required:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Team member's name |
| `role` | string | Their role, year, or team |
| `coverImage` | string | Filename of portrait image in `src/assets/faces-of-bears/` |

## Images

Place portrait images in `src/assets/faces-of-bears/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Display Order

Profiles are sorted alphabetically by slug. Use numeric prefixes like `01-`, `02-`, `03-` to control the order.
