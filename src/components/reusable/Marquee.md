> **🔧 For Developers**
>
> **Just need to use Marquees in content?** See the [Using Marquees guide](../../../guides/using-marquee.md) for content creators.

# Marquee Component Technical Reference

## Overview

The Marquee component is a lightweight, CSS-only infinite horizontal auto-scroll component that provides seamless looping animations for content showcases. It uses pure CSS animations with no JavaScript dependencies, making it highly performant and reliable.

**Key Features:**
- Pure CSS animation (no Alpine.js or JavaScript runtime)
- GPU-accelerated transforms for smooth performance
- Seamless infinite loop via content duplication technique
- Configurable speed, spacing, and hover behavior
- Accessible with ARIA attributes
- Works with any slot content (images, cards, text, etc.)

## Location

`/src/components/reusable/Marquee.astro`

## Basic Usage

### In .astro Files

```astro
---
import Marquee from './reusable/Marquee.astro';
import { Image } from 'astro:assets';
import photo1 from '../assets/photo1.jpg';
---

<Marquee duration={20} gap="2rem">
  <Image
    src={photo1}
    alt="Photo 1"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
  />
  {/* More items... */}
</Marquee>
```

### In .mdx Files

```mdx
---
import Marquee from '../../components/reusable/Marquee.astro'
import { Image } from 'astro:assets'
import photo1 from '../assets/photo1.jpg'
---

<Marquee duration={20} gap="2rem">
  <Image
    src={photo1}
    alt="Photo 1"
    class="h-64 w-96 object-cover rounded-lg shrink-0"
  />
</Marquee>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `30` | Animation duration in seconds. Higher values = slower scrolling. |
| `gap` | `string` | `"2rem"` | CSS gap value between items. Any valid CSS length unit (`"1rem"`, `"24px"`, `"3em"`, etc.). |
| `pauseOnHover` | `boolean` | `true` | Whether to pause the animation when the user hovers over the marquee. |

## Features

### 1. Seamless Infinite Scroll

The Marquee uses a content duplication technique to create a seamless infinite loop:

**How it works:**
1. The component renders your content twice (original + duplicate)
2. Both sets are placed side-by-side in a flex container
3. The animation translates the entire track by -50% (exactly one content set width)
4. When the animation completes, the duplicate set is in the exact position where the original started
5. The animation loops, creating a seamless effect

**Visual representation:**
```
Initial:  [Set 1] [Set 2]
          ^
Midpoint: [Set 1] [Set 2]
                  ^
End:      [Set 1] [Set 2]
                          ^
Loop:     [Set 1] [Set 2]  (back to start, but Set 2 is now visible where Set 1 was)
          ^
```

This technique is more reliable than alternatives like JavaScript-based position resets or using multiple animation keyframes.

### 2. CSS-Only Animation

The Marquee uses pure CSS keyframe animations with no JavaScript:

```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

**Benefits:**
- No JavaScript runtime overhead
- No dependency on Alpine.js or other frameworks
- Animation runs on the GPU (hardware-accelerated)
- Works even if JavaScript is disabled
- Simpler debugging and maintenance
- Lower memory footprint

### 3. GPU Acceleration

The component uses `will-change: transform` to hint to the browser that the transform property will animate:

```css
.marquee-track {
  will-change: transform;
}
```

**Benefits:**
- Browser pre-optimizes rendering for the animation
- Animation is offloaded to the GPU
- Smoother frame rates, especially on lower-end devices
- Reduced CPU usage
- Better battery life on mobile devices

**Note:** `will-change` should be used sparingly as it consumes memory. This component uses it appropriately since the animation is continuous and expected.

### 4. Responsive by Default

The Marquee automatically adapts to:
- Container width changes
- Viewport size changes
- Responsive child elements (using Tailwind breakpoints)
- Dynamic content loading

No media queries or breakpoint-specific logic needed in the component itself.

## Technical Details

### Animation Mechanism

**CSS Keyframes:**
```css
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

**Why -50%?**
- The track contains two identical content sets
- Total width = 200% of one content set
- Translating by -50% moves exactly one content set width
- When animation restarts, duplicate set is where original was
- Creates perfect seamless loop

**Animation application:**
```css
.marquee-track {
  animation: marquee-scroll var(--duration) linear infinite;
}
```

- `linear` timing function = constant speed (no easing)
- `infinite` = loops forever
- `var(--duration)` = user-configurable speed

### CSS Variables (define:vars)

Astro's `define:vars` directive injects props as CSS custom properties:

```astro
<style define:vars={{ duration: `${duration}s`, gap }}>
  .marquee-track {
    animation: marquee-scroll var(--duration) linear infinite;
    gap: var(--gap);
  }
</style>
```

**Conversion:**
- `duration` prop (number) → `--duration` CSS variable with `s` suffix
- `gap` prop (string) → `--gap` CSS variable (passed through as-is)

This allows dynamic prop-to-CSS conversion without inline styles.

### Layout Structure

**HTML structure:**
```html
<div class="marquee-container">         <!-- Overflow hidden -->
  <div class="marquee-track">           <!-- Animated flex container -->
    <div class="marquee-items">         <!-- First content set -->
      <slot />
    </div>
    <div class="marquee-items" aria-hidden="true">  <!-- Duplicate -->
      <slot />
    </div>
  </div>
</div>
```

**CSS breakdown:**

```css
.marquee-container {
  width: 100%;           /* Full container width */
  overflow: hidden;      /* Hide content outside bounds */
}

.marquee-track {
  display: flex;         /* Horizontal layout */
  gap: var(--gap);       /* Space between item sets */
  width: max-content;    /* Shrink-wrap to content */
  animation: marquee-scroll var(--duration) linear infinite;
  will-change: transform;
}

.marquee-items {
  display: flex;         /* Horizontal item layout */
  gap: var(--gap);       /* Space between items */
  flex-shrink: 0;        /* Never compress */
}
```

**Key insights:**
- `overflow: hidden` on container clips content outside viewport
- `width: max-content` on track ensures it's exactly as wide as content
- `flex-shrink: 0` on items prevents compression during animation
- Double `gap` application (track + items) spaces both sets and items within sets

## Accessibility

### ARIA Attributes

The duplicate content set includes `aria-hidden="true"`:

```html
<div class="marquee-items" aria-hidden="true">
  <slot />
</div>
```

**Purpose:**
- Prevents screen readers from announcing content twice
- Only the first content set is accessible to assistive technology
- Users hear/navigate content once, not twice

**Browser behavior:**
- Visual rendering: Both sets visible and animated
- Accessibility tree: Only first set present
- Keyboard navigation: Only first set's interactive elements in tab order

### Keyboard Navigation

Interactive elements (links, buttons) within Marquee items remain keyboard accessible:

```astro
<Marquee>
  <a href="/project-1" class="shrink-0">
    <img src="..." alt="Project 1" />
  </a>
  <a href="/project-2" class="shrink-0">
    <img src="..." alt="Project 2" />
  </a>
</Marquee>
```

**Behavior:**
- Tab key navigates through interactive elements in first content set
- Second set is `aria-hidden`, so interactive elements are skipped
- Focus styles still visible on moving elements
- `pauseOnHover={true}` helps users click moving targets

### Motion Preferences

**Current status:** The component does not currently respect `prefers-reduced-motion`.

**Future enhancement:**
```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
```

This would stop the animation for users who prefer reduced motion, but would require handling the visual layout (show all items, or just first set?).

**Recommendation:** For critical content, consider:
1. Providing a static alternative view
2. Adding a toggle button to stop/start animation
3. Using slower durations as default

### Screen Reader Considerations

**Limitations:**
- Content scrolls continuously, may be announced while off-screen
- Users can't control animation speed via screen reader
- No audio indication of animation state

**Best practices:**
- Use Marquee for supplementary/decorative content only
- Don't put critical information exclusively in a Marquee
- Provide alternative navigation (e.g., links to all team members)
- Use descriptive `alt` text for images
- Consider adding a "View all" button below the Marquee

## Styling

### Container Classes

The container should not need additional classes, but you can wrap it:

```astro
<div class="my-12">
  <Marquee>
    {/* Content */}
  </Marquee>
</div>
```

### Track Classes

The track is managed internally and should not be styled directly.

### Item Classes

**Required classes on children:**
- `shrink-0` - Prevents flex compression (critical!)
- Width class (`w-64`, `w-96`, etc.) - Sets consistent item width

**Example:**
```astro
<Marquee>
  <div class="shrink-0 w-64 h-48 bg-neutral-800 rounded-lg">
    Item content
  </div>
</Marquee>
```

**Common patterns:**
```css
/* For images */
class="shrink-0 h-64 w-96 object-cover rounded-lg"

/* For cards */
class="shrink-0 w-80 px-6 py-4 bg-neutral-800 rounded-lg"

/* For logos */
class="shrink-0 h-16 w-32 object-contain"

/* For badges */
class="shrink-0 px-4 py-2 bg-neutral-800 rounded-md"
```

## Common Patterns

### 1. Image Gallery

From [src/components/WhatIsBears.astro:31-41](../../components/WhatIsBears.astro#L31-L41):

```astro
---
import Marquee from './reusable/Marquee.astro';
import { Image } from 'astro:assets';
import { whatIsBearsImages } from '../utils/imageGlobs';
import { loadAllImagesFromDirectory } from '../utils/imageLoader';

const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
---

<Marquee duration={15} gap="2rem">
  {carouselImages.map((img, index) => (
    <Image
      src={img}
      alt={`BEARS Gallery ${index + 1}`}
      class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover rounded-lg shrink-0"
      loading="eager"
      format="webp"
    />
  ))}
</Marquee>
```

**Key aspects:**
- Fast duration (15s) for many images
- Responsive sizing with Tailwind breakpoints
- `object-cover` to fill frame while maintaining aspect ratio
- `loading="eager"` since it's above the fold
- Maps over dynamic image array

### 2. Card Layout

From project MDX files (team member cards):

```astro
<Marquee duration={25} gap="3rem" pauseOnHover={true}>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Sarah Williams</div>
    <div class="text-sm text-neutral-400">Principal Investigator & Project Lead</div>
  </div>
  <div class="shrink-0 px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700">
    <div class="font-semibold text-white">Dr. Michael Chen</div>
    <div class="text-sm text-neutral-400">Research Scientist</div>
  </div>
  {/* More team members... */}
</Marquee>
```

**Key aspects:**
- Slower duration (25s) for readable text
- Larger gap (3rem) for comfortable spacing
- `pauseOnHover={true}` for text readability
- Consistent card styling with BEARS colors
- Auto-width based on content (no explicit width)

### 3. Logo Showcase

```astro
---
import Marquee from './reusable/Marquee.astro';
import { Image } from 'astro:assets';
import sponsor1 from '../assets/sponsors/company1.png';
import sponsor2 from '../assets/sponsors/company2.png';
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
</Marquee>
```

**Key aspects:**
- Very slow duration (40s+) for logo visibility
- Large gap (4rem) for spacious layout
- `object-contain` to preserve logo aspect ratio
- Opacity effect for visual polish
- Fixed dimensions for consistency

### 4. Mixed Content

```astro
<Marquee duration={20} gap="2rem">
  <div class="shrink-0 w-96 bg-neutral-800 rounded-lg overflow-hidden">
    <Image
      src={projectImage}
      alt="Project"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="font-semibold text-white">Project Title</h3>
      <p class="text-sm text-neutral-400">Description text</p>
    </div>
  </div>
  {/* More cards... */}
</Marquee>
```

**Key aspects:**
- Fixed card width for consistency
- Image + text combination
- Structured card layout
- Medium speed for mixed content

## Advanced Usage

### Dynamic Content Loading

Load content from Astro content collections:

```astro
---
import { getCollection } from 'astro:content';
import Marquee from './reusable/Marquee.astro';

const projects = await getCollection('projects');
const featured = projects.filter(p => p.data.featured).slice(0, 10);
---

<Marquee duration={20} gap="2rem">
  {featured.map(project => (
    <a
      href={`/projects/${project.slug}`}
      class="shrink-0 w-96 block hover:opacity-80 transition-opacity"
    >
      <img
        src={project.data.coverImage}
        alt={project.data.title}
        class="w-full h-64 object-cover rounded-lg"
      />
    </a>
  ))}
</Marquee>
```

**Handling empty states:**
```astro
{featured.length >= 3 ? (
  <Marquee duration={20} gap="2rem">
    {featured.map(/* ... */)}
  </Marquee>
) : (
  <div class="grid grid-cols-3 gap-4">
    {featured.map(/* static grid instead */)}
  </div>
)}
```

Minimum 3 items recommended for smooth loop.

### Multiple Marquees

Stack multiple Marquees with different speeds for visual interest:

```astro
<div class="space-y-8">
  <Marquee duration={15} gap="2rem">
    {/* Fast scrolling images */}
  </Marquee>

  <Marquee duration={30} gap="3rem">
    {/* Medium scrolling cards */}
  </Marquee>

  <Marquee duration={45} gap="4rem">
    {/* Slow scrolling logos */}
  </Marquee>
</div>
```

**Tip:** Vary durations significantly (2x difference) for noticeable effect.

### Integration with Other Components

**With Button component:**
```astro
<Marquee duration={25} gap="3rem">
  <div class="shrink-0 w-96 p-6 bg-neutral-800 rounded-lg">
    <h3 class="text-xl font-bold text-white mb-2">Project Title</h3>
    <p class="text-neutral-400 mb-4">Description...</p>
    <Button href="/projects/slug" variant="secondary" size="standard">
      Learn More
    </Button>
  </div>
</Marquee>
```

**With links:**
```astro
<Marquee>
  <a href="/project-1" class="shrink-0 block w-80 hover:scale-105 transition-transform">
    <Image src={img1} alt="Project 1" class="rounded-lg" />
  </a>
</Marquee>
```

## Performance Considerations

### Content Amount

**Recommended:** 4-8 unique items
- Creates smooth loop without excessive DOM nodes
- Balance between variety and performance

**Minimum:** 3 items
- Fewer items make the loop more noticeable
- Consider using static layout instead

**Maximum:** 15-20 items
- More items increase DOM size (remember: content is duplicated!)
- 20 items = 40 rendered items
- Test on lower-end devices

**For many items (50+):**
- Consider pagination or filtering
- Use Carousel component with navigation instead
- Or use multiple Marquees with subsets

### Image Optimization

**Use Astro Image component:**
```astro
import { Image } from 'astro:assets';

<Image
  src={myImage}
  alt="Description"
  format="webp"           // Smaller file size
  loading="lazy"          // Lazy load if below fold
  class="..."
/>
```

**Loading strategy:**
- `loading="eager"` - Above-the-fold Marquees
- `loading="lazy"` - Below-the-fold Marquees

**Format:**
- Prefer `format="webp"` for photos (70% smaller than JPEG)
- PNG for logos with transparency

**Size recommendations:**
- Gallery images: 800-1200px wide max
- Logos: 200-400px wide max
- Thumbnails: 400-600px wide max

### Animation Performance

**Why GPU acceleration matters:**

CSS transforms are GPU-accelerated, meaning:
- Animation runs on graphics hardware, not CPU
- Smoother animations at 60fps
- Lower CPU usage → better battery life
- Other processes can run concurrently

**`will-change: transform`:**
- Tells browser to prepare for animation
- Browser creates separate layer for element
- Layer can be animated independently
- Trade-off: uses more memory, but worth it for continuous animations

**Alternative properties (avoided):**
- `left` / `margin-left`: Forces layout recalculation every frame
- `scroll-behavior`: Doesn't create seamless infinite loop
- JavaScript-based: Requires requestAnimationFrame and manual logic

### Browser Rendering Optimization

**How browsers handle the Marquee:**
1. Creates composite layer for `.marquee-track`
2. Renders children onto layer
3. GPU animates layer transform
4. Container clips visible area

**Avoiding jank:**
- Don't animate other properties simultaneously
- Avoid layout-triggering changes during animation
- Use `shrink-0` to prevent flex recalculation
- Fixed widths prevent reflow

## Browser Support

**CSS Features Used:**
- CSS Keyframe Animations - Universal support (IE10+)
- CSS Transforms - Universal support (IE9+)
- CSS Custom Properties - Modern browsers (IE not supported, but entire site requires modern browsers)
- CSS Flexbox - Universal support
- `will-change` - Modern browsers (degrades gracefully)

**Effective support:** All modern browsers
- Chrome/Edge: Full support
- Firefox: Full support
- Safari (desktop & iOS): Full support
- Mobile browsers: Full support

**Graceful degradation:**
- If CSS disabled: Content displays statically in single row (clipped by container)
- If animations disabled: Content appears static (still usable)
- No JavaScript fallback needed

## Design System Alignment

### Mobile-First Approach

Marquee works naturally with BEARS mobile-first design:

```astro
<Marquee>
  <Image
    src={img}
    alt="..."
    class="h-48 sm:h-56 lg:h-64 w-72 sm:w-80 lg:w-96 object-cover shrink-0"
  />
</Marquee>
```

- Base sizes for mobile (h-48, w-72)
- Scale up at sm: and lg: breakpoints
- Component handles all screen sizes automatically

### Tailwind Integration

The Marquee uses Tailwind utility classes:

```astro
<!-- Container classes can be added via wrapper -->
<div class="container mx-auto px-4">
  <Marquee>
    {/* Items use Tailwind utilities */}
    <div class="shrink-0 w-64 bg-neutral-800 rounded-lg">
      {/* Content */}
    </div>
  </Marquee>
</div>
```

### BEARS Color Scheme

Use BEARS CSS variables for consistency:

```astro
<Marquee>
  <div class="shrink-0 bg-bears-bg border border-neutral-700 text-bears-text-onDark">
    Content
  </div>
</Marquee>
```

**Common colors:**
- Backgrounds: `bg-neutral-800`, `bg-bears-bg`
- Borders: `border-neutral-700`
- Text: `text-white`, `text-neutral-400`, `text-bears-text-onDark`
- Accents: `bg-bears-accent`, `text-bears-accent`

## Migration & Alternatives

### When to Use Marquee

**Ideal use cases:**
- Infinite scrolling displays
- Non-critical content showcase
- Visual interest and movement
- Many items to display continuously
- Ambient/decorative content
- Background visual elements

**Benefits:**
- No user interaction required
- Automatic content cycling
- Works well for large sets of items
- Creates dynamic, engaging visuals

### When NOT to Use Marquee

**Avoid Marquee for:**
- Critical information that users must see
- Content requiring user control
- Situations where motion could distract
- Limited space with few items (use static layout)
- Accessibility-critical content

**Drawbacks:**
- Users can't control which item is visible
- Content may scroll away before user can interact
- Not ideal for reading detailed information
- Motion can be distracting for some users

### Alternative: Carousel Component

When users need control, use a Carousel instead:

**Carousel characteristics:**
- User-controlled navigation (arrows, dots)
- One item at a time (focused view)
- Better for detailed content
- Accessible keyboard controls
- User determines pacing

**Marquee vs Carousel decision matrix:**

| Need | Marquee | Carousel |
|------|---------|----------|
| Showcase many items | ✅ | ❌ |
| User control | ❌ | ✅ |
| Continuous motion | ✅ | ❌ |
| Reading detailed info | ❌ | ✅ |
| Ambient/decorative | ✅ | ❌ |
| Critical content | ❌ | ✅ |
| Accessibility priority | ❌ | ✅ |

## Troubleshooting

### Content Not Scrolling

**Symptoms:** Marquee appears but nothing moves

**Solutions:**
1. **Check import:**
   ```astro
   import Marquee from './reusable/Marquee.astro'; // Correct path?
   ```

2. **Verify slot content exists:**
   ```astro
   <Marquee>
     {items.length > 0 && items.map(/* ... */)}
   </Marquee>
   ```

3. **Inspect browser console** for errors

4. **Check if animations are disabled** (browser dev tools or OS settings)

### Jerky Animation

**Symptoms:** Animation stutters or jumps

**Solutions:**
1. **Ensure `shrink-0` on all items:**
   ```astro
   <div class="shrink-0 w-64"> <!-- shrink-0 required! -->
   ```

2. **Check for layout shift:**
   - Images should have explicit dimensions
   - Avoid dynamically sized content
   - Use `object-cover` or `object-contain` for images

3. **Verify GPU acceleration:**
   ```css
   /* Check computed styles in dev tools */
   will-change: transform; /* Should be present */
   ```

4. **Reduce item count** if too many (try < 15 items)

5. **Check for competing animations** on parent elements

### Gap Not Showing

**Symptoms:** Items are touching despite gap prop

**Solutions:**
1. **Use quoted string:**
   ```astro
   <Marquee gap="2rem">  <!-- Correct -->
   <Marquee gap={2rem}>   <!-- Wrong! Will error -->
   ```

2. **Valid CSS length required:**
   ```astro
   gap="2rem"    <!-- Good -->
   gap="24px"    <!-- Good -->
   gap="2"       <!-- Bad: no unit -->
   ```

3. **Check computed styles** in dev tools:
   - Inspect `.marquee-track`
   - Look for `gap` property
   - Should show your value

### Pause on Hover Not Working

**Symptoms:** Animation doesn't pause when hovering

**Solutions:**
1. **Boolean prop (no quotes):**
   ```astro
   <Marquee pauseOnHover={true}>   <!-- Correct -->
   <Marquee pauseOnHover="true">   <!-- Wrong! String, not boolean -->
   ```

2. **Mobile has no hover** - This is expected behavior on touch devices

3. **Check parent element** isn't blocking pointer events:
   ```css
   /* Avoid: */
   .parent { pointer-events: none; }
   ```

4. **Verify in desktop browser** first before testing mobile

### Too Fast / Too Slow

**Symptoms:** Animation speed doesn't feel right

**Solutions:**
1. **Adjust duration prop** (higher = slower):
   ```astro
   <Marquee duration={10}>   <!-- Very fast -->
   <Marquee duration={30}>   <!-- Medium (default) -->
   <Marquee duration={60}>   <!-- Slow -->
   ```

2. **Consider content width:**
   - Wider items should have longer duration
   - Many items can use shorter duration
   - Few items should use longer duration

3. **Test with actual content** - Lorem ipsum vs real images/text matters

4. **Get user feedback** - Speed perception is subjective

### Items Wrapping or Squishing

**Symptoms:** Items stack vertically or compress horizontally

**Solutions:**
1. **Add `shrink-0` class:**
   ```astro
   <div class="shrink-0 w-64">  <!-- Prevents squishing -->
   ```

2. **Set explicit widths:**
   ```astro
   <Image
     src={img}
     alt="..."
     class="w-96 h-64 shrink-0"  <!-- Explicit dimensions -->
   />
   ```

3. **Check container width** - Ensure parent isn't constraining

4. **Verify flex direction** - Should be horizontal (default)

## Questions?

**For content creators:** See the [Using Marquees guide](../../../guides/using-marquee.md)

**For architecture questions:** See `/CLAUDE.md` in project root

**For Astro-specific help:** [Astro Documentation](https://docs.astro.build)

**For CSS animation details:** [MDN - CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)
