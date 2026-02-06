# Type Definitions Documentation

Centralized TypeScript type definitions for the BEARS website.

## Overview

This directory contains shared type definitions used across the BEARS website codebase. Types are organized to provide a single source of truth for commonly used type definitions while maintaining code clarity and type safety.

## Organization

```
src/types/
├── index.ts               # Barrel export file - import types from here
├── content.ts             # Content-related types (PostType, SponsorTier, CoverImageType, category enums)
├── components.ts          # Collection entry type aliases (SponsorEntry, ImageWithAlt)
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
// When using getPublishedPosts(), posts have a _collectionType marker
const postType: PostType = post._collectionType;

// Alternatively, when querying collections directly:
const postType: PostType = 'events'; // or 'projects'
```

**Used in:**
- [src/components/LatestNews.astro](../components/LatestNews.astro)
- [src/components/PostShowcase.astro](../components/PostShowcase.astro)

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

#### `CategoryEventEnum`

Zod enum for event categories used for filtering and organization.

**Zod Schema (source of truth):**
```typescript
export const CategoryEventEnum = z.enum([
  'trade-fairs-and-conventions',
  'competitions-and-workshops',
  'kick-off-events',
  'other'
]);
```

**Usage:**
- Used in events collection schema validation
- Categorizes events by type (conventions, workshops, kickoffs)

**Accessing category options dynamically:**
```typescript
import { CategoryEventEnum } from '../types';

const allEventCategories = CategoryEventEnum.options;
// ['trade-fairs-and-conventions', 'competitions-and-workshops', 'kick-off-events', 'other']
```

---

#### `CategoryProjectEnum`

Zod enum for project categories used for filtering and organization.

**Zod Schema (source of truth):**
```typescript
export const CategoryProjectEnum = z.enum([
  'experimental-rocketry',
  'science-and-experiments',
  'robotics',
  'other'
]);
```

**Usage:**
- Used in projects collection schema validation
- Categorizes projects by technical domain

**Accessing category options dynamically:**
```typescript
import { CategoryProjectEnum } from '../types';

const allProjectCategories = CategoryProjectEnum.options;
// ['experimental-rocketry', 'science-and-experiments', 'robotics', 'other']
```

---

#### Project Schema Fields

In addition to category types, projects have specific schema fields defined in [src/content/config.ts](../content/config.ts):

**`isProjectCompleted`** (boolean, required)
- Indicates whether a project is completed or ongoing
- **Required field** - must be explicitly set for all projects
- Type: `z.boolean()` (no default value)
- When `true`: project is completed
- When `false`: project is ongoing/in-progress

**Usage:**
```typescript
const allProjects = await getCollection('projects');
const completedProjects = allProjects.filter(p => p.data.isProjectCompleted === true);
const ongoingProjects = allProjects.filter(p => p.data.isProjectCompleted === false);
```

**Frontmatter example:**
```yaml
---
title: "CubeSat Tracking System"
date: 2025-12-10
categoryProject: "experimental-rocketry"
isProjectCompleted: true
---
```

---

#### `CoverImageType`

Zod enum for discriminating between default and custom cover images.

```typescript
const CoverImageType = z.enum(["DEFAULT", "CUSTOM"]);
```

**Values:**
- `"DEFAULT"`: Post uses the default image for its type (event or project)
- `"CUSTOM"`: Post has a custom cover image specified in frontmatter

**Used in:** Content collection schema transformation

---

### Collection Entry Types (`components.ts`)

These type aliases provide proper typing for Astro content collection entries, replacing unsafe `any` usage.

#### `SponsorEntry`

Type alias for sponsor collection entries.

```typescript
type SponsorEntry = CollectionEntry<'sponsors'>;
```

**Replaces `any` in:**
- [src/components/SponsorTier.astro](../components/SponsorTier.astro)
- [src/components/BecomeSponsor.astro](../components/BecomeSponsor.astro)

---

## Design Philosophy

This project uses a **hybrid approach** to type organization:

### Centralized (in `/src/types/`)
- Shared primitive types (`PostType`, `SponsorTier`)
- Collection entry type aliases (`SponsorEntry`, `ImageWithAlt`)
- Types used across multiple unrelated files
- Zod schemas used in content collections (`CoverImageType`, `CategoryEventEnum`, `CategoryProjectEnum`)

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
- [Content Collections Guide](../../guides/managing-events-and-projects.md) - Using content types in practice
