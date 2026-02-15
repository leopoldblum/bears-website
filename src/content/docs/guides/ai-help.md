---
title: "Ask AI for Help"
description: "Copy a ready-made prompt into ChatGPT or Claude to get instant help with the BEARS content system."
order: 11
---

Need help managing content? Copy the reference below and paste it into ChatGPT, Claude, or any other AI assistant, then ask your question. It contains a full summary of the content system so the AI can give you accurate answers.

<div x-data="{ expanded: false, copied: false, hc: false, he: false }" data-no-auto-copy style="position: relative; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); overflow: hidden; margin: 1.5rem 0;">
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.625rem 0.875rem; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);">
    <span style="font-size: 0.7rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;">AI Context Prompt</span>
    <span style="display: flex; gap: 0.5rem;">
      <button x-on:click="const c = $el.closest('[x-data]').querySelector('code'); navigator.clipboard.writeText(c.textContent).then(() => { copied = true; setTimeout(() => copied = false, 2000) })" x-text="copied ? '✓ Copied' : 'Copy'" x-on:mouseenter="hc = true" x-on:mouseleave="hc = false" style="appearance: none; font-family: inherit; line-height: 1; font-size: 0.75rem; font-weight: 500; padding: 0.375rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.15s ease;" x-bind:style="copied ? { color: '#C50E1F', borderColor: 'rgba(197,14,31,0.4)', background: 'rgba(197,14,31,0.12)' } : hc ? { color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' } : {}"></button>
      <button x-on:click="expanded = !expanded" x-text="expanded ? 'Collapse' : 'Expand'" x-on:mouseenter="he = true" x-on:mouseleave="he = false" style="appearance: none; font-family: inherit; line-height: 1; font-size: 0.75rem; font-weight: 500; padding: 0.375rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.15s ease;" x-bind:style="he ? { color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' } : {}"></button>
    </span>
  </div>
  <div x-bind:style="expanded ? '' : 'max-height: 12rem; overflow: hidden;'" style="transition: max-height 0.35s ease;">

````text
BEARS WEBSITE CONTENT SYSTEM REFERENCE

This is the content management system for the BEARS e.V. website, built with Astro.js. All content lives in src/content/ as Markdown (.md) or MDX (.mdx) files. Each file has YAML frontmatter between --- delimiters. Only events and projects support .mdx; everything else uses .md.

========================================
CONTENT COLLECTIONS
========================================

EVENTS (src/content/events/)
File naming: "YYYY MM DD title.md" or ".mdx"
Frontmatter:
  title: string (required)
  description: string (required)
  date: YYYY-MM-DD (required)
  categoryEvent: one of "trade-fairs-and-conventions", "competitions-and-workshops", "kick-off-events", "other" (required)
  coverImage: string (required) — filename in src/assets/events/, valid: .jpg .jpeg .png .webp
  isDraft: boolean (optional, default false) — hidden in production, visible in dev
Body: Markdown or MDX content for the detail page.

PROJECTS (src/content/projects/)
File naming: "YYYY MM DD title.md" or ".mdx"
Frontmatter:
  title: string (required)
  description: string (required)
  date: YYYY-MM-DD (required)
  categoryProject: one of "experimental-rocketry", "science-and-experiments", "robotics", "other" (required)
  coverImage: string (required) — filename in src/assets/projects/, valid: .jpg .jpeg .png .webp
  isProjectCompleted: boolean (required)
  isDraft: boolean (optional, default false)
  displayMeetTheTeam: boolean (optional) — shows a "Meet the Team" section
  headOfProject: string (optional) — REQUIRED when displayMeetTheTeam is true
  personImage: string (optional) — REQUIRED when displayMeetTheTeam is true, filename in src/assets/projects/team-members/, valid: .jpg .jpeg .png .webp
Body: Markdown or MDX content for the detail page.

SPONSORS (src/content/sponsors/)
Organized by tier folders: diamond/, platinum/, gold/, silver/, bronze/
File naming within tier: "NN-name.md" (numeric prefix = display order)
Frontmatter:
  name: string (required)
  logo: string (required) — filename in src/assets/sponsors/, valid: .jpg .jpeg .png .webp
  url: string (optional) — full website URL

TESTIMONIALS (src/content/testimonials/)
File naming: "NN-name.md" (numeric prefix = display order)
Frontmatter:
  quote: string (required)
  name: string (required)
  role: string (required)
  coverImage: string (required) — filename in src/assets/testimonials/, valid: .jpg .jpeg .png .webp

HERO SLIDES (src/content/hero-slides/)
File naming: "NN-name.md" (numeric prefix = display order, sorted numerically not alphabetically)
Two types:

Image slide:
  type: "image" (required)
  media: string (required) — filename in src/assets/hero/landingpage/
  alt: string (required)
  shownText: string (optional) — overlay text

Video slide:
  type: "video" (required)
  media: string (required) — video filename in src/assets/hero/landingpage/, valid: .mp4 .webm .ogg
  alt: string (optional)
  shownText: string (optional)

INSTAGRAM POSTS (src/content/instagram/)
File naming: "YYYY-MM-DD-slug.md"
Frontmatter:
  url: string (required) — full Instagram post URL
  date: YYYY-MM-DD (required)
  isDraft: boolean (optional, default false)
Landing page shows the 3 most recent posts sorted by date.

FACES OF BEARS (src/content/faces-of-bears/)
File naming: "NN-name.md" (numeric prefix = display order)
Frontmatter:
  name: string (required)
  role: string (required)
  coverImage: string (required) — filename in src/assets/faces-of-bears/, valid: .jpg .jpeg .png .webp

PAGE TEXT (src/content/page-text/)
Editable headings, descriptions, buttons, and structured data for every page section.
Only frontmatter is used — the body is ignored.
Frontmatter (only title is required, all others optional):
  title: string (required)
  subtitle: string — secondary heading or label
  description: string — paragraph text
  seoDescription: string — meta description for search engines (~150 chars)
  buttonText: string — button label (pair with buttonHref)
  buttonHref: string — button URL (pair with buttonText)
  ctas: array (max 4) — each: { title, description, href }
  items: array of strings — plain list or "Title -> Description" format (arrow separator splits into title + description)
  faqs: array — each: { question, answer } — answers support Markdown (bold, links, lists)
  socialLinks: array — each: { platform, url, hoverColor? } — platforms: instagram, linkedin, youtube
  navLinks: array — each: { label, href }
  navColumns: array — each: { heading, href, links: [{ label, href }] }

Page text folder structure:
  landing/        — homepage sections (hero, what-is-bears, latest-news, meet-the-team, testimonials, become-sponsor)
  about-us/       — about page (about-us-title, our-mission, whats-in-it, faq, find-us, faces-of-bears)
  events/         — events page (events-title, events-intro, events-crosslink, events-empty-state)
  projects/       — projects page (projects-title, categories-intro, category-*, projects-crosslink, projects-empty-state)
  sponsors/       — sponsors page (sponsors-title, sponsors-intro, sponsor-tiers, sponsors-crosslink, become-sponsor-cta)
  contact/        — contact page (contact-title, contact-info, contact-crosslink)
  media/          — media page (media-title)
  footer/         — footer (navigation, footer-address, bottom-bar)
  site/           — site-wide (metadata, social-links — social media links used across the site)
  404/            — 404 page (not-found)
  imprint/        — imprint page
  datenschutz/    — privacy policy page

Naming conventions:
  -title suffix     — page hero header (e.g. events/events-title)
  -crosslink suffix — link banner to another page (e.g. events/events-crosslink)
  -empty-state suffix — message when no items to display
  category- prefix  — project category description (e.g. projects/category-robotics)

Special behaviors:
  {year} in footer/bottom-bar title is replaced with the current year at build time.
  buttonText and buttonHref must both be provided for a button to appear.
  items with " -> " separator are split into title + description; without it, the whole string is the title.

========================================
MDX COMPONENTS (for .mdx event/project posts)
========================================

Import all components at the top of any .mdx file:
import { Accordion, Button, Callout, Carousel, Center, Img, Instagram, Marquee, YouTube, SideBySide, Left, Right } from '@mdx';

Unused imports are removed at build time — no performance cost.

ACCORDION
  items: array of { title, subtitle? (small label), content (Markdown string) } (required)
  defaultOpen: number | null — which item starts expanded (0-indexed)
  allowCloseAll: boolean — whether clicking the open item closes it
  allowMultiple: boolean — allow multiple items open at once (default false)
  width: CSS string (default "100%")
  Content field supports full Markdown: bold, links, lists, code.

BUTTON
  content: string — button text (or use a slot)
  href: string — if provided renders as <a> link, otherwise <button>
  variant: "primary" | "secondary" | "inverse" (default "primary")
  size: "standard" | "large" | "xlarge" (default "standard")
  disabled: boolean (default false)

CALLOUT
  title: string (optional bold heading)
  Slot for body content (Markdown, nested components).
  Renders as a glass-style card with gradient accent bar.

CAROUSEL
  autoScroll: boolean (default false, pauses on hover)
  autoScrollInterval: number in ms (default 5000)
  showArrows: boolean (default true)
  showDots: boolean (default true)
  height: "sm" (300px) | "md" (400px) | "lg" (500px) | "xl" (600px) | "auto" (default "md")
  Each direct child becomes a slide. Supports swipe on mobile.

CENTER
  Wraps content in a centered flex container. Accepts a class prop.

IMG
  src: imported image (required) — use: import myPhoto from '@assets/events/photo.jpg';
  alt: string (required)
  width: CSS string (default "100%")
  sizes: string — responsive sizes hint
  widths: number[] — srcset widths (default [240, 480, 720, 960, 1280, 1920, 2560])
  enableClickToEnlarge: boolean (default true) — click opens full-size modal
  loading: "eager" | "lazy" (default "lazy")
  fill: boolean — fill parent container (default false)
  IMPORTANT: images must be imported from src/assets/, never remote URLs.

INSTAGRAM
  url: string (required) — full Instagram URL or shortcode
  size: "small" (380px) | "medium" (460px) | "large" (540px) | "full" (100%) (default "medium")

MARQUEE
  speed: number — pixels per second (default 50)
  gap: CSS string (default "2rem")
  pauseOnHover: boolean (default true)
  height: "sm" (12rem) | "md" (16rem) | "lg" (20rem) | "xl" (24rem) (default "md")
  direction: "left" | "right" (default "left")
  Infinite horizontal scroll. Children are auto-duplicated to fill screen.

YOUTUBE
  id: string (required) — video ID or full URL (youtube.com/watch?v=..., youtu.be/..., etc.)
  title: string — accessibility label (default "YouTube video")
  width: CSS string (default "100%")
  start: number — start time in seconds

SIDEBYSIDE + LEFT + RIGHT
  SideBySide: showDivider (boolean, default true) — vertical line between columns on desktop
  Left / Right: centerVertical (boolean, default false) — vertically center shorter content
  Stacks on mobile, side-by-side on large screens (50/50 split).

========================================
IMAGE RULES
========================================

All images must be local files in src/assets/ subdirectories:
  src/assets/events/              — event cover images
  src/assets/projects/            — project cover images
  src/assets/projects/team-members/ — project team lead portraits (for Meet the Team)
  src/assets/sponsors/{tier}/     — sponsor logos, organized by tier folder (diamond/, platinum/, gold/, silver/, bronze/)
  src/assets/testimonials/        — testimonial portraits
  src/assets/faces-of-bears/         — Faces of BEARS portraits
  src/assets/about-us/our-mission/    — about page mission section images
  src/assets/whatIsBears/         — What is BEARS carousel images
  src/assets/hero/landingpage/    — landing page hero slides (images and videos)
  src/assets/hero/{about-us,contact,events,media,projects,sponsors}/ — sub-page hero images
  src/assets/default-images/      — fallback images when no custom image is provided

Valid image formats: .jpg, .jpeg, .png, .webp
Valid video formats (hero slides only): .mp4, .webm, .ogg
Never use remote/external image URLs.

========================================
KEY CONVENTIONS
========================================

- isDraft: true hides events, projects, and Instagram posts in production (visible in dev).
- Numeric prefixes (01-, 02-, etc.) control display order for hero slides, testimonials, sponsors, and team members. Hero slides sort numerically, not alphabetically.
- FAQ answers and Accordion content support Markdown: **bold**, [links](/path), - bullet lists.
- Sponsor tier is determined by folder name (diamond/, platinum/, gold/, silver/, bronze/), not frontmatter.
- The seoDescription field sets a page's <meta name="description"> tag. Keep it ~150 characters.
- For projects, if displayMeetTheTeam is true then both headOfProject and personImage must also be provided.
````

  </div>
  <div x-show="!expanded" style="position: absolute; bottom: 0; left: 0; right: 0; height: 5rem; background: linear-gradient(to top, #24292e 10%, transparent); pointer-events: none; transition: opacity 0.2s ease;"></div>
</div>
