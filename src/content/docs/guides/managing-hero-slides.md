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

- **Images:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
- **Videos:** `.mp4`, `.webm`, `.ogg`

**Uploading through the admin UI:** larger files (images >2 MB, videos >10 MB) will freeze the tab during upload &mdash; just let it run and it will go through after a while. Smaller files are preferred; shrink images at [squoosh.app](https://squoosh.app/) and compress videos with HandBrake or ffmpeg when you can. Dropping the file into `src/assets/hero/landingpage/` directly via git is always the quickest route for large media.

## Hero Logo

The landing hero displays a logo image instead of a text heading. The logo is loaded from `src/assets/hero/landingpage/logo/` &mdash; place a single image file in this directory. The filename does not matter; the component picks the first image it finds. To replace the logo, simply swap the file. If the directory is empty, a plain-text "BEARS" heading is shown as a fallback.

## Ordering

Slides are sorted by the numeric prefix in the filename. Use two-digit numbers (`01`, `02`, ... `10`, `11`) to ensure correct ordering &mdash; the sort is numeric, not alphabetical.
