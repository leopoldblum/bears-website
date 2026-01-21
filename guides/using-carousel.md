> **👥 For Content Creators**
>
> **Looking for technical details?** See [Carousel Component Documentation](../src/components/reusable/Carousel.md) for developers.

# Using Carousels in MDX Content

A quick guide for adding interactive slide shows with user-controlled navigation to your content pages.

## What is a Carousel?

A Carousel displays **one item at a time** with navigation controls (arrows and dots) that let users browse through content at their own pace. Think of it like a slideshow presentation where users click through slides.

**Perfect for:**
- Testimonials and member quotes
- Project or experiment showcases
- Feature highlights with detailed descriptions
- Image galleries where users need to focus on one image at a time
- Any content where users should control the pacing

**Key difference from Marquee:** A Carousel lets users navigate and control what they see, while a Marquee continuously scrolls automatically. Use Carousel when the content is important and users need time to read or examine each item.

## Quick Start

Every MDX file that uses Carousels needs this import at the top:

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
---

# Your Page Title

Your content here...

<Carousel>
  <div class="bg-neutral-800 rounded-lg p-8">
    <h4 class="text-xl font-bold text-white">First Slide</h4>
    <p class="text-neutral-300">This is the first slide content.</p>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8">
    <h4 class="text-xl font-bold text-white">Second Slide</h4>
    <p class="text-neutral-300">This is the second slide content.</p>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8">
    <h4 class="text-xl font-bold text-white">Third Slide</h4>
    <p class="text-neutral-300">This is the third slide content.</p>
  </div>
</Carousel>
```

**Result:** Three slides with arrow buttons to navigate left/right and dots at the bottom showing which slide you're on. Users can click arrows or dots to switch between slides.

## Common Use Cases

### 1. Project or Experiment Showcases

Display different aspects of a project or highlight multiple experiments.

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
---

## Notable Experiments

<Carousel showArrows={true} showDots={true} minHeight="min-h-64">
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Crystal Growth Study</h4>
    <p class="text-neutral-300">
      Investigation of protein crystallization for pharmaceutical applications showed 40% improvement
      in crystal quality under microgravity conditions.
    </p>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Combustion Research</h4>
    <p class="text-neutral-300">
      Flame spread experiments revealed unique spherical flame patterns not visible under normal gravity,
      advancing fire safety understanding.
    </p>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Fluid Mixing</h4>
    <p class="text-neutral-300">
      Studies of miscible fluid mixing demonstrated enhanced mixing efficiency in microgravity,
      with applications to chemical processing.
    </p>
  </div>
</Carousel>
```

**Looks like:** Dark cards with titles and descriptions. Users click arrows or dots to read about each experiment. Perfect for showcasing multiple achievements or project milestones.

### 2. Feature Highlights

Show different features or capabilities of a project.

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
---

## Key Features

<Carousel minHeight="min-h-80">
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Real-Time Data Collection</h4>
    <ul class="list-disc pl-5 space-y-2 text-neutral-300">
      <li>High-speed sensor sampling at 1000 Hz</li>
      <li>Multi-channel data acquisition</li>
      <li>Automated data logging</li>
      <li>Cloud backup integration</li>
    </ul>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Advanced Analysis Tools</h4>
    <ul class="list-disc pl-5 space-y-2 text-neutral-300">
      <li>Statistical analysis suite</li>
      <li>Real-time graphing capabilities</li>
      <li>Machine learning integration</li>
      <li>Export to multiple formats</li>
    </ul>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Safety Systems</h4>
    <ul class="list-disc pl-5 space-y-2 text-neutral-300">
      <li>Emergency stop mechanisms</li>
      <li>Automatic alert system</li>
      <li>Redundant backup systems</li>
      <li>Real-time health monitoring</li>
    </ul>
  </div>
</Carousel>
```

**Looks like:** Feature cards with titles and bulleted lists. Users browse through features at their own pace.

**Tips:**
- Use `minHeight="min-h-80"` to ensure enough vertical space for content
- Keep slide content balanced - similar amounts of text per slide works best
- Lists are great for features, specifications, or bullet points

### 3. Image Gallery with Descriptions

Display images with captions or descriptions where users need time to examine each one.

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
import { Image } from 'astro:assets';
import launch1 from '../assets/launches/launch-1.jpg';
import launch2 from '../assets/launches/launch-2.jpg';
import launch3 from '../assets/launches/launch-3.jpg';
---

## Launch Photo Gallery

<Carousel autoScroll={false} minHeight="min-h-96">
  <div class="flex flex-col items-center">
    <Image
      src={launch1}
      alt="Rocket on launch pad"
      class="w-full max-w-2xl h-64 object-cover rounded-lg mb-4"
      loading="eager"
      format="webp"
    />
    <p class="text-neutral-300 text-center max-w-xl">
      Pre-launch preparations on the morning of our first test flight.
    </p>
  </div>
  <div class="flex flex-col items-center">
    <Image
      src={launch2}
      alt="Rocket liftoff"
      class="w-full max-w-2xl h-64 object-cover rounded-lg mb-4"
      loading="lazy"
      format="webp"
    />
    <p class="text-neutral-300 text-center max-w-xl">
      Successful liftoff at 10:45 AM, reaching an altitude of 2,500 feet.
    </p>
  </div>
  <div class="flex flex-col items-center">
    <Image
      src={launch3}
      alt="Rocket recovery"
      class="w-full max-w-2xl h-64 object-cover rounded-lg mb-4"
      loading="lazy"
      format="webp"
    />
    <p class="text-neutral-300 text-center max-w-xl">
      Safe recovery and landing 1.2 miles downrange from the launch site.
    </p>
  </div>
</Carousel>
```

**Looks like:** Full-width images with captions below. Users navigate through the launch sequence at their own pace.

**Tips:**
- Use `autoScroll={false}` so users control when to advance
- Always use the Astro `Image` component for optimization
- Use `loading="eager"` for the first image, `loading="lazy"` for others
- Add descriptive captions to provide context

### 4. Auto-Scrolling Testimonials

Let testimonials advance automatically while giving users control to stop and read.

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
---

## What Members Say

<Carousel autoScroll={true} autoScrollInterval={5000}>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700 max-w-2xl mx-auto">
    <p class="text-lg text-neutral-200 italic mb-4">
      "Joining BEARS was the best decision I made in college. The hands-on experience
      and mentorship I received prepared me for my career in aerospace engineering."
    </p>
    <div class="font-semibold text-white">Sarah Chen</div>
    <div class="text-sm text-neutral-400">Aerospace Engineer, SpaceX</div>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700 max-w-2xl mx-auto">
    <p class="text-lg text-neutral-200 italic mb-4">
      "The collaborative environment and access to cutting-edge projects gave me
      skills I couldn't have learned anywhere else."
    </p>
    <div class="font-semibold text-white">Michael Rodriguez</div>
    <div class="text-sm text-neutral-400">Systems Engineer, NASA JPL</div>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700 max-w-2xl mx-auto">
    <p class="text-lg text-neutral-200 italic mb-4">
      "BEARS taught me to think like an engineer and work as part of a team.
      The friendships and connections I made here are invaluable."
    </p>
    <div class="font-semibold text-white">Emily Thompson</div>
    <div class="text-sm text-neutral-400">Mechanical Engineer, Blue Origin</div>
  </div>
</Carousel>
```

**Looks like:** Testimonial cards that automatically advance every 5 seconds. Users can still click arrows to navigate manually or hover to pause the auto-scroll.

**Tips:**
- Use `autoScroll={true}` to automatically cycle through testimonials
- `autoScrollInterval={5000}` means 5 seconds per slide (5000 milliseconds)
- Auto-scroll pauses when users hover over the carousel
- Users can still navigate manually with arrows or dots

## Customizing the Carousel

### Auto-Scroll (autoScroll)

Control whether slides advance automatically or require manual navigation.

```mdx
<!-- Manual navigation only (default) -->
<Carousel autoScroll={false}>
  {/* Users must click arrows or dots to navigate */}
</Carousel>

<!-- Automatic cycling -->
<Carousel autoScroll={true}>
  {/* Slides advance automatically, but users can still control manually */}
</Carousel>
```

**When to use:**
- **`autoScroll={false}`** - Project showcases, features, important content users should read at their own pace
- **`autoScroll={true}`** - Testimonials, news highlights, content that benefits from automatic rotation

**Note:** Even with auto-scroll enabled, users can:
- Click arrows or dots to navigate manually
- Hover over the carousel to pause auto-scrolling
- Resume auto-scroll by moving the mouse away

### Auto-Scroll Speed (autoScrollInterval)

When auto-scroll is enabled, control how long each slide displays (in milliseconds).

```mdx
<!-- Fast rotation: 3 seconds per slide -->
<Carousel autoScroll={true} autoScrollInterval={3000}>
  {/* Good for: Brief quotes, simple images */}
</Carousel>

<!-- Medium rotation: 5 seconds per slide (recommended) -->
<Carousel autoScroll={true} autoScrollInterval={5000}>
  {/* Good for: Testimonials, general content */}
</Carousel>

<!-- Slow rotation: 8 seconds per slide -->
<Carousel autoScroll={true} autoScrollInterval={8000}>
  {/* Good for: Content with more text to read */}
</Carousel>
```

**How to choose:**
- **3000-4000ms (3-4 seconds)** - Brief content, simple images
- **5000-6000ms (5-6 seconds)** - Standard testimonials, quotes
- **7000-10000ms (7-10 seconds)** - Longer text, detailed content

**Conversion:**
- 1 second = 1000 milliseconds
- 5 seconds = 5000 milliseconds
- 10 seconds = 10000 milliseconds

### Navigation Arrows (showArrows)

Show or hide the previous/next arrow buttons.

```mdx
<!-- Show arrows (default) -->
<Carousel showArrows={true}>
  {/* Users see arrow buttons on left and right */}
</Carousel>

<!-- Hide arrows -->
<Carousel showArrows={false}>
  {/* Only dot navigation available */}
</Carousel>
```

**When to hide arrows:**
- Very simple carousel with only 2-3 slides
- When you want a cleaner, minimalist look
- When dot navigation is sufficient

**When to show arrows (recommended):**
- Most use cases - arrows are the primary navigation method
- Content with many slides
- When accessibility and ease of use are priorities

### Dot Indicators (showDots)

Show or hide the dot navigation at the bottom.

```mdx
<!-- Show dots (default) -->
<Carousel showDots={true}>
  {/* Users see dots indicating total slides and current position */}
</Carousel>

<!-- Hide dots -->
<Carousel showDots={false}>
  {/* Only arrow navigation available */}
</Carousel>
```

**When to hide dots:**
- Very large carousel (10+ slides) where dots become too many
- When you want maximum focus on content
- Minimalist designs

**When to show dots (recommended):**
- Most use cases - dots show position in the carousel
- 3-8 slides - perfect range for dot navigation
- When users benefit from knowing "slide 2 of 5"

### Carousel Height (minHeight)

Set the minimum height using Tailwind classes.

```mdx
<!-- Small carousel: 16rem (256px) minimum -->
<Carousel minHeight="min-h-64">
  {/* Good for: Compact content, brief text */}
</Carousel>

<!-- Medium carousel: 20rem (320px) minimum -->
<Carousel minHeight="min-h-80">
  {/* Good for: Standard content with moderate text */}
</Carousel>

<!-- Large carousel: 24rem (384px) minimum (default is min-h-120) -->
<Carousel minHeight="min-h-96">
  {/* Good for: Images with captions, detailed content */}
</Carousel>

<!-- Extra large carousel: 30rem (480px) minimum (default) -->
<Carousel minHeight="min-h-120">
  {/* Good for: Large images, extensive content */}
</Carousel>
```

**Common Tailwind height classes:**
- `min-h-64` - 256px (16rem)
- `min-h-80` - 320px (20rem)
- `min-h-96` - 384px (24rem)
- `min-h-120` - 480px (30rem) - Default

**How to choose:**
- Match the height to your content - avoid excessive empty space
- Ensure all slides fit comfortably without overflow
- Test with your longest/tallest slide to ensure it fits

## Combining All Options

You can customize multiple options together:

```mdx
<Carousel
  autoScroll={true}
  autoScrollInterval={6000}
  showArrows={true}
  showDots={true}
  minHeight="min-h-80"
>
  <div class="bg-neutral-800 rounded-lg p-8">
    Your slide content here
  </div>
  {/* More slides... */}
</Carousel>
```

**Decision checklist:**
1. **Should slides advance automatically?** → Set `autoScroll`
2. **If auto-scrolling, how fast?** → Set `autoScrollInterval`
3. **Do you need arrow buttons?** → Set `showArrows` (usually yes)
4. **Do you need position indicators?** → Set `showDots` (usually yes)
5. **How tall should it be?** → Set `minHeight` to match content

## Tips & Best Practices

### Content Considerations

**Keep slides readable:**
- Don't pack too much text into one slide
- Use clear headings to separate different slides
- Ensure text is large enough to read comfortably
- Maintain consistent content length across slides

**Balance your slides:**
```mdx
<!-- Good: Similar content length across slides -->
<Carousel>
  <div class="p-8">
    <h4 class="text-xl mb-4">Feature 1</h4>
    <p>Brief description of the first feature.</p>
  </div>
  <div class="p-8">
    <h4 class="text-xl mb-4">Feature 2</h4>
    <p>Brief description of the second feature.</p>
  </div>
</Carousel>

<!-- Avoid: Dramatically different content lengths -->
<Carousel>
  <div class="p-8">
    <h4>Feature 1</h4>
    <p>Short text</p>
  </div>
  <div class="p-8">
    <h4>Feature 2</h4>
    <p>Very long paragraph with lots of detailed information that makes this slide much taller than the others and creates an inconsistent user experience...</p>
  </div>
</Carousel>
```

### When to Use Auto-Scroll

**Use auto-scroll for:**
- Testimonials that benefit from automatic rotation
- News or announcements that should cycle
- Content where users might passively watch

**Don't use auto-scroll for:**
- Complex information users need time to read
- Content with interactive elements (links, buttons)
- Educational or instructional content

**Golden rule:** If users need to read carefully or take action, use manual navigation only.

### Number of Slides

**Recommended:** 3-6 slides
- Enough variety to be interesting
- Not so many that navigation becomes tedious
- Easy for users to browse through

**Minimum:** 2 slides
- Carousels need at least 2 slides to make sense
- Consider if a carousel is the best choice for just 2 items

**Maximum:** 8-10 slides
- More than 10 slides can overwhelm users
- Consider breaking into multiple carousels or using different layout
- Dot navigation becomes cluttered with too many slides

### Accessibility

**Clear slide content:**
- Use descriptive headings for each slide
- Ensure text has good contrast against backgrounds
- Don't rely solely on images - include text descriptions

**Keyboard navigation:**
- The carousel supports keyboard controls automatically
- Users can tab to buttons and use Enter/Space to activate
- No special configuration needed

**Screen readers:**
- Use semantic HTML (`<h4>` for titles, `<p>` for paragraphs)
- Include alt text for images
- The carousel handles ARIA attributes automatically

## Import Path Guide

The import path depends on where your MDX file is located:

### For Project/Event Posts

If your file is in `/src/content/posts/projects/` or `/src/content/posts/events/`:

```mdx
import Carousel from '../../../components/reusable/Carousel.astro';
```

### For Other Locations

Adjust the path based on how many folders up you need to go to reach the `src/` directory:

- One level up: `../components/reusable/Carousel.astro`
- Two levels up: `../../components/reusable/Carousel.astro`
- Three levels up: `../../../components/reusable/Carousel.astro`

**Tip:** Count how many folders deep your file is from `/src/`, then use that many `../` to go back up, then add `components/reusable/Carousel.astro`.

## Complete Example

Here's a full MDX page demonstrating effective carousel usage:

```mdx
---
import Carousel from '../../../components/reusable/Carousel.astro';
import Button from '../../../components/reusable/Button.astro';
import { Image } from 'astro:assets';
import experiment1 from '../assets/experiments/exp-1.jpg';
import experiment2 from '../assets/experiments/exp-2.jpg';
import experiment3 from '../assets/experiments/exp-3.jpg';
---

# Microgravity Research Platform

Our drop tower facility enables cutting-edge research in near-weightless conditions.

## Featured Experiments

<Carousel showArrows={true} showDots={true} minHeight="min-h-80">
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Crystal Growth Study</h4>
    <p class="text-neutral-300 mb-4">
      Investigation of protein crystallization for pharmaceutical applications showed 40% improvement
      in crystal quality under microgravity conditions.
    </p>
    <ul class="list-disc pl-5 space-y-1 text-neutral-300">
      <li>Duration: 1.7 seconds microgravity</li>
      <li>Success rate: 95%</li>
      <li>Research impact: 2 publications</li>
    </ul>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Combustion Research</h4>
    <p class="text-neutral-300 mb-4">
      Flame spread experiments revealed unique spherical flame patterns not visible under normal gravity,
      advancing fire safety understanding.
    </p>
    <ul class="list-disc pl-5 space-y-1 text-neutral-300">
      <li>Duration: 1.7 seconds microgravity</li>
      <li>Success rate: 88%</li>
      <li>Research impact: 1 conference presentation</li>
    </ul>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700">
    <h4 class="text-xl font-bold text-white mb-4">Fluid Mixing</h4>
    <p class="text-neutral-300 mb-4">
      Studies of miscible fluid mixing demonstrated enhanced mixing efficiency in microgravity,
      with applications to chemical processing.
    </p>
    <ul class="list-disc pl-5 space-y-1 text-neutral-300">
      <li>Duration: 1.7 seconds microgravity</li>
      <li>Success rate: 92%</li>
      <li>Research impact: 1 publication, 1 patent pending</li>
    </ul>
  </div>
</Carousel>

## What Researchers Say

<Carousel autoScroll={true} autoScrollInterval={6000} minHeight="min-h-64">
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700 max-w-2xl mx-auto">
    <p class="text-lg text-neutral-200 italic mb-4">
      "The drop tower facility provided invaluable data for our materials science research.
      The team's expertise made our experiments a success."
    </p>
    <div class="font-semibold text-white">Dr. Sarah Williams</div>
    <div class="text-sm text-neutral-400">Materials Science Professor</div>
  </div>
  <div class="bg-neutral-800 rounded-lg p-8 border border-neutral-700 max-w-2xl mx-auto">
    <p class="text-lg text-neutral-200 italic mb-4">
      "Access to this facility accelerated our research timeline significantly.
      The quality of data exceeded our expectations."
    </p>
    <div class="font-semibold text-white">Dr. Michael Chen</div>
    <div class="text-sm text-neutral-400">Physics Department Chair</div>
  </div>
</Carousel>

<div class="mt-8 flex justify-center not-prose">
  <Button variant="primary" size="large" href="/contact">
    Submit Experiment Proposal
  </Button>
</div>
```

## Carousel vs Marquee: Which to Use?

Both Carousel and Marquee display multiple items, but they serve different purposes:

### Use Carousel When:
- **User control matters** - Users need to navigate at their own pace
- **Content is important** - Critical information that shouldn't scroll away
- **Reading is required** - Detailed text that needs time to read
- **One item at a time** - Focus on individual items works better
- **Testimonials** - Users should control the pace of reading quotes
- **Project showcases** - Detailed information about each project

### Use Marquee When:
- **Showcasing many items** - Displaying lots of content continuously
- **Decorative purpose** - Creating visual interest and movement
- **Ambient display** - Background content that doesn't require interaction
- **Logos or badges** - Sponsor logos, technology badges, partner names
- **Photo galleries** - Many images scrolling for visual impact

### Quick Decision Matrix

| Need | Carousel | Marquee |
|------|----------|---------|
| User control | ✅ Yes | ❌ No |
| One item focused view | ✅ Yes | ❌ No |
| Reading detailed info | ✅ Yes | ❌ No |
| Continuous motion | ❌ No | ✅ Yes |
| Showcase many items | ❌ No | ✅ Yes |
| Ambient/decorative | ❌ No | ✅ Yes |
| Critical content | ✅ Yes | ❌ No |
| Accessibility priority | ✅ Yes | ⚠️ Limited |

**Still unsure?** Ask yourself: "Do users need to control what they see?" If yes, use Carousel. If content should flow continuously, use Marquee.

See the [Using Marquees guide](./using-marquee.md) for more about Marquees.

## Combining with Other Components

Carousels work great alongside other components like buttons and accordions:

```mdx
## Project Details

<Carousel>
  {/* Project showcase slides */}
</Carousel>

<div class="mt-8 flex gap-4 justify-center not-prose">
  <Button variant="primary" href="/join">Join the Team</Button>
  <Button variant="secondary" href="/contact">Learn More</Button>
</div>

## Frequently Asked Questions

<Accordion
  items={[
    { title: "How do I get involved?", content: "..." },
    { title: "What experience do I need?", content: "..." }
  ]}
/>
```

## Need Help?

If you need more advanced features or run into issues, refer to the Carousel Component Documentation for developers or reach out to the web team.

**For more component guides:**
- [Using Accordions](./using-accordion.md)
- [Using Marquees](./using-marquee.md)
- [Using Buttons](./using-buttons.md)
