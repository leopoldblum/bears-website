---
title: "Styling & Theming"
description: "Tailwind CSS v4 configuration, color tokens, animations, and responsive strategy."
order: 31
group: "Patterns"
---

The project uses Tailwind CSS v4 via the `@tailwindcss/vite` plugin. All theme customization lives in `src/styles/global.css`.

## Color Tokens

Custom colors are defined in a `@theme` block and available as Tailwind utility classes (e.g., `bg-bears-bg`, `text-bears-accent`):

| Token | Value | Usage |
|-------|-------|-------|
| `bears-bg` | `#121212` | Page background |
| `bears-bg-light` | `#F5F5F5` | Light background variant |
| `bears-text-onLight` | `#2B2B2B` | Text on light backgrounds |
| `bears-text-onDark` | `#E1E1E1` | Text on dark backgrounds |
| `bears-accent` | `#C50E1F` | Primary accent (BEARS red) |
| `bears-accent-muted` | `#A00B19` | Muted accent variant |
| `bears-bg-surface` | `#1F1F1F` | Surface-level background |
| `bears-bg-elevated` | `#303030` | Elevated surface background |

## Custom Utilities

### Scrollbar

```css
@utility scrollbar-bears-thin {
  @apply scrollbar-thin scrollbar-thumb-gray-200/10 scrollbar-track-transparent;
}
```

Used on scrollable containers (docs sidebar, code blocks) for a minimal, dark scrollbar.

## Plugins

- `@tailwindcss/typography` &mdash; Prose styling (used in PostLayout and DocsLayout)
- `tailwind-scrollbar` &mdash; Custom scrollbar styles

## Animation System

All entrance animations are defined as keyframes in `global.css`. Each animation class is applied to its corresponding component and supports stagger delays via `animation-delay`.

| Class | Duration | Effect | Used by |
|-------|----------|--------|---------|
| `.filter-chip` | 0.25s | translateY(4px) + fade | Filter chips in FilterMenu |
| `.filter-group` | 0.3s | translateX(-8px) + fade | Filter group headers |
| `.sort-option` | 0.2s | translateX(-6px) + fade | Sort menu options |
| `.nav-link` | 0.25s | translateX(-8px) + fade | Mobile nav links |
| `.accordion-item` | 0.3s | translateY(8px) + fade | Accordion items |
| `.showcase-card` / `.face-card` | 0.28s | translateY(8px) + scale(0.98) + fade | Post cards, face cards |
| `.post-container` | 0.5s | translateY(12px) + fade | Post detail page |
| `.metadata-card` | 0.4s (0.15s delay) | translateY(8px) + fade | Post metadata sidebar |
| `.contact-card` | 0.35s | translateY(10px) + fade | Contact page cards |
| `.search-result` | 0.15s | translateY(4px) + fade | Search dropdown results |
| `.sponsor-card` | 0.3s | translateY(8px) + scale(0.97) + fade | Sponsor logos |

All animations use `ease-out` timing and `animation-fill-mode: both`.

## Stagger Pattern

Components apply incremental `animation-delay` to create stagger effects:

```astro
{items.map((item, i) => (
  <div class="showcase-card" style={`animation-delay: ${i * 60}ms`}>
    ...
  </div>
))}
```

## Responsive Breakpoint Strategy

The project follows a mobile-first approach with specific breakpoint guidelines:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Base | < 640px | Mobile styles (default) |
| `sm:` | 640px+ | Minor adjustments (spacing, font sizes) |
| `lg:` | 1024px+ | Major layout changes (column direction, grid columns) |
| `xl:` | 1280px+ | Optional refinements for large screens |

**Skip `md:` for layout.** The 768px&ndash;1024px range often creates cramped layouts on tablets. Use `sm:` + `lg:` for structural changes:

```html
<!-- Good: skip md: for layout -->
<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">

<!-- Avoid: md: creates awkward tablet layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

Reserve `md:` for fine-tuning (spacing, font sizes), not structural changes.

## Headline Spacing

All h2 section headings use a consistent bottom margin:

```html
<h2 class="mb-8 sm:mb-10 lg:mb-14">Section Title</h2>
```

This provides `32px` &rarr; `40px` &rarr; `56px` across breakpoints for a coherent visual rhythm.

## Focus Indicators

Global keyboard focus styles are defined in `@layer base`:

```css
a:focus-visible, button:focus-visible, input:focus-visible, ... {
  outline: 2px solid var(--color-bears-accent);
  outline-offset: 2px;
}
```

## Firefox Compatibility

Firefox has poor compositor performance with `backdrop-filter`. A `@supports (-moz-appearance: none)` block disables `backdrop-filter` on `.showcase-badge` and replaces it with a solid semi-transparent background:

```css
@supports (-moz-appearance: none) {
  .showcase-badge {
    backdrop-filter: none !important;
    background-color: rgba(0, 0, 0, 0.75);
  }
}
```

## Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- All entrance animations (`.showcase-card`, `.accordion-item`, `.nav-link`, etc.) are set to `animation: none`
- Button transitions use near-zero duration (`0.01ms`)
- Button transforms are disabled
- Alpine.js animation code checks the media query and skips transitions

## Pagefind Search Highlights

Search excerpt highlights use the BEARS accent color at 30% opacity:

```css
.search-excerpt mark {
  background-color: color-mix(in srgb, var(--color-bears-accent) 30%, transparent);
}
```
