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

Create a new file inside the appropriate tier folder. The filename is just an identifier — display order comes from the `order` frontmatter field.

```yaml
---
name: "Global Space Industries"
order: 1
logo: "diamond-01-global-space.png"
url: "https://example.com"
---
```

The body of sponsor files is not used &mdash; all content comes from the frontmatter.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Sponsor company name |
| `order` | number | Display order within the tier (lower = shown first) |
| `logo` | string | Filename of the logo image in `src/assets/sponsors/` |

## Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `url` | string | — | Link to the sponsor's website (must be a full URL) |
| `bgColor` | string | `#ffffff` | Background color of the logo card. Use this when a sponsor's corporate identity requires a specific background (e.g. `#e20025` for a red brand). |

## Logo Cards & Background Color

Each sponsor logo is displayed inside a white card container with rounded corners and a soft shadow. This ensures logos look clean against the page background and satisfies corporate identity requirements for logos that must appear on a white surface.

If a sponsor's brand guidelines require a different background color, set the `bgColor` field in frontmatter:

```yaml
---
name: "Hetzner"
logo: "Hetzner-Logo-slogan_white_space-red.jpg"
url: "https://hetzner.com"
bgColor: "#e20025"
---
```

Any valid CSS color value works (`#hex`, `rgb()`, named colors). When omitted, the card defaults to white (`#ffffff`).

## Logos

Place logo images in `src/assets/sponsors/<tier>/` (matching the sponsor's tier folder). Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`.

## Display Order

Within each tier, sponsors are sorted in ascending order of the `order` field. Two sponsors with the same `order` fall back to alphabetical sort on the filename. The `Order` column in each tier's overview in the admin UI shows each sponsor's position.

## Donations

The Sponsors page also has a direct-donations card below the sponsor CTA, with bank transfer details and a PayPal button. Its copy, bank details, and PayPal URL are edited in the page-text file `src/content/page-text/{en,de}/donate.md` — not in this `src/content/sponsors/` folder. In the CMS, it shows up as the **Donate** singleton under *Page text*.

See the "Donate Card" section in [Managing Page Text](/docs/guides/managing-page-text#donate-card) for the full field reference and an example.
