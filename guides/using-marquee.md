> **👥 For Content Creators**
>
> **Looking for technical details?** See [Marquee Component Documentation](../src/components/reusable/Marquee.md) for developers.

# Using Marquees in MDX Content

A quick guide for adding infinite scrolling content showcases to your pages.

## What is a Marquee?

A Marquee creates a **smooth, continuous horizontal scrolling effect** that loops infinitely. Imagine a never-ending conveyor belt of content moving across your page - that's a Marquee!

**Perfect for:**
- Image galleries and photo showcases
- Sponsor and partner logos
- Team member highlights
- Client testimonials
- Technology/tool badges
- Any content that benefits from continuous visual movement

## Quick Start

Every MDX file that uses Marquees needs this import at the top:

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
---

# Your Page Title

Your content here...

<Marquee>
  <div class="shrink-0 w-64 h-48 bg-neutral-800 rounded-lg p-4">Item 1</div>
  <div class="shrink-0 w-64 h-48 bg-neutral-800 rounded-lg p-4">Item 2</div>
  <div class="shrink-0 w-64 h-48 bg-neutral-800 rounded-lg p-4">Item 3</div>
</Marquee>
```

**Result:** Three cards that scroll continuously from right to left in an infinite loop.

**Important:** Always add the `shrink-0` class to your items to prevent them from squishing!

## Common Use Cases

### 1. Image Gallery

Display a collection of images in a smooth scrolling showcase.

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import { Image } from 'astro:assets'
import gallery1 from '../assets/gallery-1.jpg'
import gallery2 from '../assets/gallery-2.jpg'
import gallery3 from '../assets/gallery-3.jpg'
import gallery4 from '../assets/gallery-4.jpg'
---

<Marquee duration={15} gap="2rem">
  <Image
    src={gallery1}
    alt="Gallery Image 1"
    class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={gallery2}
    alt="Gallery Image 2"
    class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={gallery3}
    alt="Gallery Image 3"
    class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={gallery4}
    alt="Gallery Image 4"
    class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
</Marquee>
```

**Looks like:** A continuous stream of photos scrolling smoothly across the page. Images are responsive and properly sized for mobile, tablet, and desktop.

**Tips:**
- Use `duration={15}` for a faster scroll (good for many images)
- Always use the Astro `Image` component for optimization
- Include `loading="lazy"` for images below the fold
- Use `format="webp"` for better performance

### 2. Team Member Cards

Showcase your team members in scrolling cards.

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
---

<Marquee duration={25} gap="3rem" pauseOnHover={true}>
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
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">James Anderson</div>
    <div class="text-sm text-neutral-400">Data Analyst</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Lisa Thompson</div>
    <div class="text-sm text-neutral-400">Systems Engineer</div>
  </div>
</Marquee>
```

**Looks like:** Dark cards with white text scrolling by. When you hover over them, they pause so you can read the names and roles.

**Tips:**
- Use `duration={25}` for slower, more readable scrolling
- Add `pauseOnHover={true}` so users can stop and read
- Keep card widths consistent (they'll auto-size based on content)
- Use `gap="3rem"` for comfortable spacing between cards

### 3. Sponsor Logos

Display partner and sponsor logos in a continuous loop.

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import { Image } from 'astro:assets'
import sponsor1 from '../assets/sponsors/company-1.png'
import sponsor2 from '../assets/sponsors/company-2.png'
import sponsor3 from '../assets/sponsors/company-3.png'
---

<Marquee duration={40} gap="4rem">
  <Image
    src={sponsor1}
    alt="Company 1"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
  <Image
    src={sponsor2}
    alt="Company 2"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
  <Image
    src={sponsor3}
    alt="Company 3"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
</Marquee>
```

**Looks like:** Sponsor logos slowly scrolling by, slightly faded by default, and becoming fully visible on hover.

**Tips:**
- Use `duration={40}` for very slow scrolling (easier to read)
- Use `gap="4rem"` for spacious layout
- Add `opacity-70 hover:opacity-100` for a subtle hover effect
- Use `object-contain` to preserve logo proportions

### 4. Technology Badges

Show off the technologies and tools you use.

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
---

<Marquee duration={12} gap="1.5rem">
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    React
  </div>
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    TypeScript
  </div>
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    Astro
  </div>
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    Tailwind CSS
  </div>
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    Node.js
  </div>
  <div class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md text-sm font-medium text-neutral-200">
    Docker
  </div>
</Marquee>
```

**Looks like:** Small badge-like pills with technology names scrolling quickly across the screen.

**Tips:**
- Use `duration={12}` for fast movement (creates energy)
- Use smaller `gap="1.5rem"` for a tighter, badge-like feel
- Keep badges small and consistent in size

## Customizing the Marquee

### Changing Speed (duration)

The `duration` prop controls how fast content scrolls. **Higher numbers = slower scrolling.**

```mdx
<!-- Very fast (10-15 seconds) -->
<Marquee duration={10}>
  {/* Good for: Many items, creating energy and movement */}
</Marquee>

<!-- Medium speed (25-30 seconds) - Default is 30 -->
<Marquee duration={25}>
  {/* Good for: Readable text, team cards, general content */}
</Marquee>

<!-- Slow (40-60 seconds) -->
<Marquee duration={50}>
  {/* Good for: Logos, important information, fewer items */}
</Marquee>
```

**How to choose:**
- **Fast (10-15):** Many images, decorative content, high energy
- **Medium (25-30):** Team cards, mixed content, balanced feel
- **Slow (40-60):** Sponsor logos, important content, few items

### Adjusting Spacing (gap)

The `gap` prop controls the space between items. You can use any CSS length unit.

```mdx
<!-- Tight spacing -->
<Marquee gap="1rem">
  {/* Items are close together */}
</Marquee>

<!-- Normal spacing (default is "2rem") -->
<Marquee gap="2rem">
  {/* Comfortable spacing for most content */}
</Marquee>

<!-- Spacious -->
<Marquee gap="4rem">
  {/* Lots of breathing room between items */}
</Marquee>
```

**Common values:**
- `"1rem"` - Tight, compact (technology badges)
- `"2rem"` - Default, balanced (images, general use)
- `"3rem"` - Comfortable (cards with text)
- `"4rem"` - Spacious (logos, featured content)

### Pause on Hover (pauseOnHover)

Control whether the animation stops when users hover over it.

```mdx
<!-- Pause on hover (default is true) -->
<Marquee pauseOnHover={true}>
  {/* Animation stops when you hover, resumes when you move away */}
</Marquee>

<!-- Never pause -->
<Marquee pauseOnHover={false}>
  {/* Animation continues even when hovering */}
</Marquee>
```

**When to use:**
- **`pauseOnHover={true}`** - Text content, team cards, anything users need to read
- **`pauseOnHover={false}`** - Purely decorative content, background elements

**Note:** Pause on hover doesn't work on touch devices (phones/tablets) since there's no hover state.

## Combining All Options

You can customize all three options together:

```mdx
<Marquee duration={20} gap="2.5rem" pauseOnHover={true}>
  <div class="shrink-0 w-64 h-32 bg-neutral-800 rounded-lg p-4">
    Your content here
  </div>
  {/* More items... */}
</Marquee>
```

**Decision guide:**
1. **What type of content?** → Choose speed (duration)
2. **How dense should it feel?** → Choose spacing (gap)
3. **Do users need to read it?** → Enable pause on hover

## Tips & Best Practices

### Content Considerations

**Use consistent widths:**
Always add `shrink-0` class and set explicit widths (`w-64`, `w-72`, etc.) to prevent items from squishing.

```mdx
<!-- Good: Fixed width with shrink-0 -->
<div class="shrink-0 w-64">Content</div>

<!-- Bad: No width, will squish -->
<div>Content</div>
```

**Include enough items:**
Have at least 5-6 items for a smooth, seamless loop. With too few items, the loop will be more noticeable.

### Performance

**Optimize images:**
- Use `loading="lazy"` for images not visible on initial page load
- Use `format="webp"` for smaller file sizes
- Don't put too many large images (stick to 8-12 max)

**Keep it light:**
Avoid putting 50+ items in a single Marquee. If you need that many, consider breaking them into multiple Marquees or using a different component.

### Design

**Match gap to content type:**
- Small items (badges): smaller gaps (`1rem` - `1.5rem`)
- Medium items (cards): normal gaps (`2rem` - `3rem`)
- Large items (featured): bigger gaps (`3rem` - `4rem`)

**Consider reading speed:**
If your content has text that users need to read, use slower durations (40+) and enable `pauseOnHover`.

**Ensure sufficient contrast:**
Make sure your content is readable against the background. Use the BEARS color scheme for consistency.

## Import Path Guide

The import path depends on where your MDX file is located:

```mdx
<!-- From /src/content/posts/projects/ -->
import Marquee from '../../../components/reusable/Marquee.astro'

<!-- From /src/content/posts/events/ -->
import Marquee from '../../../components/reusable/Marquee.astro'

<!-- From /src/pages/ -->
import Marquee from '../components/reusable/Marquee.astro'
```

**Quick tip:** Count how many folders deep your file is from `/src/`, then use that many `../` to go back up, then add `components/reusable/Marquee.astro`.

## Complete Example

Here's a full MDX page that uses Marquees effectively:

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import Button from '../../components/reusable/Button.astro'
import { Image } from 'astro:assets'
import photo1 from '../assets/event-photos/photo1.jpg'
import photo2 from '../assets/event-photos/photo2.jpg'
import photo3 from '../assets/event-photos/photo3.jpg'
import photo4 from '../assets/event-photos/photo4.jpg'
import sponsor1 from '../assets/sponsors/company1.png'
import sponsor2 from '../assets/sponsors/company2.png'
import sponsor3 from '../assets/sponsors/company3.png'
---

# Our Latest Event

## Event Highlights

Check out some amazing moments from our recent gathering:

<Marquee duration={15} gap="2rem">
  <Image
    src={photo1}
    alt="Event Photo 1"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={photo2}
    alt="Event Photo 2"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={photo3}
    alt="Event Photo 3"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
  <Image
    src={photo4}
    alt="Event Photo 4"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
    loading="lazy"
    format="webp"
  />
</Marquee>

## Our Team

Meet the people who made it happen:

<Marquee duration={30} gap="3rem" pauseOnHover={true}>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Alex Johnson</div>
    <div class="text-sm text-neutral-400">Event Coordinator</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Maria Garcia</div>
    <div class="text-sm text-neutral-400">Technical Lead</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">David Kim</div>
    <div class="text-sm text-neutral-400">Logistics Manager</div>
  </div>
</Marquee>

## Special Thanks to Our Sponsors

<Marquee duration={40} gap="4rem">
  <Image
    src={sponsor1}
    alt="Sponsor 1"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
  <Image
    src={sponsor2}
    alt="Sponsor 2"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
  <Image
    src={sponsor3}
    alt="Sponsor 3"
    class="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
    loading="lazy"
  />
</Marquee>

<div class="mt-8">
  <Button href="/events">View More Events</Button>
</div>
```

## Need Help?

**Looking for more technical details or advanced customization?**

See the [Marquee Component Technical Reference](../src/components/reusable/Marquee.md) for developers.
