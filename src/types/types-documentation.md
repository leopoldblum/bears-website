# Type Definitions Documentation

Centralized TypeScript type definitions for the BEARS website.

## Overview

This directory contains shared type definitions used across the BEARS website codebase. Types are organized to provide a single source of truth for commonly used type definitions while maintaining code clarity and type safety.

## Organization

```
src/types/
├── index.ts               # Barrel export file - import types from here
├── content.ts             # Content-related types (PostType, SponsorTier, Domain, CoverImageType)
├── components.ts          # Collection entry type aliases (TestimonialEntry, SponsorEntry, PostEntry)
└── types-documentation.md # This file
```

## Usage

Import types from the root types directory:

```typescript
// Import single type
import type { PostType } from '../types';

// Import multiple types
import type { PostType, SponsorEntry } from '../types';

// Import Zod enum (note: not using 'type' keyword)
import { CoverImageType } from '../types';
```

## Type Definitions

### Content Types (`content.ts`)

#### `PostType`

Distinguishes between events and projects in the content collection.

```typescript
type PostType = 'events' | 'projects';
```

**Usage:**
```typescript
const postType: PostType = post.slug.startsWith('events/') ? 'events' : 'projects';
```

**Used in:**
- [src/components/LatestNews.astro](../components/LatestNews.astro)
- [src/components/NewsGridElement.astro](../components/NewsGridElement.astro)

---

#### `SponsorTier`

Defines sponsor tier levels for display and organization.

```typescript
type SponsorTier = 'bronze' | 'silver' | 'gold';
```

**Used in:**
- [src/components/SponsorTier.astro](../components/SponsorTier.astro)
- [src/components/BecomeSponsor.astro](../components/BecomeSponsor.astro)

**Affects:** Logo size, spacing, and display order in sponsor sections

---

#### `Domain`

Project domain categories for filtering and organization.

```typescript
type Domain =
  | 'aerospace'
  | 'robotics'
  | 'ai'
  | 'sustainability'
  | 'education'
  | 'research'
  | 'other';
```

**Defined in:** Content collection schema in [src/content/config.ts](../content/config.ts)

---

#### `CoverImageType`

Zod enum for discriminating between default and custom cover images.

```typescript
const CoverImageType = z.enum(["DEFAULT", "CUSTOM"]);
type CoverImageTypeValue = z.infer<typeof CoverImageType>;
```

**Values:**
- `"DEFAULT"`: Post uses the default image for its type (event or project)
- `"CUSTOM"`: Post has a custom cover image specified in frontmatter

**Used in:** Content collection schema transformation

---

### Collection Entry Types (`components.ts`)

These type aliases provide proper typing for Astro content collection entries, replacing unsafe `any` usage.

#### `TestimonialEntry`

Type alias for testimonial collection entries.

```typescript
type TestimonialEntry = CollectionEntry<'testimonials'>;
```

**Usage:**
```typescript
const testimonials = await getCollection('testimonials');
testimonials.map((testimonial: TestimonialEntry) => { ... })
```

**Replaces `any` in:**
- [src/components/Testimonials.astro](../components/Testimonials.astro)

---

#### `SponsorEntry`

Type alias for sponsor collection entries.

```typescript
type SponsorEntry = CollectionEntry<'sponsors'>;
```

**Replaces `any` in:**
- [src/components/SponsorTier.astro](../components/SponsorTier.astro)
- [src/components/BecomeSponsor.astro](../components/BecomeSponsor.astro)

---

#### `PostEntry`

Type alias for posts collection entries (both events and projects).

```typescript
type PostEntry = CollectionEntry<'posts'>;
```

**Note:** Use with `PostType` to determine if an entry is an event or project.

---

## Design Philosophy

This project uses a **hybrid approach** to type organization:

### Centralized (in `/src/types/`)
- Shared primitive types (`PostType`, `SponsorTier`, `Domain`)
- Collection entry type aliases (`TestimonialEntry`, `SponsorEntry`, `PostEntry`)
- Types used across multiple unrelated files
- Zod schemas used in content collections

### Co-located (within component files)
- Component-specific Props interfaces
- One-off types used only in that component
- Types that make the component more self-documenting

**Rationale:** This approach provides a single source of truth for shared types while keeping component interfaces readable and maintainable by keeping them close to their usage.

## Benefits

1. **Single Point of Truth**: Shared types defined once, imported everywhere
2. **Type Safety**: Eliminates unsafe `any` typing (removed 4 instances)
3. **Maintainability**: Changes to shared types happen in one place
4. **Discoverability**: Developers can find all shared types in `/src/types/`
5. **Consistency**: Enforces consistent typing across components
6. **IDE Support**: Better autocomplete and type checking

## Adding New Types

When adding new types, consider:

1. **Is this type used in multiple files?**
   - Yes → Add to `/src/types/`
   - No → Keep co-located with component

2. **Is this a content collection type?**
   - Primitive type (like PostType) → Add to `content.ts`
   - Collection entry alias → Add to `components.ts`

3. **Does it need JSDoc documentation?**
   - Add JSDoc comments explaining purpose and usage
   - Include `@example` tag for clarity

4. **Export from barrel file**
   - Add to `index.ts` exports for easy importing

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project overview and architectural guidance
- [Content Collections Guide](../../documentation/how-to-add-and-manage-events-and-projects.md) - Using content types in practice
