> **👥 For Content Creators**
>
> **Looking for technical details?** See [Marquee Component Documentation](../src/components/reusable/Marquee.md) for developers.

# Using Marquees in MDX Content

A quick guide for adding infinite scrolling content showcases to your pages.

## What is a Marquee?

A Marquee creates a **smooth, continuous horizontal scrolling effect** that loops infinitely. Imagine a never-ending conveyor belt of content moving across your page - that's a Marquee!

**Perfect for:**
- Image galleries and photo showcases (primary use case)
- Sponsor and partner logos
- Any visual content that benefits from continuous movement
- Team member highlights or text-based content (see HTML examples section)

## Quick Start

Every MDX file that uses Marquees needs these imports at the top:

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import image1 from '../assets/photo-1.jpg'
import image2 from '../assets/photo-2.jpg'
import image3 from '../assets/photo-3.jpg'
---

# Your Page Title

Your content here...

<Marquee
  images={[
    { src: image1, alt: "Description of image 1" },
    { src: image2, alt: "Description of image 2" },
    { src: image3, alt: "Description of image 3" },
  ]}
  duration={18}
  gap="2rem"
/>
```

**Result:** Three images that scroll continuously from right to left in an infinite loop with smooth, optimized performance.

**That's it!** The Marquee component automatically handles:
- Image optimization and responsive sizing
- WebP format conversion for better performance
- Lazy loading for images below the fold
- Proper CSS classes to prevent squishing

## Common Use Cases

### 1. Image Gallery (Recommended)

The Marquee component excels at displaying image galleries. Simply pass an array of images and the component handles all the optimization automatically.

**Basic Usage:**

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import gallery1 from '../assets/gallery-1.jpg'
import gallery2 from '../assets/gallery-2.jpg'
import gallery3 from '../assets/gallery-3.jpg'
import gallery4 from '../assets/gallery-4.jpg'
import gallery5 from '../assets/gallery-5.jpg'
import gallery6 from '../assets/gallery-6.jpg'
---

<Marquee
  images={[
    { src: gallery1, alt: "Gallery Image 1" },
    { src: gallery2, alt: "Gallery Image 2" },
    { src: gallery3, alt: "Gallery Image 3" },
    { src: gallery4, alt: "Gallery Image 4" },
    { src: gallery5, alt: "Gallery Image 5" },
    { src: gallery6, alt: "Gallery Image 6" },
  ]}
  duration={18}
  gap="2rem"
  pauseOnHover={false}
/>
```

**Looks like:** A continuous stream of photos scrolling smoothly across the page. Images are responsive and properly sized for mobile, tablet, and desktop.

**Why This Works Best:**
- **Zero boilerplate:** No need to write `<Image/>` components manually
- **Automatic optimization:** WebP format, lazy loading, and responsive sizing by default
- **Type-safe:** TypeScript ensures you don't forget alt text
- **Consistent styling:** All images use the same optimized classes
- **90% less code** compared to manual approach

**What Happens Automatically:**
- ✅ Responsive sizing: `h-48 sm:h-56 lg:h-64 w-80 sm:w-96`
- ✅ Aspect ratio handling: `object-cover rounded-lg`
- ✅ Flex prevention: `shrink-0` (prevents squishing)
- ✅ WebP format conversion
- ✅ Lazy loading (configurable)

**Customizing Image Styling:**

If you need different sizing (e.g., for sponsor logos), use the `imageClass` prop:

```mdx
<Marquee
  images={[
    { src: logo1, alt: "Company 1" },
    { src: logo2, alt: "Company 2" },
  ]}
  imageClass="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100"
  duration={40}
  gap="4rem"
/>
```

**Recommended Settings:**
- **Duration:** 15-20 seconds for dynamic energy, 25-30 for slower viewing
- **Gap:** "2rem" provides comfortable spacing between images
- **Number of images:** 6-12 images create a smooth, continuous loop

### 2. Sponsor Logos

Display partner and sponsor logos in a continuous loop with custom styling.

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import sponsor1 from '../assets/sponsors/company-1.png'
import sponsor2 from '../assets/sponsors/company-2.png'
import sponsor3 from '../assets/sponsors/company-3.png'
---

<Marquee
  images={[
    { src: sponsor1, alt: "Company 1" },
    { src: sponsor2, alt: "Company 2" },
    { src: sponsor3, alt: "Company 3" },
  ]}
  imageClass="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
  duration={40}
  gap="4rem"
/>
```

**Looks like:** Sponsor logos slowly scrolling by, slightly faded by default, and becoming fully visible on hover.

**Key Differences from Gallery:**
- **`imageClass` override:** Logos need `object-contain` (not `object-cover`) to preserve proportions
- **Fixed dimensions:** `h-16 w-32` keeps logos consistent size
- **Opacity effect:** `opacity-70 hover:opacity-100` adds visual polish

**Tips:**
- Use `duration={40}` for very slow scrolling (easier to read)
- Use `gap="4rem"` for spacious layout
- Always include `shrink-0` in custom classes to prevent squishing

## Using the Slot for Custom HTML Content

While the `images` prop is the simplest way to create image galleries, you can also use Marquee's slot to pass custom HTML content. This is useful for text-based content like team member cards, technology badges, or mixed layouts.

**When to use the slot:**
- Text-heavy content (team cards, testimonials, badges)
- Complex layouts with nested elements
- Mixed content (images + text in cards)
- Custom styling that can't be achieved with `imageClass`

**Note:** For pure image galleries, the `images` prop is simpler and recommended. The slot is for when you need more control or non-image content.

### Team Member Cards

Showcase your team members in scrolling cards with text.

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
</Marquee>
```

**Looks like:** Dark cards with white text scrolling by. When you hover over them, they pause so you can read the names and roles.

**Tips:**
- Use `duration={25}` for slower, more readable scrolling
- Add `pauseOnHover={true}` so users can stop and read
- Keep card widths consistent (they'll auto-size based on content)
- Use `gap="3rem"` for comfortable spacing between cards

### Technology Badges

Show off the technologies and tools you use with simple text badges.

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

Here's a full MDX page that uses Marquees effectively with the new simplified API:

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import Button from '../../components/reusable/Button.astro'
import photo1 from '../assets/event-photos/photo1.jpg'
import photo2 from '../assets/event-photos/photo2.jpg'
import photo3 from '../assets/event-photos/photo3.jpg'
import photo4 from '../assets/event-photos/photo4.jpg'
import photo5 from '../assets/event-photos/photo5.jpg'
import photo6 from '../assets/event-photos/photo6.jpg'
import sponsor1 from '../assets/sponsors/company1.png'
import sponsor2 from '../assets/sponsors/company2.png'
import sponsor3 from '../assets/sponsors/company3.png'
---

# Our Latest Event

## Event Highlights

Check out some amazing moments from our recent gathering:

<Marquee
  images={[
    { src: photo1, alt: "Event Photo 1" },
    { src: photo2, alt: "Event Photo 2" },
    { src: photo3, alt: "Event Photo 3" },
    { src: photo4, alt: "Event Photo 4" },
    { src: photo5, alt: "Event Photo 5" },
    { src: photo6, alt: "Event Photo 6" },
  ]}
  duration={18}
  gap="2rem"
  pauseOnHover={false}
/>

## Special Thanks to Our Sponsors

<Marquee
  images={[
    { src: sponsor1, alt: "Sponsor 1" },
    { src: sponsor2, alt: "Sponsor 2" },
    { src: sponsor3, alt: "Sponsor 3" },
  ]}
  imageClass="h-16 w-32 object-contain shrink-0 opacity-70 hover:opacity-100 transition-opacity"
  duration={40}
  gap="4rem"
/>

<div class="mt-8">
  <Button href="/events">View More Events</Button>
</div>
```

**Look how clean this is!** No manual `<Image/>` components, no repetitive class strings, just simple arrays of images with descriptions.

## Need Help?

**Looking for more technical details or advanced customization?**

See the [Marquee Component Technical Reference](../src/components/reusable/Marquee.md) for developers.
