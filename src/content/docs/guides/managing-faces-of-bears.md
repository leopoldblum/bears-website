---
title: "Managing Faces of BEARS"
description: "How to add and manage team member profiles on the About Us page."
order: 26
group: "Content"
---

The "Faces of BEARS" section on the About Us page shows team member profiles. They are stored in `src/content/faces-of-bears/`.

## Creating a Member Profile

Create a new file with the naming convention `NN-name.md` (e.g., `17-jane-doe.md`). The numeric prefix controls the display order.

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
| `coverImage` | string | Filename of portrait image in `src/assets/about-us/faces-of-bears/` |

## Images

Place portrait images in `src/assets/about-us/faces-of-bears/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Display Order

Profiles are sorted alphabetically by slug. Use numeric prefixes like `01-`, `02-`, `03-` to control the order.
