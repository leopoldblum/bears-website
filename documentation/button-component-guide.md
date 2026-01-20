# Button Component Guide

## Overview

The Button component is a reusable, accessible component that provides consistent button styling across the BEARS website. It supports multiple visual variants, sizes, and can render as either a button or a link element.

## Location

`/src/components/reusable/Button.astro`

## Basic Usage

### In .astro Files

```astro
---
import Button from './reusable/Button.astro';
---

<Button variant="primary">Click me!</Button>
```

### In .mdx Files

```mdx
---
import Button from '../components/reusable/Button.astro'
---

# My Page

<Button variant="primary" href="/join">Join BEARS Today!</Button>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | Button text (fallback if no slot content provided) |
| `href` | `string` | - | If provided, renders as `<a>` link instead of `<button>` |
| `variant` | `'primary' \| 'secondary' \| 'inverse'` | `'primary'` | Visual style variant |
| `size` | `'standard' \| 'large'` | `'standard'` | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type (only for `<button>` elements) |
| `disabled` | `boolean` | `false` | Disables the button |
| `ariaLabel` | `string` | - | Custom ARIA label for accessibility |
| `xData` | `string` | - | Alpine.js x-data attribute |
| `onClick` | `string` | - | Alpine.js click handler (e.g., "showAll = true") |
| `xShow` | `string` | - | Alpine.js x-show attribute |
| `xBind` | `string` | - | Alpine.js x-bind:class attribute |
| `class` | `string` | - | Additional Tailwind classes |

## Variants

### Primary (Default)

Red background with darker hover state. Use for main CTAs on dark backgrounds.

```astro
<Button variant="primary">Join us!</Button>
```

**Styling:**
- Background: `bg-bears-accent` (#C50E1F)
- Text: `text-bears-text-onDark` (#E1E1E1)
- Hover: `hover:bg-bears-accent-muted` (#A00B19)

### Secondary

Dark background with red border that fills on hover. Use for secondary actions.

```astro
<Button variant="secondary">Learn more</Button>
```

**Styling:**
- Background: `bg-bears-bg` (#1A1A1A)
- Text: `text-bears-text-onDark` (#E1E1E1)
- Border: `border-2 border-bears-accent-muted`
- Hover: `hover:bg-bears-accent hover:border-bears-accent`

### Inverse

Dark background for light sections with opacity hover. Use on light backgrounds.

```astro
<Button variant="inverse">Learn More</Button>
```

**Styling:**
- Background: `bg-bears-text-onLight` (#2B2B2B)
- Text: `text-bears-text-onDark` (#E1E1E1)
- Hover: `hover:opacity-80`

## Sizes

### Standard (Default)

Regular button size with responsive padding.

```astro
<Button size="standard">Standard Button</Button>
```

**Padding:**
- Mobile: `px-4 py-2.5`
- Desktop (640px+): `px-6 py-2`
- Text: `text-sm sm:text-base`

### Large

Larger button with more generous padding.

```astro
<Button size="large">Large Button</Button>
```

**Padding:**
- Mobile: `px-6 py-2.5`
- Desktop (640px+): `px-8 py-3`

## Element Types

### Button Element

Default behavior. Renders as `<button>` element.

```astro
<Button variant="primary">I'm a button</Button>
<!-- Renders: <button type="button">I'm a button</button> -->
```

### Link Element

When `href` is provided, renders as `<a>` element with button styling.

```astro
<Button variant="primary" href="/contact">Contact Us</Button>
<!-- Renders: <a href="/contact">Contact Us</a> -->
```

## Content

### Text via Prop

```astro
<Button content="Click me" variant="primary" />
```

### Text via Slot

```astro
<Button variant="primary">Click me</Button>
```

### Icon Usage (Slot-Based)

Icons can be added using the default slot. Use flexbox utilities to position icons.

```astro
<Button variant="primary">
  <svg class="w-4 h-4 mr-2" fill="currentColor">
    <!-- SVG icon -->
  </svg>
  Download PDF
</Button>
```

**Icon Positioning Examples:**

```astro
<!-- Icon on left -->
<Button variant="primary">
  <svg class="w-4 h-4 mr-2">...</svg>
  Left Icon
</Button>

<!-- Icon on right -->
<Button variant="primary">
  Right Icon
  <svg class="w-4 h-4 ml-2">...</svg>
</Button>

<!-- Icon only (add ariaLabel for accessibility) -->
<Button variant="primary" ariaLabel="Close menu">
  <svg class="w-5 h-5">...</svg>
</Button>
```

## Alpine.js Integration

The Button component supports Alpine.js directives for interactive behavior.

### Click Events

```astro
<Button
  variant="primary"
  size="large"
  onClick="showAll = true"
>
  Show More
</Button>
```

### Conditional Display

```astro
<div x-show="!isVisible">
  <Button variant="primary" onClick="isVisible = true">
    Toggle Visibility
  </Button>
</div>
```

### Complex Alpine.js State

```astro
<Button
  variant="primary"
  xData="{ loading: false }"
  onClick="loading = true; await submitForm(); loading = false"
  xBind="loading && 'opacity-50 cursor-wait'"
>
  Submit
</Button>
```

## Accessibility

### ARIA Labels

Use `ariaLabel` for buttons without visible text (e.g., icon-only buttons).

```astro
<Button variant="primary" ariaLabel="Close dialog">
  <svg class="w-5 h-5"><!-- X icon --></svg>
</Button>
```

### Disabled State

Disabled buttons are not focusable and have reduced opacity.

```astro
<Button variant="primary" disabled>
  Unavailable Action
</Button>
```

**Note:** For link elements (`href` provided), the disabled state adds `aria-disabled="true"` and `pointer-events-none` class.

### Keyboard Navigation

- All buttons are keyboard accessible via Tab key
- Activate with Enter (links) or Space/Enter (buttons)
- Focus states use browser default focus rings

## Form Integration

### Submit Buttons

```astro
<form method="post" action="/api/subscribe">
  <input type="email" name="email" />
  <Button type="submit" variant="primary">
    Subscribe
  </Button>
</form>
```

### Reset Buttons

```astro
<form>
  <Button type="reset" variant="secondary">
    Clear Form
  </Button>
</form>
```

## Advanced Examples

### Combining Props

```astro
<Button
  variant="primary"
  size="large"
  href="/signup"
  ariaLabel="Sign up for BEARS membership"
>
  Join BEARS Today!
</Button>
```

### Custom Classes (Escape Hatch)

Use the `class` prop to add additional Tailwind classes. Use sparingly.

```astro
<Button variant="primary" class="shadow-lg animate-pulse">
  Special Offer
</Button>
```

**Warning:** Custom classes are appended after base classes. Avoid overriding critical layout or color styles.

### Full-Width Mobile Button

```astro
<Button variant="primary" class="w-full sm:w-auto">
  Mobile Full Width
</Button>
```

## Common Patterns

### Button Groups

```astro
<div class="flex gap-2 sm:gap-4">
  <Button variant="primary">Join us!</Button>
  <Button variant="secondary">Learn more</Button>
</div>
```

### Centered Button

```astro
<div class="flex justify-center">
  <Button variant="inverse" size="large">Learn More</Button>
</div>
```

### Toggle Buttons (Alpine.js)

```astro
<div x-data="{ showAll: false }">
  <div x-show="!showAll">
    <Button variant="primary" size="large" onClick="showAll = true">
      Show More
    </Button>
  </div>

  <div x-show="showAll">
    <Button variant="primary" size="large" onClick="showAll = false">
      Show Less
    </Button>
  </div>
</div>
```

## Design System Alignment

All button variants follow the BEARS design system:

- **Shape:** `rounded-full` (pill-shaped)
- **Font:** `font-medium`
- **Transitions:** `transition-colors` (smooth color changes)
- **Cursor:** `cursor-pointer` (pointer on hover)
- **Responsive:** Mobile-first sizing with `sm:` breakpoint

## Browser Support

The Button component uses standard HTML elements and CSS, ensuring compatibility with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from Raw Buttons

### Before (Raw HTML)

```astro
<button class="px-4 py-2.5 sm:px-6 sm:py-2 bg-bears-accent text-bears-text-onDark rounded-full hover:bg-bears-accent-muted transition-colors font-medium text-sm sm:text-base cursor-pointer">
  Join us!
</button>
```

### After (Button Component)

```astro
<Button variant="primary">Join us!</Button>
```

**Benefits:**
- 80% less code
- Consistent styling
- Easier maintenance
- Type safety (TypeScript autocomplete)

## Troubleshooting

### Button Not Rendering

Ensure you've imported the component:

```astro
---
import Button from './reusable/Button.astro';
---
```

### Styles Not Applying

The Button component uses Tailwind classes. Ensure your page imports the BaseLayout or global styles.

### Alpine.js Not Working

Verify Alpine.js is initialized on the page. Check that the parent component or page has Alpine.js loaded.

### TypeScript "Never Read" Warning

This is a false positive in Astro when components are used only in the template section. The component works correctly; you can ignore this warning.

## Questions?

If you encounter issues or have questions about using the Button component, refer to:
- [CLAUDE.md](../CLAUDE.md) - Project overview and architecture
- Astro Documentation: https://docs.astro.build/
- Tailwind CSS Documentation: https://tailwindcss.com/docs
