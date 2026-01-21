> **🔧 For Developers**
>
> **Just need to use accordions in content?** See the [Using Accordions guide](../../../guides/using-accordion.md) for content creators.

# Accordion Component Technical Reference

## Overview

The Accordion component is a reusable, accessible component that displays collapsible content sections. It uses Alpine.js for state management and provides smooth expand/collapse animations with keyboard accessibility.

## Location

`/src/components/reusable/Accordion.astro`

## Basic Usage

### In .astro Files

```astro
---
import Accordion from './reusable/Accordion.astro';

const items = [
  {
    title: "Section 1",
    subtitle: "Optional metadata",
    content: "Content goes here"
  },
  {
    title: "Section 2",
    content: "More content"
  }
];
---

<Accordion items={items} />
```

### In .mdx Files

```mdx
---
import Accordion from '../../../components/reusable/Accordion.astro';
---

# My Page

<Accordion
  items={[
    {
      title: "Materials Science",
      content: `<ul class="list-disc pl-5 space-y-1">
<li>Crystal growth in microgravity</li>
<li>Metallurgical solidification processes</li>
</ul>`
    },
    {
      title: "Fluid Dynamics",
      content: "<p>Surface tension effects and capillary flow.</p>"
    }
  ]}
  defaultOpen={0}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<AccordionItem>` | `[]` | Array of accordion items to display |
| `defaultOpen` | `number \| null` | `null` | Index of the initially opened item, or `null` to start with all sections closed |
| `allowCloseAll` | `boolean` | Auto-derived | Whether clicking an open section closes it. Default: `true` when `defaultOpen` is null, `false` when set |

### AccordionItem Type

```typescript
interface AccordionItem {
  title: string;      // Header text (required)
  subtitle?: string;  // Optional subtitle/metadata
  content: string;    // Content (plain text or HTML)
}
```

## Features

### Self-Managed State

The Accordion component manages its own state using Alpine.js `x-data`. Only one item can be open at a time.

**Toggle Behavior:**
- When `defaultOpen` is omitted or `null`: Clicking an open section closes it (all sections can be closed)
- When `defaultOpen` is set to a number: One section must always be open (clicking only switches between sections)

```astro
<Accordion
  items={researchAreas}
  defaultOpen={0}  // First item opens on load, one must always stay open
/>

<Accordion
  items={researchAreas}
  defaultOpen={null}  // All sections closed on load, can toggle freely (default)
/>
```

### Smooth Animations

Uses CSS Grid transitions for smooth expand/collapse animations:
- Transition: `transition-[grid-template-rows] duration-300 ease-in-out`
- Open state: `grid-rows-[1fr]`
- Closed state: `grid-rows-[0fr]`

### Fixed Styling

The component has consistent styling across the site:
- **Max Height:** `lg:max-h-[550px]` (fixed at 550px on large screens)
- **Borders:** Always visible between items and at top/bottom on large screens
- **Overflow:** Scrollable on large screens if content exceeds max height

## Item Structure

### Title (Required)

The main header text for each accordion section. Displayed in a clickable button.

```javascript
{
  title: "Materials Science",
  // ...
}
```

**Styling:**
- Font: `text-base sm:text-lg font-semibold`
- Color: `text-bears-text-onDark` with `hover:text-bears-accent`
- Padding: `py-4 px-2`

### Subtitle (Optional)

Optional metadata or additional context displayed below the title when expanded.

```javascript
{
  title: "Project Name",
  subtitle: "Dr. Sarah Williams - Lead Researcher",
  content: "Project description..."
}
```

**Styling:**
- Font: `text-xs sm:text-sm font-medium`
- Color: `text-bears-accent`
- Spacing: `mb-2`

### Content (Required)

The main content displayed when the section is expanded. Supports both plain text and HTML.

```javascript
// Plain text
{
  title: "Section",
  content: "Simple text content"
}

// HTML content
{
  title: "Section",
  content: `<ul class="list-disc pl-5">
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>`
}
```

**Styling:**
- Font: `text-sm sm:text-base`
- Color: `text-bears-text-onDark/90`
- Line height: `leading-relaxed`
- Padding: `pb-4 px-2`

## Alpine.js State Management

### Active Index Tracking

The component tracks which section is open using `activeIndex`:

```javascript
x-data="{
  activeIndex: null,  // null = all closed, number = index of open section
  init() {
    this.$watch('activeIndex', () => {});
  }
}"
```

### Close Behavior Control

The component tracks whether all sections can be closed via `allowCloseAll`:

```javascript
x-data="{
  activeIndex: null,
  allowCloseAll: true,  // true when defaultOpen is null/undefined
  init() {
    this.$watch('activeIndex', () => {});
  }
}"
```

This flag determines click behavior:
- `allowCloseAll: true` → clicking an open section closes it
- `allowCloseAll: false` → clicking always switches to that section (one must stay open)

### Click Handlers

Each accordion button updates the active index with conditional toggle logic:

```astro
// When allowCloseAll is true
x-on:click="activeIndex = (allowCloseAll && activeIndex === 0) ? null : 0"  // Toggle first item

// When allowCloseAll is false
x-on:click="activeIndex = (allowCloseAll && activeIndex === 0) ? null : 0"  // Always opens first item (can't close)
```

The logic: if `allowCloseAll` is true AND the clicked item is already open, set to `null`. Otherwise, set to the clicked index.

### Conditional Classes

Content visibility is controlled via Alpine.js bindings:

```astro
x-bind:class="activeIndex === 0 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
```

## Accessibility

### ARIA Attributes

The component includes proper ARIA attributes for screen readers:

```astro
<button
  x-bind:aria-expanded="activeIndex === 0 ? 'true' : 'false'"
  aria-controls="accordion-item-0"
>
  Section Title
</button>

<div id="accordion-item-0">
  <!-- Content -->
</div>
```

### Keyboard Navigation

- **Tab:** Navigate between accordion headers
- **Enter/Space:** Expand/collapse sections
- **Focus states:** Browser default focus rings on buttons

### Screen Readers

- Proper semantic HTML (`<button>` for headers)
- ARIA expanded state indicates open/closed status
- Unique IDs link buttons to their content panels

## Responsive Behavior

### Mobile (< 1024px)

- No max-height constraint (full height)
- No top/bottom borders
- Borders only between items

### Desktop (≥ 1024px)

- Max height: 550px
- Scrollable if content exceeds height
- Top and bottom borders on container
- Borders between items

## Common Patterns

### Research Areas

```astro
<Accordion
  items={[
    {
      title: "Materials Science",
      content: `<ul class="list-disc pl-5 space-y-1">
<li>Crystal growth experiments</li>
<li>Alloy phase separation</li>
<li>Polymer behavior studies</li>
</ul>`
    },
    {
      title: "Fluid Dynamics",
      content: `<ul class="list-disc pl-5 space-y-1">
<li>Surface tension analysis</li>
<li>Capillary flow research</li>
</ul>`
    }
  ]}
  defaultOpen={0}
/>
```

### Team Projects (With Subtitles)

```astro
<Accordion
  items={projects.map(project => ({
    title: project.title,
    subtitle: project.headOfProject,
    content: project.description
  }))}
/>
```

### FAQ Section

```astro
<Accordion
  items={[
    {
      title: "How do I join BEARS?",
      content: "<p>Visit our membership page and fill out the application form. We welcome all students interested in aerospace.</p>"
    },
    {
      title: "What projects can I work on?",
      content: "<p>We have ongoing projects in rocketry, satellite systems, and microgravity research. New members can join any team.</p>"
    }
  ]}
  defaultOpen={0}
/>
```

## Advanced Usage

### Dynamic Content Loading

```astro
---
import { getCollection } from 'astro:content';

const faqs = await getCollection('faqs');
const accordionItems = faqs.map(faq => ({
  title: faq.data.question,
  content: faq.data.answer
}));
---

<Accordion items={accordionItems} />
```

### Integration with Other Components

The Accordion works well alongside other reusable components:

```mdx
## Research Areas

<Accordion items={researchFocusAreas} defaultOpen={0} />

## Get Involved

<div class="flex justify-center mt-8">
  <Button variant="primary" href="/contact">Join Our Research Team</Button>
</div>
```

## Styling Details

### Container

```css
/* Base classes */
flex flex-col lg:max-h-[550px] overflow-y-auto
lg:border-y lg:border-bears-text-onDark/20
```

### Item Wrapper

```css
border-t border-b border-bears-text-onDark/20
```

### Button (Header)

```css
w-full text-left py-4 px-2
text-base sm:text-lg font-semibold
text-bears-text-onDark hover:text-bears-accent
transition-colors duration-200 cursor-pointer
```

### Content Panel

```css
/* Wrapper for animation */
grid transition-[grid-template-rows] duration-300 ease-in-out

/* Open: grid-rows-[1fr] */
/* Closed: grid-rows-[0fr] */

/* Inner container */
overflow-hidden > div > pb-4 px-2
```

## Design System Alignment

The Accordion follows the BEARS design system:

- **Typography:** Responsive font sizes with `sm:` breakpoint
- **Colors:** Uses theme colors (`bears-text-onDark`, `bears-accent`)
- **Spacing:** Consistent padding and margins
- **Transitions:** Smooth 300ms animations
- **Accessibility:** Semantic HTML and ARIA attributes

## Browser Support

The Accordion component uses modern CSS Grid and Alpine.js, ensuring compatibility with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Requires Alpine.js to be loaded on the page (included in BaseLayout).

## Troubleshooting

### Accordion Not Rendering

Ensure you've imported the component and provided the `items` prop:

```astro
---
import Accordion from './reusable/Accordion.astro';
---

<Accordion items={[{ title: "Test", content: "Content" }]} />
```

### Alpine.js Not Working

Verify Alpine.js is initialized on the page. The BaseLayout includes Alpine.js automatically.

### Content Not Displaying as HTML

Make sure you're using template literals (backticks) for HTML content in MDX:

```javascript
// Correct
content: `<ul><li>Item</li></ul>`

// Incorrect (will show as plain text)
content: "<ul><li>Item</li></ul>"
```

### Multiple Sections Opening

This should not happen as the component enforces single-open behavior. If you experience this, check for conflicting Alpine.js state in parent components.

## Performance Considerations

- **Rendering:** All items render in the DOM (display controlled by CSS Grid)
- **Animation:** Uses GPU-accelerated CSS Grid transitions
- **State:** Lightweight Alpine.js state management
- **Scalability:** Tested with 10+ items without performance issues

## Questions?

If you encounter issues or have questions about using the Accordion component, refer to:
- [CLAUDE.md](../../../CLAUDE.md) - Project overview and architecture
- [Using Accordions Guide](../../../guides/using-accordion.md) - Content creator guide
- Astro Documentation: https://docs.astro.build/
- Alpine.js Documentation: https://alpinejs.dev/
