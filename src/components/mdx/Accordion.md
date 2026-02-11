> **🔧 For Developers**
>
> **Just need to use accordions in content?** See the [Using Accordions guide](../../../guides/using-accordion.md) for content creators.

# Accordion Component Technical Reference

## Overview

The Accordion component is a reusable, accessible component that displays collapsible content sections. It uses Alpine.js for state management and provides smooth expand/collapse animations with keyboard accessibility.

Content is written in Markdown and automatically converted to HTML at build time using the unified/remark/rehype pipeline.

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
      content: `
- Crystal growth in microgravity
- Metallurgical solidification processes
      `
    },
    {
      title: "Fluid Dynamics",
      content: `Surface tension effects and capillary flow.`
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
| `allowMultiple` | `boolean` | `false` | Allow multiple sections to be open simultaneously. When `true`, each section toggles independently |

### AccordionItem Type

```typescript
interface AccordionItem {
  title: string;      // Header text (required)
  subtitle?: string;  // Optional subtitle/metadata
  content: string;    // Content in Markdown format (processed server-side to HTML)
}
```

## Features

### Self-Managed State

The Accordion component manages its own state using Alpine.js `x-data`.

**Single Mode (default `allowMultiple={false}`):**
Only one item can be open at a time. Clicking a section opens it and closes any previously open section.

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

**Multi Mode (`allowMultiple={true}`):**
Multiple items can be open simultaneously. Each section toggles independently without affecting others.

```astro
<Accordion
  items={featureList}
  allowMultiple={true}  // Multiple sections can be open
  defaultOpen={0}  // First item opens on load
/>
```

In multi mode, all sections can be closed regardless of the `defaultOpen` setting.

### Smooth Animations

Uses JavaScript-measured height animation via Alpine.js for smooth expand/collapse:
- **Open**: measures content `scrollHeight` once, animates `height` from current value to target (250ms ease-out), then sets `height: auto` for responsive flexibility
- **Close**: reads current rendered height, animates to `0px` (200ms ease-in)
- Respects `prefers-reduced-motion` by skipping animation and toggling instantly

### Dynamic Styling

The component has consistent styling across the site:
- **Height:** Dynamically adjusts to fit all content (no fixed height limit)
- **Borders:** Always visible between items and at top/bottom on large screens
- **Overflow:** No scrollbar - container grows to accommodate all expanded sections

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

The main content displayed when the section is expanded. Written in Markdown and automatically converted to HTML at build time.

```javascript
// Plain text
{
  title: "Section",
  content: "Simple text content"
}

// Markdown with formatting
{
  title: "Section",
  content: `
- Item 1
- Item 2

Visit our [projects page](/projects) for more info.
  `
}
```

**Styling:**
- Font: `text-sm sm:text-base`
- Color: `text-bears-text-onDark/90`
- Line height: `leading-relaxed`
- Padding: `pb-4 px-2`

## Markdown Processing

The Accordion component processes Markdown content at build time using the unified/remark/rehype pipeline.

### Processing Pipeline

```
Markdown → remark-parse → remark-gfm → remark-rehype → rehype-raw → rehype-stringify → HTML
```

**Pipeline stages:**
1. **remark-parse** - Parses Markdown string into an abstract syntax tree (AST)
2. **remark-gfm** - Adds GitHub Flavored Markdown support (tables, strikethrough, task lists, autolinks)
3. **remark-rehype** - Converts Markdown AST to HTML AST (with `allowDangerousHtml: true` for raw HTML passthrough)
4. **rehype-raw** - Parses raw HTML nodes in the Markdown
5. **rehype-stringify** - Serializes HTML AST to HTML string

### Supported Markdown Features

- **Text formatting**: Bold (`**text**`), italic (`*text*`), strikethrough (`~~text~~`)
- **Lists**: Ordered (`1.`, `2.`) and unordered (`-`, `*`)
- **Links**: `[text](url)` and autolinks
- **Code**: Inline code (`` `code` ``) and code blocks (` ``` `)
- **Headings**: `#`, `##`, `###`, etc.
- **Blockquotes**: `> quote`
- **Tables**: GitHub Flavored Markdown table syntax
- **Task lists**: `- [ ]` and `- [x]`
- **Horizontal rules**: `---` or `***`
- **Raw HTML**: HTML tags embedded in Markdown are preserved

### Performance

- **Build time processing**: All Markdown is converted to HTML during the Astro build process
- **Zero runtime overhead**: No client-side JavaScript for Markdown parsing
- **Parallel processing**: Uses `Promise.all` to process all accordion items simultaneously
- **Caching**: Astro's build cache handles unchanged content automatically

### Utility Function

The processing is handled by a reusable utility at `/src/utils/markdown.ts`:

```typescript
import { markdownToHtml } from '../../utils/markdown';

// In component frontmatter
const processedItems = await Promise.all(
  items.map(async (item) => ({
    ...item,
    content: await markdownToHtml(item.content)
  }))
);
```

This utility can be reused by other components that need Markdown processing.

## Alpine.js State Management

The component uses different state structures depending on the `allowMultiple` prop.

### Single Mode State (`allowMultiple={false}`)

In single mode, the component tracks which section is open using `activeIndex`:

```javascript
x-data="{
  activeIndex: null,  // null = all closed, number = index of open section
  allowCloseAll: true,  // true when defaultOpen is null/undefined
  allowMultiple: false,
  init() {
    this.$watch('activeIndex', () => {});
  }
}"
```

The `allowCloseAll` flag determines click behavior:
- `allowCloseAll: true` → clicking an open section closes it
- `allowCloseAll: false` → clicking always switches to that section (one must stay open)

### Multi Mode State (`allowMultiple={true}`)

In multi mode, the component tracks open sections using an array `openIndices`:

```javascript
x-data="{
  activeIndex: null,  // Not used in multi mode
  openIndices: [],  // Array of indices of open sections
  allowCloseAll: true,
  allowMultiple: true,
  init() {
    this.$watch('activeIndex', () => {});
    this.$watch('openIndices', () => {});
  }
}"
```

Each click toggles the section's presence in the `openIndices` array:
- If the index is in the array → remove it (close the section)
- If the index is not in the array → add it (open the section)

### Parent Component Sync

In single mode, the accordion syncs its `activeIndex` with parent components that have an `activeProject` property. This allows integration with project showcase pages.

**Note:** Parent sync only works in single mode. In multi mode, parent synchronization is skipped since multiple items can be open.

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
x-on:click="toggle(0)"
x-bind:aria-expanded="isOpen(0) ? 'true' : 'false'"
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

- Dynamic height (grows with content)
- No top/bottom borders
- Borders only between items

### Desktop (≥ 1024px)

- Dynamic height (grows with content)
- No max-height constraint or scrollbar
- Top and bottom borders on container
- Borders between items

## Common Patterns

### Research Areas

```astro
<Accordion
  items={[
    {
      title: "Materials Science",
      content: `
- Crystal growth experiments
- Alloy phase separation
- Polymer behavior studies
      `
    },
    {
      title: "Fluid Dynamics",
      content: `
- Surface tension analysis
- Capillary flow research
      `
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
      content: "Visit our membership page and fill out the application form. We welcome all students interested in aerospace."
    },
    {
      title: "What projects can I work on?",
      content: "We have ongoing projects in rocketry, satellite systems, and microgravity research. New members can join any team."
    }
  ]}
  defaultOpen={0}
/>
```

### Feature Checklist (Multi Mode)

Use multi mode when users need to compare multiple sections or when sections are independent:

```astro
<Accordion
  items={[
    {
      title: "Data Collection",
      content: `
- Temperature sensors
- Pressure monitoring
- Acceleration tracking
      `
    },
    {
      title: "Analysis Tools",
      content: `
- Real-time graphing
- Statistical analysis
- Export to CSV
      `
    },
    {
      title: "Safety Features",
      content: `
- Emergency stop
- Automatic alerts
- Backup systems
      `
    }
  ]}
  allowMultiple={true}
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
flex flex-col
lg:border-y lg:border-bears-text-onDark/20
```

The container dynamically grows to fit all content without a fixed height or scrollbar.

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
/* Panel wrapper */
overflow-hidden
/* height managed by Alpine.js: 0px (closed) → measured px → auto (open) */

/* Inner container */
px-4 pb-4
```

## Design System Alignment

The Accordion follows the BEARS design system:

- **Typography:** Responsive font sizes with `sm:` breakpoint
- **Colors:** Uses theme colors (`bears-text-onDark`, `bears-accent`)
- **Spacing:** Consistent padding and margins
- **Transitions:** Smooth JS-measured height animations (250ms open / 200ms close)
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

### Content Not Displaying as Markdown

Make sure you're using template literals (backticks) for Markdown content in MDX:

```javascript
// Correct
content: `
- Item 1
- Item 2
`

// Incorrect (single line strings may not render lists properly)
content: "- Item 1\n- Item 2"
```

### Multiple Sections Opening

If multiple sections are opening and you don't want this behavior:
- Ensure `allowMultiple` is not set to `true` (default is `false`)
- Check for conflicting Alpine.js state in parent components

If you **want** multiple sections to be open, use `allowMultiple={true}`.

## Performance Considerations

- **Rendering:** All items render in the DOM (height controlled by JS)
- **Animation:** Uses single DOM measurement + explicit pixel height transition (avoids per-frame grid layout recalculation)
- **State:** Lightweight Alpine.js state management
- **Reduced motion:** Respects `prefers-reduced-motion` by toggling instantly
- **Scalability:** Tested with 10+ items without performance issues

## Questions?

If you encounter issues or have questions about using the Accordion component, refer to:
- [CLAUDE.md](../../../CLAUDE.md) - Project overview and architecture
- [Using Accordions Guide](../../../guides/using-accordion.md) - Content creator guide
- Astro Documentation: https://docs.astro.build/
- Alpine.js Documentation: https://alpinejs.dev/
