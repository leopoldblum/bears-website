# SideBySide Component - Technical Documentation

A responsive two-column layout component for use in Astro and MDX files. Content stacks vertically on mobile and appears side-by-side on large screens with automatic 50/50 width distribution.

## Props

```typescript
interface Props {
  class?: string;  // Additional Tailwind classes
}
```

### `class` (optional)

Additional Tailwind CSS classes to apply to the wrapper. Common use cases:

- **Gap override**: `class="gap-12"` - Override default gap spacing
- **Alignment**: `class="items-center"` - Vertically center columns
- **Responsive gap**: `class="gap-4 sm:gap-6 lg:gap-12"` - Custom responsive spacing
- **MDX prose**: `class="not-prose"` - Prevents Tailwind Typography interference

Note: The component includes `gap-4 lg:gap-8` by default. Use `gap-*` in the class prop to override.

## Implementation

The component uses flexbox with named slots for responsive layout:

```astro
<div class="flex flex-col lg:flex-row gap-4 lg:gap-8 {className}">
  <div class="flex-1">
    <slot name="left" />
  </div>
  <div class="flex-1">
    <slot name="right" />
  </div>
</div>
```

### Layout Behavior

- **Mobile (< 1024px)**:
  - `flex flex-col` - Stacks columns vertically
  - `gap-4` - 1rem (16px) spacing between stacked items
  - Full width for each column

- **Large screens (≥ 1024px)**:
  - `lg:flex-row` - Places columns side by side
  - `lg:gap-8` - 2rem (32px) spacing between columns
  - `flex-1` ensures automatic 50/50 width distribution

### Why This Approach?

- **Mobile-first**: Ensures comfortable reading on small screens
- **Skip md: breakpoint**: Follows project convention - tablets get mobile layout for better readability
- **Flexbox over Grid**: Simpler for equal-width columns, more flexible for customization
- **Named slots**: Explicit left/right positioning prevents confusion
- **No JavaScript**: Pure CSS solution with no runtime overhead
- **Flexible children**: Works with any content type (text, images, components, Markdown)

## Usage Examples

### Basic Two-Column Layout

```mdx
import SideBySide from '../../components/reusable/SideBySide.astro';

<SideBySide>
  <div slot="left">
    ## Left Column
    Content for the left side.
  </div>
  <div slot="right">
    ## Right Column
    Content for the right side.
  </div>
</SideBySide>
```

### Image and Text

```mdx
import { Image } from 'astro:assets';
import rocketImage from '../../assets/projects/rocket.jpg';

<SideBySide>
  <Image slot="left" src={rocketImage} alt="Rocket launch" class="w-full rounded-lg" loading="eager" />
  <div slot="right">
    ## Our Mission
    We design and build experimental rockets for microgravity research...
  </div>
</SideBySide>
```

### With Custom Gap

```mdx
<SideBySide class="gap-12">
  <div slot="left">Left content</div>
  <div slot="right">Right content</div>
</SideBySide>
```

### Vertically Centered

```mdx
<SideBySide class="items-center">
  <img slot="left" src="/images/logo.png" alt="Logo" />
  <div slot="right">
    ## About BEARS
    Berlin Experimental Astronautics Research Student team
  </div>
</SideBySide>
```

### With Components

```mdx
import SideBySide from '../../components/reusable/SideBySide.astro';
import Button from '../../components/reusable/Button.astro';

<SideBySide>
  <div slot="left">
    ## Join Our Team
    - Work on real rockets
    - Conduct experiments
    - Present at conferences
  </div>
  <div slot="right">
    ## Get Started
    Ready to launch your career in aerospace?

    <Button variant="primary" href="/apply">
      Apply Now
    </Button>
  </div>
</SideBySide>
```

### In Astro Component

```astro
---
import SideBySide from './reusable/SideBySide.astro';
---

<SideBySide>
  <div slot="left" class="prose">
    <h2>Research Areas</h2>
    <p>Our team focuses on microgravity experiments...</p>
  </div>
  <div slot="right" class="prose">
    <h2>Current Projects</h2>
    <ul>
      <li>REXUS/BEXUS program</li>
      <li>Sounding rocket development</li>
    </ul>
  </div>
</SideBySide>
```

### Multiple Sections

Stack multiple `<SideBySide>` components for alternating layouts:

```mdx
<SideBySide>
  <img slot="left" src="/images/research-1.jpg" alt="Research" />
  <div slot="right">
    ## Materials Science
    Studying crystal growth in microgravity...
  </div>
</SideBySide>

<SideBySide class="mt-8">
  <div slot="left">
    ## Fluid Dynamics
    Understanding surface tension effects...
  </div>
  <img slot="right" src="/images/research-2.jpg" alt="Fluid dynamics" />
</SideBySide>
```

### Two-Column Feature Comparison

```mdx
<SideBySide class="gap-12">
  <div slot="left">
    ### Traditional Testing

    - Ground-based simulations
    - Limited microgravity duration
    - Constrained by 1g environment
    - Lower cost per test
  </div>
  <div slot="right">
    ### Space-Based Research

    - True microgravity conditions
    - Extended experiment duration
    - Unrestricted environment
    - Higher research fidelity
  </div>
</SideBySide>
```

### Call-to-Action with Image

```mdx
import Button from '../../components/reusable/Button.astro';
import { Image } from 'astro:assets';
import teamImage from '../../assets/team.jpg';

<SideBySide class="items-center mt-12">
  <div slot="left">
    ## Join BEARS Today

    Work on cutting-edge aerospace projects, collaborate with talented students,
    and contribute to real scientific research.

    <div class="mt-6">
      <Button variant="primary" size="large" href="/apply">
        Start Your Application
      </Button>
    </div>
  </div>
  <Image slot="right" src={teamImage} alt="BEARS team members" />
</SideBySide>
```

## Design Decisions

- **Minimal props**: Only `class` escape hatch keeps the component simple
- **Named slots**: Explicit `left` and `right` slots prevent order confusion
- **Responsive gap**: Larger gap on desktop for better visual separation
- **Top alignment**: Default top alignment (override with `class="items-center"`)
- **No Alpine.js**: Pure CSS solution with no JavaScript overhead
- **Breakpoint choice**: `lg:` (1024px) ensures comfortable column width, follows project convention

## Common Patterns

### Text + Image (Most Common)

```mdx
<SideBySide>
  <div slot="left">Text content</div>
  <img slot="right" src="..." alt="..." />
</SideBySide>
```

### Two Text Columns

```mdx
<SideBySide>
  <div slot="left">Column 1 text</div>
  <div slot="right">Column 2 text</div>
</SideBySide>
```

### Component + Markdown

```mdx
<SideBySide class="items-center">
  <Button slot="left" variant="primary">Click Me</Button>
  <div slot="right">Supporting text or description</div>
</SideBySide>
```

## Browser Support

Works in all modern browsers that support Flexbox:
- Chrome/Edge (all versions)
- Firefox (all versions)
- Safari (all versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- **Center**: For horizontally centering single-column content
- **Accordion**: For collapsible vertical content sections
- **Carousel**: For horizontally scrolling content

## Troubleshooting

### Content Not Appearing Side-by-Side

Check screen size - the component only displays columns side-by-side at `lg:` (1024px+) breakpoint. On smaller screens, content stacks vertically by design.

### Unequal Column Heights

This is expected behavior. Columns are top-aligned by default. Use `class="items-center"` to vertically center shorter content, or `class="items-stretch"` to make columns equal height.

### Missing Content

Make sure you're using the named slots correctly: `<div slot="left">` and `<div slot="right">`. Content without a slot attribute won't be displayed.
