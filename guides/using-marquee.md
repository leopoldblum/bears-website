> **For Content Creators**
>
> **Looking for technical details?** See [Marquee Component Documentation](../src/components/mdx/Marquee.md) for developers.

# Using Marquees in MDX Content

A quick guide for adding infinite scrolling content showcases to your pages.

## What is a Marquee?

A Marquee creates a **smooth, continuous horizontal scrolling effect** that loops infinitely. Imagine a never-ending conveyor belt of content moving across your page - that's a Marquee!

**Perfect for:**
- Image galleries and photo showcases
- Sponsor and partner logos
- Any visual content that benefits from continuous movement
- Team member highlights or text-based content

## Quick Start

Every MDX file that uses Marquees needs these imports at the top:

```mdx
---
import Marquee from '@mdx/Marquee.astro'
import Img from '@mdx/Img.astro'
import image1 from '../../assets/photo-1.jpg'
import image2 from '../../assets/photo-2.jpg'
import image3 from '../../assets/photo-3.jpg'
---

# Your Page Title

Your content here...

<Marquee speed={60} gap="1.5rem" height="14rem">
  <Img src={image1} alt="Description of image 1" class="rounded-lg" />
  <Img src={image2} alt="Description of image 2" class="rounded-lg" />
  <Img src={image3} alt="Description of image 3" class="rounded-lg" />
</Marquee>
```

**Result:** Three images that scroll continuously from right to left in an infinite loop with smooth animation.

**That's it!** The Marquee component automatically handles:
- Setting a consistent height for all items
- Spacing between items
- Smooth, 60fps animation
- Pause on hover

## Understanding the Props

| Prop | What it does | Default |
|------|-------------|---------|
| `speed` | How fast content scrolls (pixels per second). Higher = faster. | `50` |
| `gap` | Space between items | `"2rem"` |
| `height` | Height of the marquee | `"16rem"` |
| `pauseOnHover` | Stop animation when hovering | `true` |
| `direction` | Scroll direction: `"left"` or `"right"` | `"left"` |

## Common Use Cases

### 1. Image Gallery

Display photos in a scrolling gallery.

```mdx
---
import Marquee from '@mdx/Marquee.astro'
import Img from '@mdx/Img.astro'
import gallery1 from '../../assets/gallery-1.jpg'
import gallery2 from '../../assets/gallery-2.jpg'
import gallery3 from '../../assets/gallery-3.jpg'
import gallery4 from '../../assets/gallery-4.jpg'
---

<Marquee speed={60} gap="1.5rem" height="16rem">
  <Img src={gallery1} alt="Gallery Image 1" class="rounded-lg" />
  <Img src={gallery2} alt="Gallery Image 2" class="rounded-lg" />
  <Img src={gallery3} alt="Gallery Image 3" class="rounded-lg" />
  <Img src={gallery4} alt="Gallery Image 4" class="rounded-lg" />
</Marquee>
```

**Looks like:** A continuous stream of photos scrolling smoothly across the page.

**Key features:**
- **Mixed aspect ratios work great** - portrait, landscape, and square images all display correctly
- **Consistent height** - all images are scaled to the same height
- **Proper gaps** - clean spacing between all images

### 2. Sponsor Logos

Display partner and sponsor logos slowly.

```mdx
---
import Marquee from '@mdx/Marquee.astro'
import { Image } from 'astro:assets'
import sponsor1 from '../../assets/sponsors/company-1.png'
import sponsor2 from '../../assets/sponsors/company-2.png'
import sponsor3 from '../../assets/sponsors/company-3.png'
---

<Marquee speed={30} gap="4rem" height="4rem">
  <Image src={sponsor1} alt="Company 1" class="opacity-70 hover:opacity-100" />
  <Image src={sponsor2} alt="Company 2" class="opacity-70 hover:opacity-100" />
  <Image src={sponsor3} alt="Company 3" class="opacity-70 hover:opacity-100" />
</Marquee>
```

**Looks like:** Sponsor logos slowly scrolling by, slightly faded, becoming fully visible on hover.

### 3. Reverse Direction

Scroll right instead of left, or create visual interest with two marquees going opposite directions.

```mdx
<Marquee direction="left" speed={50} height="12rem">
  <!-- Content scrolls left -->
</Marquee>

<Marquee direction="right" speed={40} height="12rem">
  <!-- Content scrolls right -->
</Marquee>
```

### 4. Team Member Cards

Showcase team members in scrolling cards with text.

```mdx
---
import Marquee from '@mdx/Marquee.astro'
---

<Marquee speed={40} gap="2rem" height="auto">
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Sarah Williams</div>
    <div class="text-sm text-neutral-400">Principal Investigator & Project Lead</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Dr. Michael Chen</div>
    <div class="text-sm text-neutral-400">Research Scientist</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Emily Rodriguez</div>
    <div class="text-sm text-neutral-400">Engineering Lead</div>
  </div>
</Marquee>
```

**Note:** For non-image content like cards, add `class="shrink-0"` to prevent items from being squished.

## Customizing Speed

The `speed` prop controls how fast content scrolls in **pixels per second**.

```mdx
<!-- Fast (80-100) - energetic galleries -->
<Marquee speed={80}>...</Marquee>

<!-- Medium (50-60) - balanced default -->
<Marquee speed={50}>...</Marquee>

<!-- Slow (30-40) - logos, readable text -->
<Marquee speed={30}>...</Marquee>
```

**How to choose:**
- **Fast (80+):** Many images, decorative content, high energy
- **Medium (50-60):** Balanced feel, general galleries
- **Slow (30-40):** Sponsor logos, important content, few items

## Customizing Height

The `height` prop sets how tall the marquee is. All items scale to fit.

```mdx
<!-- Small (for logos) -->
<Marquee height="4rem">...</Marquee>

<!-- Medium (default) -->
<Marquee height="16rem">...</Marquee>

<!-- Large (hero galleries) -->
<Marquee height="20rem">...</Marquee>
```

## Customizing Gap

The `gap` prop controls spacing between items.

```mdx
<!-- Tight (badges) -->
<Marquee gap="1rem">...</Marquee>

<!-- Normal (default) -->
<Marquee gap="2rem">...</Marquee>

<!-- Spacious (logos) -->
<Marquee gap="4rem">...</Marquee>
```

## Tips & Best Practices

### Use Enough Items
Have at least 4-6 items for a smooth, seamless loop. With too few items, the loop will be more noticeable.

### Match Speed to Content
- **Images/Photos:** Medium to fast (50-80)
- **Text Cards:** Slow (30-40) with `pauseOnHover={true}`
- **Logos:** Slow (30) with wide gaps

### For Non-Image Content
When using cards or other HTML content (not images), add `class="shrink-0"` to prevent squishing:

```mdx
<Marquee>
  <div class="shrink-0 w-64">Your card content</div>
</Marquee>
```

### Pause on Hover
Enabled by default. Users can hover to stop the animation and interact with content. Disable with `pauseOnHover={false}` for purely decorative marquees.

## Complete Example

```mdx
---
import Marquee from '@mdx/Marquee.astro'
import Img from '@mdx/Img.astro'
import photo1 from '../../assets/event-photos/photo1.jpg'
import photo2 from '../../assets/event-photos/photo2.jpg'
import photo3 from '../../assets/event-photos/photo3.jpg'
import photo4 from '../../assets/event-photos/photo4.jpg'
---

# Our Latest Event

## Event Highlights

Check out some amazing moments from our recent gathering:

<Marquee speed={60} gap="1.5rem" height="14rem">
  <Img src={photo1} alt="Event Photo 1" class="rounded-lg" />
  <Img src={photo2} alt="Event Photo 2" class="rounded-lg" />
  <Img src={photo3} alt="Event Photo 3" class="rounded-lg" />
  <Img src={photo4} alt="Event Photo 4" class="rounded-lg" />
</Marquee>

## Reverse Direction Demo

<Marquee speed={40} gap="2rem" height="12rem" direction="right">
  <Img src={photo3} alt="Event Photo 3" class="rounded-lg" />
  <Img src={photo1} alt="Event Photo 1" class="rounded-lg" />
</Marquee>
```

## Need Help?

**Looking for more technical details?**

See the [Marquee Component Technical Reference](../src/components/mdx/Marquee.md) for developers.
