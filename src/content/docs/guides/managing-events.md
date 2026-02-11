---
title: "Managing Events"
description: "How to add, edit, and organize events."
order: 20
group: "Content"
---

Events are stored in `src/content/events/` as Markdown or MDX files.

## Creating an Event

Create a new file in `src/content/events/` with the naming convention `YYYY MM DD title.md`:

```yaml
---
title: "Rocket Engine Test Day"
description: "Join us for a live test of our latest engine prototype."
date: 2026-03-15
categoryEvent: "competitions-and-workshops"
coverImage: "event-1.jpg"
isDraft: false
---
```

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Event title |
| `description` | string | Short summary |
| `date` | date | Event date (`YYYY-MM-DD`) |
| `categoryEvent` | enum | One of: `trade-fairs-and-conventions`, `competitions-and-workshops`, `kick-off-events`, `other` |
| `coverImage` | string | Filename of cover image in `src/assets/events/` |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `isDraft` | boolean | Set to `true` to hide in production (default: `false`) |

## Cover Images

Place cover images in `src/assets/events/`. Valid formats: `.jpg`, `.jpeg`, `.png`, `.webp`.
