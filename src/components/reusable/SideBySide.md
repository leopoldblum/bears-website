# SideBySide Component Group - Technical Documentation

A responsive two-column layout component group for use in Astro and MDX files. Content stacks vertically on mobile and appears side-by-side on large screens with automatic 50/50 width distribution.

## Components

### SideBySide (Container)
The main container component that provides responsive layout behavior.

```typescript
interface Props {
  class?: string;  // Additional Tailwind classes
}
```

### Left (Column Wrapper)
Wraps content for the left column with automatic 50% width distribution.

```typescript
interface Props {
  class?: string;  // Additional Tailwind classes
}
```

### Right (Column Wrapper)
Wraps content for the right column with automatic 50% width distribution.

```typescript
interface Props {
  class?: string;  // Additional Tailwind classes
}
```

## Import

```typescript
import { SideBySide, Left, Right } from './SideBySide';
```

## Implementation

The component group uses flexbox with nested components for responsive layout:

```astro
<!-- SideBySide.astro -->
<div class="flex flex-col lg:flex-row gap-4 lg:gap-8 {className}">
  <slot />
</div>

<!-- Left.astro & Right.astro -->
<div class="flex-1 {className}">
  <slot />
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
- **Component composition**: Clean Left/Right components provide intuitive structure
- **No JavaScript**: Pure CSS solution with no runtime overhead
- **Flexible children**: Works with any content type (text, images, components, Markdown)
- **Unified imports**: Barrel export provides clean single import statement

## Usage Examples

### Basic Two-Column Layout

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';

<SideBySide>
  <Left>
    ## Left Column
    Content for the left side.
  </Left>
  <Right>
    ## Right Column
    Content for the right side.
  </Right>
</SideBySide>
```

### Image and Text

```mdx
import { Image } from 'astro:assets';
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';
import rocketImage from '../../assets/projects/rocket.jpg';

<SideBySide>
  <Left>
    <Image src={rocketImage} alt="Rocket launch" class="w-full rounded-lg" loading="eager" />
  </Left>
  <Right>
    ## Our Mission
    We design and build experimental rockets for microgravity research...
  </Right>
</SideBySide>
```

### With Custom Gap

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';

<SideBySide class="gap-12">
  <Left>Left content</Left>
  <Right>Right content</Right>
</SideBySide>
```

### Vertically Centered

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';

<SideBySide class="items-center">
  <Left>
    <img src="/images/logo.png" alt="Logo" />
  </Left>
  <Right>
    ## About BEARS
    Berlin Experimental Astronautics Research Student team
  </Right>
</SideBySide>
```

### With Components

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';
import Button from '../../components/reusable/Button.astro';

<SideBySide>
  <Left>
    ## Join Our Team
    - Work on real rockets
    - Conduct experiments
    - Present at conferences
  </Left>
  <Right>
    ## Get Started
    Ready to launch your career in aerospace?

    <Button variant="primary" href="/apply">
      Apply Now
    </Button>
  </Right>
</SideBySide>
```

### In Astro Component

```astro
---
import { SideBySide, Left, Right } from './reusable/SideBySide';
---

<SideBySide>
  <Left class="prose">
    <h2>Research Areas</h2>
    <p>Our team focuses on microgravity experiments...</p>
  </Left>
  <Right class="prose">
    <h2>Current Projects</h2>
    <ul>
      <li>REXUS/BEXUS program</li>
      <li>Sounding rocket development</li>
    </ul>
  </Right>
</SideBySide>
```

### Multiple Sections

Stack multiple `<SideBySide>` components for alternating layouts:

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';

<SideBySide>
  <Left>
    <img src="/images/research-1.jpg" alt="Research" />
  </Left>
  <Right>
    ## Materials Science
    Studying crystal growth in microgravity...
  </Right>
</SideBySide>

<SideBySide class="mt-8">
  <Left>
    ## Fluid Dynamics
    Understanding surface tension effects...
  </Left>
  <Right>
    <img src="/images/research-2.jpg" alt="Fluid dynamics" />
  </Right>
</SideBySide>
```

### Two-Column Feature Comparison

```mdx
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';

<SideBySide class="gap-12">
  <Left>
    ### Traditional Testing

    - Ground-based simulations
    - Limited microgravity duration
    - Constrained by 1g environment
    - Lower cost per test
  </Left>
  <Right>
    ### Space-Based Research

    - True microgravity conditions
    - Extended experiment duration
    - Unrestricted environment
    - Higher research fidelity
  </Right>
</SideBySide>
```

### Call-to-Action with Image

```mdx
import Button from '../../components/reusable/Button.astro';
import { Image } from 'astro:assets';
import { SideBySide, Left, Right } from '../../components/reusable/SideBySide';
import teamImage from '../../assets/team.jpg';

<SideBySide class="items-center mt-12">
  <Left>
    ## Join BEARS Today

    Work on cutting-edge aerospace projects, collaborate with talented students,
    and contribute to real scientific research.

    <div class="mt-6">
      <Button variant="primary" size="large" href="/apply">
        Start Your Application
      </Button>
    </div>
  </Left>
  <Right>
    <Image src={teamImage} alt="BEARS team members" />
  </Right>
</SideBySide>
```

## Design Decisions

- **Minimal props**: Only `class` escape hatch keeps the component simple
- **Component composition**: Left and Right components provide clear structure
- **Responsive gap**: Larger gap on desktop for better visual separation
- **Top alignment**: Default top alignment (override with `class="items-center"`)
- **No Alpine.js**: Pure CSS solution with no JavaScript overhead
- **Breakpoint choice**: `lg:` (1024px) ensures comfortable column width, follows project convention
- **Unified imports**: Barrel export provides clean developer experience

## Common Patterns

### Text + Image (Most Common)

```mdx
import { SideBySide, Left, Right } from './SideBySide';

<SideBySide>
  <Left>Text content</Left>
  <Right>
    <img src="..." alt="..." />
  </Right>
</SideBySide>
```

### Two Text Columns

```mdx
import { SideBySide, Left, Right } from './SideBySide';

<SideBySide>
  <Left>Column 1 text</Left>
  <Right>Column 2 text</Right>
</SideBySide>
```

### Component + Markdown

```mdx
import { SideBySide, Left, Right } from './SideBySide';
import Button from './Button.astro';

<SideBySide class="items-center">
  <Left>
    <Button variant="primary">Click Me</Button>
  </Left>
  <Right>Supporting text or description</Right>
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

Make sure you're importing and using the components correctly:
```mdx
import { SideBySide, Left, Right } from './SideBySide';

<SideBySide>
  <Left>Content</Left>
  <Right>Content</Right>
</SideBySide>
```
Content must be wrapped in Left and Right components to be displayed.
