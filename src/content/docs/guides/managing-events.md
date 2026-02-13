---
title: "Managing Events"
description: "How to add, edit, and organize events."
order: 20
group: "Content"
---

Events are stored in `src/content/events/` as Markdown or MDX files.

## Creating an Event

Create a new file in `src/content/events/` with the naming convention `YYYY MM DD title.mdx`:

```mdx
---
title: "BEARS 24-Hour Hackathon 2026"
description: "Test your skills in our annual hackathon focused on autonomous systems and sustainable engineering."
date: 2026-03-15
categoryEvent: "competitions-and-workshops"
coverImage: "event-10.jpg"
isDraft: false   # Optional — defaults to false, set true to hide from production
---

import { Accordion, Button, Callout, Carousel, Center, Img, Instagram, Marquee, YouTube, SideBySide, Left, Right } from '@mdx';

## About the Hackathon

<Callout title="Registration Open">
  Sign up before March 1st to secure your spot!
</Callout>

Get ready for the most exciting event of the semester! Our annual hackathon
challenges teams to design, build, and program innovative solutions within
24 hours. Whether it's waste-sorting robots, energy-efficient drones, or
smart agricultural systems, we want to see your creative solutions.
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
