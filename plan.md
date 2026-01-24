# PostShowcase Component Redesign Plan

## Overview
Enhance the PostShowcase component by incorporating the sophisticated design patterns from the FilterMenu, CategoryFilter, and SortMenu components. The goal is visual consistency and a more polished, modern feel.

## Files to Modify
1. `src/components/PostShowcase.astro` - Main component updates
2. `src/styles/global.css` - Add entrance animations

---

## Design Improvements

### 1. Badge Redesign (Glass-morphism Style)

**Current:** `bg-black/70 backdrop-blur-sm rounded-full shadow-md`

**New Design:**
- Stronger blur: `backdrop-blur-xl`
- Subtle border: `border border-white/10`
- Pill shape: `rounded-md` (matches filter chips)
- Enhanced shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.3)]`
- Status badges get accent glow: `shadow-[0_0_12px_rgba(197,14,31,0.35),0_4px_12px_rgba(0,0,0,0.3)]`
- Status badge icons use accent color: `text-bears-accent`

### 2. Card Entrance Animation

Add staggered fade-in animation similar to filter chips:

```css
.showcase-card {
  animation: showcaseCardIn 0.4s ease-out both;
}

@keyframes showcaseCardIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

CSS-only stagger for grid items (up to 6 items, matching pagination).

### 3. Enhanced Hover Effects

**Current:** `shadow-[0_4px_6px_-2px_rgba(255,255,255,0.1)]` + `brightness-110`

**New Design:**
- Remove `brightness-110` (looks washed out)
- Base shadow: `shadow-[0_4px_12px_rgba(0,0,0,0.4)]`
- Hover shadow with accent glow: `shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(197,14,31,0.15)]`
- Accent border on hover: `border border-transparent lg:hover:border-bears-accent/30`
- Subtle scale: `lg:hover:scale-[1.02]`
- Image zoom: `lg:group-hover:scale-105` with `transition-transform duration-500`

### 4. Content Overlay Enhancement

**Current:** Complex multi-stop gradient

**New Design:**
- Simplified gradient: `from-black/95 via-black/80 to-transparent`
- Add subtle glass effect: `backdrop-blur-[2px]`

### 5. Typography Refinements

- Add `tracking-tight` to title for tighter letter spacing
- Reduce title margin: `mb-3` -> `mb-2`
- Faster color transition: `duration-200`
- Slightly muted description: `text-bears-text-onDark/80`
- Add `line-clamp-3` for safety

---

## Implementation Steps

1. **Update PostShowcase.astro**
   - Add `showcase-card` class to wrapper
   - Update badge styles (all three badges)
   - Add border and enhanced shadow classes to wrapper
   - Add image hover scale effect
   - Update content overlay gradient
   - Refine typography classes

2. **Update global.css**
   - Add `showcaseCardIn` keyframes
   - Add `.showcase-card` animation class
   - Add stagger delays for grid items
   - Add reduced-motion media query

---

## Performance Notes
- `backdrop-blur` used sparingly on small badge areas
- All transforms are GPU-accelerated
- Respects `prefers-reduced-motion`
- No JavaScript changes required

## Compatibility
- No prop changes - all pages using PostShowcase work unchanged
- Mobile-first: all hover effects use `lg:` prefix
