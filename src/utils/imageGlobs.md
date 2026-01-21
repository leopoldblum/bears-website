# Image Globs Utility Documentation

> **🔧 For Developers**

## Overview

The `imageGlobs` utility provides centralized glob pattern definitions for dynamically importing images from the assets directory. By centralizing these patterns, we ensure consistency across all components and pages, eliminate duplication, and provide a single source of truth for image imports.

## Location

[/src/utils/imageGlobs.ts](imageGlobs.ts)

## What Are Glob Imports?

Glob imports are Astro's way of dynamically importing multiple files matching a pattern:

```typescript
// Instead of this (static import)
import eventImage from '../assets/events/event-1.jpg';

// Use this (dynamic glob import)
const eventImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp}"
);
```

**Benefits:**
- Import all images from a directory at once
- Load images dynamically based on frontmatter data
- Automatically pick up new images without code changes
- Type-safe with TypeScript

## Centralized Image Format Configuration

All supported image formats are defined in a centralized constants file: [/src/utils/imageConstants.ts](imageConstants.ts)

This ensures consistency between:
- Glob patterns for loading images (this file)
- Schema validation for content collections ([config.ts](../content/config.ts))
- Error messages shown to users

### Supported Formats

The `VALID_IMAGE_EXTENSIONS` constant defines all supported formats:
- `.jpg` - JPEG images (most common)
- `.jpeg` - Alternative JPEG extension
- `.png` - PNG images (used for logos with transparency)
- `.webp` - Modern WebP format (better compression)

### Adding New Formats

To add support for a new image format (e.g., `.avif`):

1. Open [/src/utils/imageConstants.ts](imageConstants.ts)
2. Add the extension to the `VALID_IMAGE_EXTENSIONS` array:
   ```typescript
   export const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const;
   ```
3. That's it! All glob patterns and validation automatically update.

**No need to:**
- Update glob patterns in this file
- Update schema validation in config.ts
- Update error messages
- Update documentation (except this section)

Everything derives from that single array.

## Basic Usage

### Import a Glob Pattern

```typescript
---
import { eventImages } from '../utils/imageGlobs';

// eventImages is now a Record of image paths to loader functions
// {
//   '/src/assets/events/event-1.jpg': () => Promise<{ default: ImageMetadata }>,
//   '/src/assets/events/event-2.jpg': () => Promise<{ default: ImageMetadata }>,
//   ...
// }
---
```

### Use with Image Loader Utilities

```typescript
---
import { eventImages } from '../utils/imageGlobs';
import { loadCoverImage } from '../utils/imageLoader';

// Load a specific image from the glob
const coverImage = await loadCoverImage(
  entry.data.coverImage,
  'event'
);
---
```

## Type Definition

### `ImageGlob`

Type representing glob import results.

**Definition:**
```typescript
export type ImageGlob = Record<string, () => Promise<{ default: ImageMetadata }>>;
```

**Structure:**
- **Key**: Full path to the image file (e.g., `/src/assets/events/event-1.jpg`)
- **Value**: Function that returns a Promise resolving to an object with `default` property of type `ImageMetadata`

**Usage:**
```typescript
import type { ImageGlob } from '../utils/imageGlobs';

function customLoader(glob: ImageGlob) {
  // Your custom image loading logic
}
```

## Exported Glob Patterns

### `eventImages`

Glob pattern for event cover images.

**Pattern:**
```typescript
"/src/assets/events/*.{jpg,jpeg,png,webp}"
```

**Details:**
- **Directory**: `/src/assets/events/`
- **Formats**: JPG, JPEG, PNG, WebP
- **Purpose**: Cover images for event posts

**Used in:**
- [events.astro](../pages/events.astro) - Event listing page
- [events/[slug].astro](../pages/events/[slug].astro) - Event detail pages
- [LatestNews.astro](../components/LatestNews.astro) - Latest news section

**Example:**
```typescript
import { eventImages } from '../utils/imageGlobs';
import { loadCollectionImages } from '../utils/imageLoader';

const events = await getPublishedEvents();
const eventsWithImages = await loadCollectionImages(events, 'event');
```

---

### `projectImages`

Glob pattern for project cover images.

**Pattern:**
```typescript
"/src/assets/projects/*.{jpg,jpeg,png,webp}"
```

**Details:**
- **Directory**: `/src/assets/projects/`
- **Formats**: JPG, JPEG, PNG, WebP
- **Purpose**: Cover images for project posts

**Used in:**
- [projects.astro](../pages/projects.astro) - Project listing page
- [projects/[slug].astro](../pages/projects/[slug].astro) - Project detail pages
- [LatestNews.astro](../components/LatestNews.astro) - Latest news section
- [MeetTheTeam.astro](../components/MeetTheTeam.astro) - Team section

**Example:**
```typescript
import { projectImages } from '../utils/imageGlobs';
import { loadCollectionImages } from '../utils/imageLoader';

const projects = await getPublishedProjects();
const projectsWithImages = await loadCollectionImages(projects, 'project');
```

---

### `testimonialImages`

Glob pattern for testimonial portrait images.

**Pattern:**
```typescript
"/src/assets/testimonials/*.{jpg,jpeg,png,webp}"
```

**Details:**
- **Directory**: `/src/assets/testimonials/`
- **Formats**: JPG, JPEG, PNG, WebP
- **Purpose**: Portrait images for testimonials

**Used in:**
- [Testimonials.astro](../components/Testimonials.astro) - Testimonials carousel

**Example:**
```typescript
import { testimonialImages } from '../utils/imageGlobs';
import { loadCollectionImages } from '../utils/imageLoader';

const testimonials = await getTestimonialsSorted();
const testimonialsWithImages = await loadCollectionImages(testimonials, 'testimonial');
```

---

### `sponsorLogos`

Glob pattern for sponsor logo images.

**Pattern:**
```typescript
"/src/assets/sponsors/*.{jpg,jpeg,png,webp}"
```

**Details:**
- **Directory**: `/src/assets/sponsors/`
- **Formats**: JPG, JPEG, PNG, WebP
- **Purpose**: Logo images for sponsors

**Used in:**
- [BecomeSponsor.astro](../components/BecomeSponsor.astro) - Sponsor tiers section

**Example:**
```typescript
import { sponsorLogos } from '../utils/imageGlobs';
import { loadImageWithSimpleFallback } from '../utils/imageLoader';

const logo = await loadImageWithSimpleFallback({
  glob: sponsorLogos,
  imagePath: `/src/assets/sponsors/${sponsor.data.logo}`,
  fallbackImage: placeholderLogo
});
```

---

### `whatIsBearsImages`

Glob pattern for "What is BEARS?" carousel images.

**Pattern:**
```typescript
"/src/assets/whatIsBears/*.{jpg,jpeg,png,webp}"
```

**Details:**
- **Directory**: `/src/assets/whatIsBears/`
- **Formats**: JPG, JPEG, PNG, WebP
- **Purpose**: Carousel/marquee images for the "What is BEARS?" section

**Used in:**
- [WhatIsBears.astro](../components/WhatIsBears.astro) - Marquee carousel

**Example:**
```typescript
import { whatIsBearsImages } from '../utils/imageGlobs';
import { loadAllImagesFromDirectory } from '../utils/imageLoader';

const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
```

---

## Common Patterns

### Pattern 1: Loading Collection Images

Most common use case - loading images for a collection of items:

```typescript
---
import { eventImages } from '../utils/imageGlobs';
import { loadImagesForCollection } from '../utils/imageLoader';
import { getPublishedEvents } from '../utils/contentQueries';
import defaultEventImage from '../assets/default-images/default-event.jpg';

const events = await getPublishedEvents();

const eventsWithImages = await loadImagesForCollection({
  glob: eventImages,
  collection: events,
  baseDir: '/src/assets/events',
  imageField: 'coverImage',
  fallbackImage: defaultEventImage,
  postType: 'event'
});
---
```

### Pattern 2: Loading a Single Image

Loading one specific image from a glob:

```typescript
---
import { projectImages } from '../utils/imageGlobs';
import defaultProjectImage from '../assets/default-images/default-project.jpg';

const imagePath = `/src/assets/projects/${entry.data.coverImage}`;

let coverImage = defaultProjectImage;
if (projectImages[imagePath]) {
  try {
    const imageModule = await projectImages[imagePath]();
    coverImage = imageModule.default;
  } catch (error) {
    console.warn(`Failed to load ${imagePath}`);
  }
}
---
```

### Pattern 3: Loading All Images from a Directory

For carousels or galleries:

```typescript
---
import { whatIsBearsImages } from '../utils/imageGlobs';
import { loadAllImagesFromDirectory } from '../utils/imageLoader';

const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
---

<div class="carousel">
  {carouselImages.map(image => (
    <Image src={image} alt="BEARS activity" />
  ))}
</div>
```

---

## Benefits of Centralization

### 1. Single Source of Truth

All glob patterns are defined in one place. No duplicate glob definitions scattered across files.

**Before:**
```typescript
// In events.astro
const eventImages = import.meta.glob("/src/assets/events/*.{jpg,jpeg,png,webp}");

// In LatestNews.astro
const eventImages = import.meta.glob("/src/assets/events/*.{jpg,jpeg,png,webp}");

// In events/[slug].astro
const eventImages = import.meta.glob("/src/assets/events/*.{jpg,jpeg,png,webp}");
```

**After:**
```typescript
// All files import from one place
import { eventImages } from '../utils/imageGlobs';
```

### 2. Consistency

All files use the same patterns and formats, eliminating errors from typos or mismatched patterns.

### 3. Easy Updates

Need to add a new image format or change a directory? Update once in `imageGlobs.ts`.

```typescript
// Add .avif support for all events
export const eventImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp,avif}"  // Added avif
);
```

### 4. Better IDE Support

Importing from a central location provides better autocomplete and type checking.

### 5. Testability

Easier to mock glob imports in tests when they're centralized.

---

## Adding New Glob Patterns

When adding a new image category:

### Step 1: Define the Glob Pattern

Add to [imageGlobs.ts](imageGlobs.ts):

```typescript
/**
 * Team member profile images
 * Used by: TeamMembers.astro
 */
export const teamMemberImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/team-members/*.{jpg,jpeg,png,webp}"
);
```

### Step 2: Add Documentation Comment

Include:
- Brief description of the image category
- Which components use it
- Supported formats
- Directory path

### Step 3: Use in Components

```typescript
---
import { teamMemberImages } from '../utils/imageGlobs';
import { loadCollectionImages } from '../utils/imageLoader';

const members = await getCollection('team-members');
const membersWithImages = await loadCollectionImages({
  glob: teamMemberImages,
  collection: members,
  baseDir: '/src/assets/team-members',
  imageField: 'image',
  fallbackImage: defaultMemberImage
});
---
```

### Step 4: Update Documentation

Add the new glob pattern to this documentation file with:
- Pattern definition
- Details (directory, formats, purpose)
- Usage locations
- Example code

---

## Troubleshooting

### Images Not Loading

Check that the file path matches the glob pattern exactly:

```typescript
// ✅ Correct - matches pattern
'/src/assets/events/event-1.jpg'

// ❌ Wrong - missing leading slash
'src/assets/events/event-1.jpg'

// ❌ Wrong - incorrect directory
'/src/assets/event/event-1.jpg'
```

### TypeScript Errors

Ensure you're importing the type correctly:

```typescript
// ✅ Correct - type import
import type { ImageGlob } from '../utils/imageGlobs';

// ❌ Wrong - runtime import
import { ImageGlob } from '../utils/imageGlobs';
```

### Glob Not Picking Up New Images

After adding new images, rebuild the project:

```bash
# Stop dev server (Ctrl+C)
npm run dev  # Restart
```

Glob patterns are evaluated at build time, so new files require a rebuild.

### Unsupported Format Error

Check that your image format is included in the pattern:

```typescript
// Supports: jpg, jpeg, png, webp
"/src/assets/events/*.{jpg,jpeg,png,webp}"

// ❌ .gif not supported
// Add it to the pattern if needed:
"/src/assets/events/*.{jpg,jpeg,png,webp,gif}"
```

---

## Performance Considerations

### Glob Pattern Scope

Keep glob patterns as specific as possible:

```typescript
// ✅ Good - specific directory
"/src/assets/events/*.{jpg,jpeg,png,webp}"

// ❌ Avoid - too broad, slower builds
"/src/assets/**/*.{jpg,jpeg,png,webp}"
```

### Format Selection

Only include formats you actually use:

```typescript
// If you only use JPG and WebP
"/src/assets/events/*.{jpg,webp}"
```

Smaller glob patterns = faster builds.

---

## Related Documentation

- [Image Loader Utilities](imageLoader.md) - Using glob patterns to load images
- [Content Queries Utilities](contentQueries.md) - Querying content collections
- [CLAUDE.md](../../CLAUDE.md) - Project architecture and image handling
- [Astro Glob Imports Docs](https://docs.astro.build/en/guides/imports/#importmetaglob)
