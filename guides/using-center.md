> **👥 For Content Creators**
>
> **Looking for technical details?** See [Center Component Documentation](../src/components/mdx/Center.md) for developers.

# Using Center in MDX Content

A simple component for horizontally centering content in your MDX pages.

## Quick Start

Import at the top of your MDX file:

```mdx
---
import Center from '@mdx/Center.astro'
---

<Center>
  <Button>Click Me</Button>
</Center>
```

## Common Patterns

### Single Item

```mdx
<Center class="mt-8 not-prose">
  <Button variant="primary" size="large">Get Started</Button>
</Center>
```

### Multiple Items

Multiple items are stacked vertically and centered:

```mdx
<Center class="not-prose">
  <Button variant="primary">Join Now</Button>
  <Button variant="secondary">Learn More</Button>
</Center>
```

### Centered Text

```mdx
<Center>
  <p class="text-sm text-bears-text-onDark/70">Last updated: January 2026</p>
</Center>
```

### Mixed Markdown and Components

You can mix Markdown content with components. They'll stack vertically with consistent spacing:

```mdx
<Center>
  - First bullet point
  - Second bullet point

  <Button variant="primary" size="large" href="/contact">
    Get Started
  </Button>
</Center>
```

## Using in MDX

When using `Center` in MDX files with prose content, add the `not-prose` class to prevent Tailwind Typography from interfering:

```mdx
<Center class="not-prose">
  <!-- Your content -->
</Center>
```

## How It Works

The `Center` component stacks multiple children vertically and centers them horizontally. This works with any combination of:
- Components (Button, images, etc.)
- Markdown content (paragraphs, lists, headings)
- HTML elements

Items are spaced with consistent vertical gaps automatically.
