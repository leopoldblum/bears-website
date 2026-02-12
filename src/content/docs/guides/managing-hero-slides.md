---
title: "Managing Hero Slides"
description: "How to add and configure the landing page slideshow."
order: 24
group: "Content"
---

Hero slides control the full-screen background slideshow on the landing page. They are stored in `src/content/hero-slides/`.

## Creating a Slide

Create a new file with the naming convention `NN-name.md` (e.g., `06-team-photo.md`). The numeric prefix determines the display order.

**Image slide:**

```yaml
---
type: "image"
media: "hero-mars-rover.jpg"
alt: "Mars Rover Engineering lecture at BEARS"
shownText: "Explore Mars"
---
```

**Video slide:**

```yaml
---
type: "video"
media: "sample-video.webm"
shownText: "Video Background Example"
---
```

The body of hero slide files is not used.

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | enum | Either `image` or `video` |
| `media` | string | Filename of the image or video |
| `alt` | string | Alt text for accessibility (**required** for image slides, optional for video slides) |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `shownText` | string | Overlay text displayed on the slide |

## Media Files

Place all media files in `src/assets/hero/landingpage/`.

- **Images:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Videos:** `.mp4`, `.webm`, `.ogg`

## Ordering

Slides are sorted by the numeric prefix in the filename. Use two-digit numbers (`01`, `02`, ... `10`, `11`) to ensure correct ordering &mdash; the sort is numeric, not alphabetical.
