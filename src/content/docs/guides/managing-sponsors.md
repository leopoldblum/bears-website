---
title: "Managing Sponsors"
description: "How to add and organize sponsors by tier."
order: 22
group: "Content"
---

Sponsors are stored in `src/content/sponsors/` and organized into tier subfolders.

## Tier Structure

The sponsor's tier is determined by which folder the file is in &mdash; not by a frontmatter field. To change a sponsor's tier, move the file to a different folder.

```
src/content/sponsors/
├── diamond/
├── platinum/
├── gold/
├── silver/
└── bronze/
```

## Creating a Sponsor

Create a new file inside the appropriate tier folder with the naming convention `NN-name.md`. The numeric prefix controls the display order within the tier.

```yaml
---
name: "Global Space Industries"
logo: "diamond-01-global-space.png"
url: "https://example.com"
---
```

The body of sponsor files is not used &mdash; all content comes from the frontmatter.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Sponsor company name |
| `logo` | string | Filename of the logo image in `src/assets/sponsors/` |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `url` | string | Link to the sponsor's website (must be a full URL) |

## Logos

Place logo images in `src/assets/sponsors/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Display Order

Within each tier, sponsors are sorted alphabetically by slug (the filename). Use numeric prefixes like `01-`, `02-`, `03-` to control the order.
