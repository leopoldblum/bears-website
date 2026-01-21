# Image Loader Utility Documentation

> **🔧 For Developers**

## Overview

The `imageLoader` utility provides centralized functions for dynamically loading images from glob imports with comprehensive fallback support and development warnings. This system ensures images always load gracefully, provides helpful debugging information during development, and handles the complexity of Astro's dynamic image imports.

## Location

[/src/utils/imageLoader.ts](imageLoader.ts)

## Architecture

The image loader system is built on three layers:

1. **Default Images** - Pre-imported fallback images for guaranteed non-null returns
2. **Core Functions** - Low-level image loading with configurable fallbacks and logging
3. **Type-Specific Convenience Functions** - High-level functions with sensible defaults

## Default Image Exports

Pre-imported default images that guarantee non-null ImageMetadata returns.

### `defaultEventImage`

**Import Path:**
```typescript
import { defaultEventImage } from '../utils/imageLoader';
```

**Source:** [/src/assets/default-images/default-event.jpg](../assets/default-images/default-event.jpg)

**Usage:** Fallback for events with no custom cover image

---

### `defaultProjectImage`

**Import Path:**
```typescript
import { defaultProjectImage } from '../utils/imageLoader';
```

**Source:** [/src/assets/default-images/default-project.jpg](../assets/default-images/default-project.jpg)

**Usage:** Fallback for projects with no custom cover image

---

### `defaultTestimonialImage`

**Import Path:**
```typescript
import { defaultTestimonialImage } from '../utils/imageLoader';
```

**Source:** [/src/assets/default-images/default-testimonial.jpg](../assets/default-images/default-testimonial.jpg)

**Usage:** Fallback for testimonials with no portrait image

---

### `defaultSponsorImage`

**Import Path:**
```typescript
import { defaultSponsorImage } from '../utils/imageLoader';
```

**Source:** [/src/assets/default-images/default-sponsor.jpg](../assets/default-images/default-sponsor.jpg)

**Usage:** Fallback for sponsors with no logo

---

## Core Functions

### `loadImage()`

Loads a single image from a glob import with optional fallback.

**Signature:**
```typescript
async function loadImage(options: LoadImageOptions): Promise<ImageMetadata | null>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.glob` | `Record<string, () => Promise<{ default: ImageMetadata }>>` | Glob import result |
| `options.imagePath` | `string` | Exact path to image file |
| `options.fallbackImage` | `ImageMetadata` (optional) | Fallback if image not found |
| `options.context` | `{ itemTitle?: string; itemSlug?: string }` (optional) | Context for logging |

**Returns:**
- `ImageMetadata` if image found and loaded successfully
- `fallbackImage` if provided and image not found/failed to load
- `null` if no fallback provided and image not found/failed to load

**Behavior:**
1. Checks if image exists in glob
2. Attempts to load the image
3. Falls back if loading fails
4. Logs warnings with emoji and context (⚠️)

**Example:**
```typescript
import { eventImages } from '../utils/imageGlobs';
import { loadImage } from '../utils/imageLoader';
import defaultEventImage from '../assets/default-images/default-event.jpg';

const image = await loadImage({
  glob: eventImages,
  imagePath: '/src/assets/events/event-1.jpg',
  fallbackImage: defaultEventImage,
  context: { itemTitle: 'My Event', itemSlug: 'my-event' }
});
// Logs: ⚠️ "My Event" (my-event) - Image "/src/assets/events/event-1.jpg" not found, falling back to default image
```

**Used in:**
- Internal implementation of higher-level functions
- [BecomeSponsor.astro](../components/BecomeSponsor.astro)

---

### `loadImagesForCollection()`

Loads images for entire collections with posts-specific logic.

**Signature:**
```typescript
async function loadImagesForCollection<T>(
  options: LoadImagesForCollectionOptions<T>
): Promise<Array<T & { loadedImage: ImageMetadata }>>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `options.glob` | `Record<string, () => Promise<{ default: ImageMetadata }>>` | Glob import result |
| `options.collection` | `T[]` | Array of collection entries |
| `options.baseDir` | `string` | Base directory for image paths |
| `options.imageField` | `'coverImage' \| 'image'` | Frontmatter field name |
| `options.fallbackImage` | `ImageMetadata` (optional) | Fallback for missing images |
| `options.postType` | `'event' \| 'project' \| 'testimonial'` (optional) | Type for logging |

**Returns:**
- Array of items with `loadedImage` property attached

**Special Logic for Posts with `coverImageType`:**

The function handles two types of content:

1. **Posts (events/projects)** - Have `coverImageType` field:
   - `coverImageType === "DEFAULT"`: Logs info emoji (🔹), uses fallback
   - `coverImageType === "CUSTOM"`: Attempts to load custom image
   - If custom load fails: Logs warning emoji (⚠️), falls back to default

2. **Other collections (testimonials)** - No `coverImageType`:
   - Attempts to load image from `coverImage` field
   - If load fails: Logs warning emoji (⚠️), falls back to default
   - Uses testimonial name (instead of title) in warning messages

**Example:**
```typescript
import { eventImages } from '../utils/imageGlobs';
import { loadImagesForCollection } from '../utils/imageLoader';
import { defaultEventImage } from '../utils/imageLoader';

const eventsWithImages = await loadImagesForCollection({
  glob: eventImages,
  collection: events,
  baseDir: '/src/assets/events',
  imageField: 'coverImage',
  fallbackImage: defaultEventImage,
  postType: 'event'
});

// Each item now has loadedImage property
eventsWithImages.map(event => event.loadedImage);
```

**Development Logging:**

```
🔹 Event "Summer Workshop" (summer-workshop) has no image provided, using DEFAULT cover image
⚠️ Event "Hackathon 2024" (hackathon-2024) - image "custom-cover.jpg" failed to load, using default
⚠️ Testimonial "John Doe" (john-doe) - image "portrait.jpg" failed to load, using default
```

**Used in:**
- [events.astro](../pages/events.astro)
- [projects.astro](../pages/projects.astro)
- [LatestNews.astro](../components/LatestNews.astro)
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)
- [Testimonials.astro](../components/Testimonials.astro)

---

### `loadAllImagesFromDirectory()`

Loads all images from a glob import without filtering.

**Signature:**
```typescript
async function loadAllImagesFromDirectory(
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>
): Promise<ImageMetadata[]>
```

**Parameters:**
- `glob` - Glob import result containing image paths

**Returns:**
- Array of `ImageMetadata` objects (failed loads removed)

**Behavior:**
- Attempts to load all images in glob
- Filters out failed loads silently
- Useful for carousels/galleries

**Example:**
```typescript
import { whatIsBearsImages } from '../utils/imageGlobs';
import { loadAllImagesFromDirectory } from '../utils/imageLoader';

const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
// Returns array of all successfully loaded images

// Use in markup
{carouselImages.map(image => (
  <Image src={image} alt="BEARS activity" loading="lazy" />
))}
```

**Used in:**
- [WhatIsBears.astro](../components/WhatIsBears.astro)

---

## Type-Specific Convenience Functions

These functions provide type-specific configuration, making them easier to use with sensible defaults.

### `loadCollectionImages()`

Unified collection image loader with type-specific configuration.

**Signature:**
```typescript
async function loadCollectionImages<T>(
  collection: T[],
  type: 'event' | 'project' | 'testimonial'
): Promise<Array<T & { loadedImage: ImageMetadata }>>
```

**Parameters:**
- `collection` - Collection of items to load images for
- `type` - Type of collection (`'event'`, `'project'`, or `'testimonial'`)

**Returns:**
- Array of items with `loadedImage` property attached (guaranteed non-null)

**Type-Specific Configuration:**

| Type | Glob | Base Directory | Fallback Image |
|------|------|----------------|----------------|
| `'event'` | `eventImages` | `/src/assets/events` | `defaultEventImage` |
| `'project'` | `projectImages` | `/src/assets/projects` | `defaultProjectImage` |
| `'testimonial'` | `testimonialImages` | `/src/assets/testimonials` | `defaultTestimonialImage` |

**Example:**
```typescript
import { loadCollectionImages } from '../utils/imageLoader';
import { getPublishedEvents, getPublishedProjects } from '../utils/contentQueries';

// Load event images
const events = await getPublishedEvents();
const eventsWithImages = await loadCollectionImages(events, 'event');

// Load project images
const projects = await getPublishedProjects();
const projectsWithImages = await loadCollectionImages(projects, 'project');

// Load testimonial images
const testimonials = await getTestimonialsSorted();
const testimonialsWithImages = await loadCollectionImages(testimonials, 'testimonial');
```

**Used in:**
- [events.astro](../pages/events.astro)
- [projects.astro](../pages/projects.astro)
- [LatestNews.astro](../components/LatestNews.astro)
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)
- [Testimonials.astro](../components/Testimonials.astro)

---

### `loadCoverImage()`

Unified cover image loader for single images.

**Signature:**
```typescript
async function loadCoverImage(
  fileName: string | undefined,
  type: 'event' | 'project',
  context?: { itemTitle?: string; itemSlug?: string }
): Promise<ImageMetadata>
```

**Parameters:**
- `fileName` - Filename of the cover image (without directory path)
- `type` - Type of image (`'event'` or `'project'`)
- `context` - Optional context for logging (item title and slug)

**Returns:**
- `ImageMetadata` (guaranteed non-null via fallback)

**Type-Specific Configuration:**

| Type | Glob | Base Directory | Fallback Image |
|------|------|----------------|----------------|
| `'event'` | `eventImages` | `/src/assets/events` | `defaultEventImage` |
| `'project'` | `projectImages` | `/src/assets/projects` | `defaultProjectImage` |

**Behavior:**
- If `fileName` is `undefined`, returns default image for type
- Otherwise attempts to load the specified image
- Falls back to default if load fails
- Logs warnings with context

**Example:**
```typescript
import { loadCoverImage } from '../utils/imageLoader';

// In a dynamic route like [slug].astro
const eventCover = await loadCoverImage(
  entry.data.coverImage,
  'event',
  { itemTitle: entry.data.title, itemSlug: entry.slug }
);

const projectCover = await loadCoverImage(
  entry.data.coverImage,
  'project',
  { itemTitle: entry.data.title, itemSlug: entry.slug }
);
```

**Used in:**
- [events/[slug].astro](../pages/events/[slug].astro)
- [projects/[slug].astro](../pages/projects/[slug].astro)

---

## TypeScript Interfaces

### `LoadImageOptions`

Options for loading a single image.

```typescript
interface LoadImageOptions {
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>;
  imagePath: string;
  fallbackImage?: ImageMetadata;
  context?: {
    itemTitle?: string;
    itemSlug?: string;
  };
}
```

---

### `LoadImagesForCollectionOptions<T>`

Options for loading images for a collection.

```typescript
interface LoadImagesForCollectionOptions<T> {
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>;
  collection: T[];
  baseDir: string;
  imageField: 'coverImage' | 'image';
  fallbackImage?: ImageMetadata;
  postType?: 'event' | 'project' | 'testimonial';
}
```

**Generic Constraint:**
```typescript
T extends {
  data: {
    coverImage?: string;
    image?: string;
    coverImageType?: string;
    title?: string;
    name?: string;
  };
  slug?: string;
}
```

---

## Common Patterns

### Pattern 1: Loading Images for a Listing Page

```typescript
---
// pages/events.astro
import { getPublishedEvents } from '../utils/contentQueries';
import { loadCollectionImages } from '../utils/imageLoader';

const events = await getPublishedEvents();
const eventsWithImages = await loadCollectionImages(events, 'event');
---

{eventsWithImages.map(event => (
  <article>
    <Image src={event.loadedImage} alt={event.data.title} />
    <h2>{event.data.title}</h2>
  </article>
))}
```

### Pattern 2: Loading a Single Cover Image

```typescript
---
// pages/events/[slug].astro
import { loadCoverImage } from '../utils/imageLoader';

export async function getStaticPaths() {
  const events = await getPublishedEvents();
  return events.map(entry => ({
    params: { slug: entry.slug },
    props: { entry }
  }));
}

const { entry } = Astro.props;
const coverImage = await loadCoverImage(
  entry.data.coverImage,
  'event',
  { itemTitle: entry.data.title, itemSlug: entry.slug }
);
---

<Image src={coverImage} alt={entry.data.title} loading="eager" />
```

### Pattern 3: Loading All Images for a Carousel

```typescript
---
// components/WhatIsBears.astro
import { whatIsBearsImages } from '../utils/imageGlobs';
import { loadAllImagesFromDirectory } from '../utils/imageLoader';

const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
---

<div class="marquee">
  {carouselImages.map(image => (
    <Image src={image} alt="BEARS activity" loading="lazy" />
  ))}
</div>
```

### Pattern 4: Mixing Events and Projects

```typescript
---
// components/LatestNews.astro
import { getLatestPosts, sortByDateDesc } from '../utils/contentQueries';
import { loadCollectionImages } from '../utils/imageLoader';

const latestPosts = await getLatestPosts(4);

// Separate by type
const events = latestPosts.filter(p => p.id.startsWith('events/'));
const projects = latestPosts.filter(p => p.id.startsWith('projects/'));

// Load images separately for each type
const eventsWithImages = await loadCollectionImages(events, 'event');
const projectsWithImages = await loadCollectionImages(projects, 'project');

// Merge and re-sort
const allPostsWithImages = sortByDateDesc([...eventsWithImages, ...projectsWithImages]);
---
```

---

## Understanding `coverImageType` Logic

Posts (events and projects) use a `coverImageType` field to distinguish between default and custom images.

### Frontmatter Values

```markdown
---
# Option 1: Use default image
title: My Event
coverImageType: DEFAULT
# coverImage field is ignored
---

# Option 2: Use custom image
title: My Event
coverImageType: CUSTOM
coverImage: my-custom-image.jpg
---
```

### How It Works

```typescript
// Content collection schema transforms frontmatter
// If coverImage is empty/undefined → coverImageType: "DEFAULT"
// If coverImage has a value → coverImageType: "CUSTOM"
```

### Loading Behavior

| `coverImageType` | `coverImage` | Result | Log |
|------------------|--------------|--------|-----|
| `"DEFAULT"` | (any) | Uses fallback | 🔹 Info |
| `"CUSTOM"` | `"image.jpg"` | Loads custom image | - |
| `"CUSTOM"` | `"missing.jpg"` | Uses fallback | ⚠️ Warning |

### Development Logging Examples

```
🔹 Event "Summer Workshop" (summer-workshop) has no image provided, using DEFAULT cover image
⚠️ Project "AI Research" (ai-research) - image "cover.jpg" failed to load, using default
```

---

## Development Warnings

The image loader provides helpful warnings during development to catch issues early.

### Warning Types

| Emoji | Type | Meaning |
|-------|------|---------|
| 🔹 | Info | Item intentionally uses default image (`coverImageType: DEFAULT`) |
| ⚠️ | Warning | Custom image failed to load, falling back to default |

### Example Console Output

```
🔹 Event "Team Meeting" (team-meeting) has no image provided, using DEFAULT cover image
⚠️ Event "Hackathon" (hackathon) - image "hackathon-cover.jpg" failed to load, using default
⚠️ Project "Rover" (rover) - image "rover.jpg" failed to load, using default
⚠️ Testimonial "Jane Smith" (jane-smith) - image "jane-portrait.jpg" failed to load, using default
```

### When Warnings Appear

Warnings only appear in development mode (`npm run dev`). They help you:
- Identify missing image files
- Catch typos in image filenames
- Ensure all content has appropriate images

---

## Troubleshooting

### Images Not Loading

**Check the file path matches exactly:**

```typescript
// ✅ Correct
'/src/assets/events/event-1.jpg'

// ❌ Wrong - missing leading slash
'src/assets/events/event-1.jpg'

// ❌ Wrong - case mismatch
'/src/assets/events/Event-1.jpg'
```

**Check the image file exists in the directory:**

```bash
ls src/assets/events/
# Ensure your image file is there
```

---

### Getting `null` Instead of Fallback

Ensure you're providing a fallback image:

```typescript
// ❌ No fallback - can return null
const image = await loadImage({
  glob: eventImages,
  imagePath: '/src/assets/events/missing.jpg'
});

// ✅ Has fallback - guaranteed ImageMetadata
const image = await loadImage({
  glob: eventImages,
  imagePath: '/src/assets/events/missing.jpg',
  fallbackImage: defaultEventImage
});
```

---

### TypeScript "Property 'loadedImage' Does Not Exist"

Ensure you're using the return type from the loader:

```typescript
// ❌ TypeScript doesn't know about loadedImage
const events = await getPublishedEvents();
events[0].loadedImage; // Error

// ✅ Loader attaches loadedImage property
const eventsWithImages = await loadCollectionImages(events, 'event');
eventsWithImages[0].loadedImage; // Works
```

---

### Console Warnings in Production

Warnings only appear in development. If you see them in production:

```bash
# Check your build mode
npm run build  # Should NOT show warnings
npm run preview  # Should NOT show warnings

# If warnings appear, check:
echo $NODE_ENV  # Should be "production"
```

---

### Custom Image Not Loading Despite Existing

Check the exact path including directory:

```typescript
// If your image is at: /src/assets/events/my-event.jpg
// And baseDir is: /src/assets/events
// Then coverImage in frontmatter should be:
coverImage: my-event.jpg

// Not:
coverImage: events/my-event.jpg  // ❌ Wrong
coverImage: /src/assets/events/my-event.jpg  // ❌ Wrong
```

---

## Best Practices

### 1. Use Type-Specific Functions When Possible

```typescript
// ✅ Good - concise, sensible defaults
const eventsWithImages = await loadCollectionImages(events, 'event');

// ❌ Avoid - verbose, error-prone
const eventsWithImages = await loadImagesForCollection({
  glob: eventImages,
  collection: events,
  baseDir: '/src/assets/events',
  imageField: 'coverImage',
  fallbackImage: defaultEventImage,
  postType: 'event'
});
```

### 2. Always Provide Context for Debugging

```typescript
// ✅ Good - helpful dev warnings
const coverImage = await loadCoverImage(
  entry.data.coverImage,
  'event',
  { itemTitle: entry.data.title, itemSlug: entry.slug }
);

// ❌ Missing context - generic warnings
const coverImage = await loadCoverImage(entry.data.coverImage, 'event');
```

### 3. Use `loadAllImagesFromDirectory()` for Carousels

```typescript
// ✅ Good - loads everything
const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);

// ❌ Avoid - too complex for simple carousel
const images = await loadImagesForCollection({ ... });
```

### 4. Separate Image Loading by Type

```typescript
// ✅ Good - clear separation
const eventsWithImages = await loadCollectionImages(events, 'event');
const projectsWithImages = await loadCollectionImages(projects, 'project');

// ❌ Avoid - mixing types causes wrong fallbacks
const allPosts = [...events, ...projects];
const allWithImages = await loadCollectionImages(allPosts, 'event'); // Projects get event fallback!
```

---

## Performance Considerations

### Lazy Loading Strategy

Use `loading="lazy"` for below-the-fold images:

```typescript
// Above the fold - eager load
<Image src={coverImage} alt={title} loading="eager" />

// Below the fold - lazy load
<Image src={event.loadedImage} alt={event.data.title} loading="lazy" />
```

### Parallel Loading

Image loaders use `Promise.all()` internally for parallel loading:

```typescript
// All images load in parallel - fast
const eventsWithImages = await loadCollectionImages(events, 'event');
```

### Default Image Optimization

Default images are pre-imported, so they're optimized at build time:

```typescript
// Imported at module level - optimized once
import defaultEventImage from '../assets/default-images/default-event.jpg';
```

---

## Related Documentation

- [Image Globs Utilities](imageGlobs.md) - Centralized glob pattern definitions
- [Content Queries Utilities](contentQueries.md) - Querying content collections
- [CLAUDE.md](../../CLAUDE.md) - Project image architecture
- [Managing Events and Projects Guide](../../guides/managing-events-and-projects.md) - Content creator guide
- [Astro Image Component Docs](https://docs.astro.build/en/guides/images/)
