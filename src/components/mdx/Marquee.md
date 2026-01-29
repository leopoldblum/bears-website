> **For Developers**
>
> **Just need to use Marquees in content?** See the [Using Marquees guide](../../../guides/using-marquee.md) for content creators.

# Marquee Component Technical Reference

## Overview

The Marquee component creates a smooth, infinite horizontal scroll animation for displaying content like images, cards, or any HTML. It uses Alpine.js with `requestAnimationFrame` for buttery-smooth animation that properly handles content of varying sizes and aspect ratios.

**Key Features:**
- **JavaScript-based animation** for precise control and smooth performance
- **Handles mixed aspect ratios** - landscape, portrait, and square images work together
- **Pixel-accurate scrolling** - measures actual content width for seamless loops
- **Configurable speed, gap, height, and direction**
- **Pause on hover** (optional)
- **GPU-accelerated transforms**

## Location

`/src/components/reusable/Marquee.astro`

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | `number` | `50` | Scroll speed in pixels per second. Higher = faster. |
| `gap` | `string` | `"2rem"` | CSS gap value between items. Any valid CSS length. |
| `pauseOnHover` | `boolean` | `true` | Whether to pause animation when hovered. |
| `height` | `string` | `"16rem"` | Height of the marquee container. Items scale to fit. |
| `direction` | `'left' \| 'right'` | `'left'` | Scroll direction. |

## Basic Usage

### In .astro Files

```astro
---
import { Image } from 'astro:assets';
import Marquee from './reusable/Marquee.astro';
import photo1 from '../assets/photo1.jpg';
import photo2 from '../assets/photo2.jpg';
import photo3 from '../assets/photo3.jpg';
---

<Marquee speed={60} gap="1.5rem" height="14rem">
  <Image src={photo1} alt="Photo 1" class="rounded-lg" />
  <Image src={photo2} alt="Photo 2" class="rounded-lg" />
  <Image src={photo3} alt="Photo 3" class="rounded-lg" />
</Marquee>
```

### In .mdx Files

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro';
import Img from '../../components/reusable/Img.astro';
import photo1 from '../../assets/photo1.jpg';
import photo2 from '../../assets/photo2.jpg';
---

<Marquee speed={50} gap="2rem" height="16rem">
  <Img src={photo1} alt="Photo 1" class="rounded-lg" />
  <Img src={photo2} alt="Photo 2" class="rounded-lg" />
</Marquee>
```

## How It Works

### Animation Mechanism

1. **Content Duplication**: The slot content is rendered twice (original + duplicate)
2. **Width Measurement**: On mount, the component measures the actual content width including gaps
3. **Image Load Detection**: Waits for all images to load before measuring (ensures correct dimensions)
4. **requestAnimationFrame Loop**: Smooth 60fps animation that updates position each frame
5. **Seamless Reset**: When position exceeds content width, resets to 0 (imperceptible to user)

### Height Handling

- The `height` prop sets the container height
- All slot items automatically scale to `height: 100%`
- Images use `object-fit: cover` to fill their space
- Width is calculated automatically based on the image's aspect ratio

This means:
- Portrait images will be narrower
- Landscape images will be wider
- All images maintain their natural aspect ratios
- No overlapping or gaps between images

### Direction Support

```astro
<!-- Scroll left (default) -->
<Marquee direction="left">...</Marquee>

<!-- Scroll right -->
<Marquee direction="right">...</Marquee>
```

## Common Patterns

### Image Gallery

```astro
<Marquee speed={60} gap="1.5rem" height="16rem">
  {images.map((img, i) => (
    <Image src={img} alt={`Gallery ${i + 1}`} class="rounded-lg" />
  ))}
</Marquee>
```

### Logo Parade

```astro
<Marquee speed={30} gap="4rem" height="4rem" pauseOnHover={false}>
  {logos.map(logo => (
    <Image src={logo.src} alt={logo.name} class="opacity-70 hover:opacity-100" />
  ))}
</Marquee>
```

### Card Layout

```astro
<Marquee speed={40} gap="2rem" height="auto">
  {cards.map(card => (
    <div class="shrink-0 w-72 p-4 bg-neutral-800 rounded-lg">
      <h3>{card.title}</h3>
      <p>{card.description}</p>
    </div>
  ))}
</Marquee>
```

### Reverse Direction Pair

Create visual interest with two marquees going opposite directions:

```astro
<Marquee direction="left" speed={50}>...</Marquee>
<Marquee direction="right" speed={40}>...</Marquee>
```

## Accessibility

- The duplicate content set has `aria-hidden="true"` to prevent screen readers from announcing content twice
- `pauseOnHover` allows users to stop the animation to interact with content
- Consider adding `prefers-reduced-motion` media query support if needed

## Performance

- Uses `will-change: transform` for GPU acceleration
- `requestAnimationFrame` ensures smooth 60fps animation
- Only transforms are animated (no layout recalculation)
- Resize handling includes measurement recalculation

## Troubleshooting

### Images Not Showing Correct Size
Ensure images have loaded. The component waits for images to load before measuring, but if images are very slow, the initial measurement may be off. The component includes resize handling that will remeasure.

### Animation Jumps at Loop Point
This usually means the content width measurement was incorrect. Check that:
- All images have loaded
- Gap value is valid CSS
- No dynamic content changes after mount

### Too Fast / Too Slow
Adjust the `speed` prop. Speed is in pixels per second:
- 30: Slow, good for logos
- 50: Medium (default)
- 80: Fast, good for galleries
- 100+: Very fast

## Migration from Previous Version

The previous version used CSS-only animation and an `images` prop. The new version:

1. **Removed `images` prop** - Use slot instead
2. **Removed `duration` prop** - Replaced with `speed` (pixels per second)
3. **Added `direction` prop** - Supports `'left'` or `'right'`
4. **Uses Alpine.js** - Requires Alpine.js (already included in project)

### Before (old API)
```astro
<Marquee
  images={[{ src: img1, alt: "..." }, { src: img2, alt: "..." }]}
  duration={20}
/>
```

### After (new API)
```astro
<Marquee speed={60}>
  <Image src={img1} alt="..." class="rounded-lg" />
  <Image src={img2} alt="..." class="rounded-lg" />
</Marquee>
```
