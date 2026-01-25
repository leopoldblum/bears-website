# AGENTS.md

This file provides comprehensive guidance for agentic coding agents working with the BEARS website codebase.

## Project Overview

BEARS (Berlin Experimental Astronautics Research Student) website built with Astro.js 5.x, Tailwind CSS v4, and TypeScript. Uses static site generation with minimal JavaScript footprint.

## Development Commands

Run all commands from project root:

### Essential Commands
- `npm run dev` - Start development server at localhost:4321 (or next available port)
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally  
- `npm run astro -- --help` - Get help with Astro CLI commands

### Code Quality & Validation
- `npx astro check` - TypeScript and Astro type checking
- `npx astro build` - Build to verify no build errors exist

**Critical**: If you start `npm run dev`, you MUST stop the server before completing tasks. Use appropriate shell termination to prevent resource accumulation across multiple prompts.

## Technology Stack

- **Framework**: Astro.js 5.x (SSG/hybrid rendering)
- **Styling**: Tailwind CSS v4 (via Vite plugin)
- **Interactivity**: Alpine.js for lightweight client-side features
- **TypeScript**: Strict mode enabled (extends astro/tsconfigs/strict)
- **Content**: MDX for rich content with component support

## Code Style Guidelines

### File Organization & Naming
```
src/
├── components/          # Reusable components
│   ├── reusable/       # Generic components (Button, Carousel, etc.)
│   └── [ComponentName].astro
├── layouts/           # Page layout templates
├── pages/             # File-based routing
├── styles/            # Global styles (single Tailwind import)
├── assets/            # Images and static assets
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

**Naming Conventions**:
- **Components**: PascalCase (e.g., `Button.astro`, `SideBySide.astro`)
- **Files**: kebab-case for assets, PascalCase for components
- **Utilities**: camelCase (e.g., `markdownToHtml`)
- **Type exports**: Use barrel exports in `/src/types/index.ts`

### Import Patterns
```typescript
// Component imports - explicit and absolute
import { Image } from 'astro:assets';
import Button from '../components/reusable/Button.astro';

// Barrel exports for component groups
import { SideBySide, Left, Right } from '../components/reusable/SideBySide';

// Type imports
import type { ImageMetadata } from 'astro';
import type { ProjectEntry } from '../../types';
```

### Component Architecture

#### Astro Components (.astro)
```astro
---
// Component comment explaining purpose
// Brief usage notes if needed

interface Props {
  // Required props first
  required: string;
  
  // Optional props with defaults
  optional?: string;
  
  // Escape hatch for styling
  class?: string;
}

const { class: className, ...props } = Astro.props;
---

<!-- Use props with destructuring -->
<div class={`base-styles ${className || ''}`}>
  <slot />
</div>
```

#### TypeScript Interfaces
```typescript
// Use descriptive property names
// Document complex props with JSDoc
interface Props {
  /** Image alt text for accessibility */
  alt: string;
  
  /** Loading behavior - 'eager' for above-fold, 'lazy' for below-fold */
  loading?: 'eager' | 'lazy';
  
  /** Additional Tailwind classes */
  class?: string;
}
```

### Styling Guidelines

#### Tailwind CSS Usage
- **Mobile-first**: Base styles for mobile, progressive enhancement
- **Primary breakpoints**: `sm:` (640px) and `lg:` (1024px)
- **Avoid**: `md:` for major layout changes (creates awkward tablet layouts)
- **Prefer**: `flex-col lg:flex-row` over `flex-col md:flex-row lg:flex-row`

#### Responsive Strategy
```typescript
// Recommended pattern
grid-cols-1 lg:grid-cols-2        // Skip md:
gap-4 lg:gap-8                   // Larger gaps on desktop
text-sm lg:text-base              // Typography scaling
```

#### Headline Spacing
All h2 elements must use consistent spacing:
```astro
<h2 class="mb-6 sm:mb-8 lg:mb-12">
  <!-- Content -->
</h2>
```

### Image Handling

**CRITICAL**: Never use remote image URLs. ALL images must be local files.

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../../assets/projects/hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  class="w-full rounded-lg"
  loading="eager"  // Above-the-fold
  format="webp"
/>
```

**Asset Organization**:
```
src/assets/
├── events/      # Event cover images
├── projects/     # Project cover images  
├── sponsors/     # Sponsor logos
└── testimonials/ # Portrait images
```

### Error Handling

#### Component Error Boundaries
```typescript
// Graceful degradation for missing data
const { projects = [] } = Astro.props;

// Error handling in utilities
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // Process markdown
    return result;
  } catch (error) {
    console.error('Markdown processing failed:', error);
    return `<p>${markdown}</p>`; // Fallback
  }
}
```

#### Validation
```typescript
// PropTypes-style validation
interface Props {
  items: Array<{
    title: string;
    content?: string;  // Optional content
  }>;
}

// Runtime validation in components
const validatedItems = items.filter(item => item.title?.trim());
```

### MDX Components

When creating components for MDX usage:

```astro
---
import { markdownToHtml } from '../../utils/markdown';

interface Props {
  items: Array<{
    title: string;
    content: string;  // Markdown format string
  }>;
}

// Process Markdown server-side for performance
const processedItems = await Promise.all(
  items.map(async (item) => ({
    ...item,
    content: await markdownToHtml(item.content)
  }))
);
---

<div>
  {processedItems.map((item) => (
    <div set:html={item.content} />
  ))}
</div>
```

### Component Documentation

Every reusable component needs co-located documentation:

```markdown
# ComponentName - Technical Documentation

Brief description of purpose and usage.

## Props
```typescript
interface Props {
  prop1: string;    // Description
  prop2?: boolean;  // Optional with default
}
```

## Usage Examples
```astro
import ComponentName from './ComponentName.astro';

<ComponentName prop1="value" />
```
```

### Development Workflow

#### Creating New Components
1. Create component file in appropriate directory
2. Write component with TypeScript interfaces
3. Add co-located documentation (.md file)
4. Test in development server
5. Run `npx astro check` for validation

#### Modifying Existing Components
1. Read existing code and documentation
2. Maintain backward compatibility when possible
3. Update documentation to match changes
4. Test thoroughly with different content types

#### Content Collection Updates
When modifying schemas or data structures:
1. Update TypeScript types in `/src/types/`
2. Update documentation in `/guides/` if user-facing
3. Test with existing content files

### Performance Guidelines

- Use `loading="lazy"` for below-the-fold images
- Process Markdown server-side, not client-side
- Leverage Astro's static generation
- Minimize client-side JavaScript (prefer Alpine.js over heavy frameworks)
- Use `format="webp"` for Image components

### Accessibility Requirements

- All images need descriptive `alt` text
- Use semantic HTML elements appropriately
- Ensure keyboard navigation works
- Test color contrast ratios
- Include ARIA labels where needed

### Git Integration

Before committing changes:
1. Run `npx astro check` for type errors
2. Run `npm run build` to verify no build errors
3. Test in development browser
4. Update documentation if needed
5. Check no console errors in production preview

Remember: This is a static site. Build errors prevent deployment. Always validate build before completing tasks.