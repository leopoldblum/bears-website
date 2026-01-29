# Center Component - Technical Documentation

A simple horizontal centering wrapper component for use in Astro and MDX files.

## Props

```typescript
interface Props {
  class?: string;  // Additional Tailwind classes
}
```

### `class` (optional)

Additional Tailwind CSS classes to apply to the wrapper. Common use cases:

- **Spacing**: `class="mt-8 mb-4"` - Add external margins
- **Gap override**: `class="gap-8"` - Override default `gap-4` spacing between children
- **Remove gap**: `class="gap-0"` - Remove spacing between children
- **MDX prose**: `class="not-prose"` - Prevents Tailwind Typography interference

Note: The component includes `gap-4` by default. Use `gap-*` in the class prop to override this.

## Implementation

The component uses a vertical flexbox layout for stacking and horizontal centering:

```astro
<div class="flex flex-col items-center gap-4 {className}">
  <slot />
</div>
```

### Layout Behavior

- **`flex flex-col`**: Stacks children vertically
- **`items-center`**: Centers children horizontally
- **`gap-4`**: Adds consistent 1rem spacing between children

### Why This Approach?

- Works with both inline and block content
- Handles mixed Markdown and component content in MDX
- No assumptions about child element widths
- Automatic spacing between multiple children
- Easy to override spacing via `class` prop

## Usage Examples

### Basic Centering

```astro
import Center from './Center.astro';
import Button from './Button.astro';

<Center>
  <Button>Click Me</Button>
</Center>
```

### With Spacing

```astro
<Center class="mt-8 mb-4">
  <Button variant="primary" size="large">Get Started</Button>
</Center>
```

### Multiple Items

Multiple items are stacked vertically with automatic spacing:

```astro
<Center>
  <Button variant="primary">Join Now</Button>
  <Button variant="secondary">Learn More</Button>
  <Button variant="inverse">Contact</Button>
</Center>
```

### Custom Spacing

Override the default `gap-4` spacing:

```astro
<Center class="gap-8">
  <img src="..." alt="..." class="w-32 h-32" />
  <Button>Learn More</Button>
</Center>
```

### Mixed Markdown and Components (MDX)

```mdx
<Center>
  - Key feature one
  - Key feature two
  - Key feature three

  <Button variant="primary" size="large" href="/signup">
    Get Started Today
  </Button>
</Center>
```

### In MDX with Prose

```mdx
import Center from '../../components/reusable/Center.astro';

<Center class="not-prose">
  <Button>Click Me</Button>
</Center>
```

The `not-prose` class prevents Tailwind Typography from applying unwanted styles to the centered content.

## Design Decisions

- **Minimal props**: Only `class` escape hatch keeps the component simple and flexible
- **Slot-based content**: Accepts any children without restrictions
- **No Alpine.js**: Pure CSS solution with no JavaScript overhead
- **Flexbox over alternatives**: Most versatile approach for horizontal centering
