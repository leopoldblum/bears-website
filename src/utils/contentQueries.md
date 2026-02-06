# Content Queries Utility Documentation

> **🔧 For Developers**

## Overview

The `contentQueries` utility provides composable sorting and filtering functions for Astro content collections, along with pre-composed query functions for common use cases. This centralized approach ensures consistency across the site and makes content querying more maintainable.

## Location

[/src/utils/contentQueries.ts](contentQueries.ts)

## Basic Usage

### Import and Use Pre-Composed Queries

```typescript
---
import { getPublishedEvents, getLatestPosts } from '../utils/contentQueries';

// Get all published events sorted by date
const events = await getPublishedEvents();

// Get latest 4 posts (events + projects combined)
const latestNews = await getLatestPosts(4);
---
```

### Compose Your Own Queries

```typescript
---
import { getCollection } from 'astro:content';
import { sortByDateDesc, filterDrafts } from '../utils/contentQueries';

// Custom query with composable utilities
const allPosts = await getCollection('posts');
const publishedPosts = filterDrafts(allPosts);
const sortedPosts = sortByDateDesc(publishedPosts);
---
```

## Architecture

This utility is organized into three categories:

1. **Composable Sorting Utilities** - Generic, reusable sorting functions
2. **Composable Filtering Utilities** - Generic, reusable filtering functions
3. **Pre-Composed Query Functions** - Common queries combining sorting and filtering

## Composable Sorting Utilities

### `sortByDateDesc()`

Sorts collection entries by date in descending order (newest first).

**Signature:**
```typescript
function sortByDateDesc<T extends { data: { date: Date } }>(
  entries: T[]
): T[]
```

**Parameters:**
- `entries` - Array of collection entries with a `data.date` property

**Returns:**
- New array sorted by date descending (does not mutate original)

**Example:**
```typescript
import { sortByDateDesc } from '../utils/contentQueries';

const sortedEvents = sortByDateDesc(allEvents);
// Events are now ordered newest → oldest
```

**Used in:**
- [events.astro](../pages/events.astro)
- [projects.astro](../pages/projects.astro)
- [LatestNews.astro](../components/LatestNews.astro)
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)

---

### `sortBySlug()`

Sorts collection entries alphabetically by slug in ascending order.

**Signature:**
```typescript
function sortBySlug<T extends { slug: string }>(
  entries: T[]
): T[]
```

**Parameters:**
- `entries` - Array of collection entries with a `slug` property

**Returns:**
- New array sorted by slug ascending (does not mutate original)

**Example:**
```typescript
import { sortBySlug } from '../utils/contentQueries';

const sortedSponsors = sortBySlug(goldSponsors);
// Sponsors sorted A → Z by slug
```

**Used in:**
- [Testimonials.astro](../components/Testimonials.astro)
- [BecomeSponsor.astro](../components/BecomeSponsor.astro)

---

## Composable Filtering Utilities

### `filterDrafts()`

Filters out draft entries in production mode. In development mode, all entries are returned (including drafts).

**Signature:**
```typescript
function filterDrafts<T extends { data: { isDraft?: boolean } }>(
  entries: T[]
): T[]
```

**Parameters:**
- `entries` - Array of collection entries with an `isDraft` property

**Returns:**
- Filtered array (all entries in DEV, non-drafts in production)

**Environment Behavior:**
- **Development mode (`npm run dev`)**: Returns all entries including drafts
- **Production mode (`npm run build`)**: Returns only non-draft entries

**Example:**
```typescript
import { filterDrafts } from '../utils/contentQueries';

const publishedPosts = filterDrafts(allPosts);
// In DEV: includes drafts
// In production: excludes drafts
```

**Used in:**
- `getPublishedEvents()`, `getPublishedProjects()`, `getMeetTheTeamProjects()`, `getPublishedInstagramPosts()` (internal usage)

---

## Pre-Composed Query Functions for Posts

### `getPublishedEvents()`

Gets all published events, sorted by date (newest first). Filters out drafts in production mode.

**Signature:**
```typescript
async function getPublishedEvents(): Promise<CollectionEntry<'posts'>[]>
```

**Returns:**
- Array of event posts sorted by date descending

**Example:**
```typescript
---
import { getPublishedEvents } from '../utils/contentQueries';

const events = await getPublishedEvents();
---
```

**Used in:**
- [events.astro](../pages/events.astro)
- [events/[slug].astro](../pages/events/[slug].astro)
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)

---

### `getPublishedProjects()`

Gets all published projects, sorted by date (newest first). Filters out drafts in production mode.

**Signature:**
```typescript
async function getPublishedProjects(): Promise<CollectionEntry<'posts'>[]>
```

**Returns:**
- Array of project posts sorted by date descending

**Example:**
```typescript
---
import { getPublishedProjects } from '../utils/contentQueries';

const projects = await getPublishedProjects();
---
```

**Used in:**
- [projects.astro](../pages/projects.astro)
- [projects/[slug].astro](../pages/projects/[slug].astro)
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)

---

### `getPublishedPosts()`

Gets all published posts (events + projects combined), sorted by date (newest first). Filters out drafts in production mode.

**Signature:**
```typescript
async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]>
```

**Returns:**
- Array of all posts sorted by date descending

**Example:**
```typescript
---
import { getPublishedPosts } from '../utils/contentQueries';

const allPosts = await getPublishedPosts();
---
```

**Used in:**
- [LatestNews.astro](../components/LatestNews.astro)

---

### `getMeetTheTeamProjects()`

Gets published projects for the "Meet the Team" section. Only includes projects with `displayMeetTheTeam: true`. Sorted by date (newest first).

**Signature:**
```typescript
async function getMeetTheTeamProjects(): Promise<CollectionEntry<'posts'>[]>
```

**Returns:**
- Array of team-displayable projects sorted by date descending

**Example:**
```typescript
---
import { getMeetTheTeamProjects } from '../utils/contentQueries';

const teamProjects = await getMeetTheTeamProjects();
---
```

**Used in:**
- [MeetTheTeam.astro](../components/MeetTheTeam.astro)

---

### `getLatestPosts()`

Gets the latest N published posts (events + projects), sorted by date. Useful for "Latest News" sections.

**Signature:**
```typescript
async function getLatestPosts(limit: number = 4): Promise<CollectionEntry<'posts'>[]>
```

**Parameters:**
- `limit` - Maximum number of posts to return (default: 4)

**Returns:**
- Array of latest posts sorted by date descending

**Example:**
```typescript
---
import { getLatestPosts } from '../utils/contentQueries';

// Get latest 4 posts
const latestNews = await getLatestPosts(4);

// Get latest 10 posts
const recentActivity = await getLatestPosts(10);
---
```

**Used in:**
- [LatestNews.astro](../components/LatestNews.astro)

---

## Pre-Composed Query Functions for Other Collections

### `getTestimonialsSorted()`

Gets all testimonials sorted alphabetically by slug.

**Signature:**
```typescript
async function getTestimonialsSorted(): Promise<CollectionEntry<'testimonials'>[]>
```

**Returns:**
- Array of testimonials sorted by slug

**Example:**
```typescript
---
import { getTestimonialsSorted } from '../utils/contentQueries';

const testimonials = await getTestimonialsSorted();
---
```

**Used in:**
- [Testimonials.astro](../components/Testimonials.astro)

---

### `getSponsorsByTier()`

Gets all sponsors grouped by tier, sorted alphabetically within each tier.

**Signature:**
```typescript
async function getSponsorsByTier(): Promise<{
  gold: CollectionEntry<'sponsors'>[];
  silver: CollectionEntry<'sponsors'>[];
  bronze: CollectionEntry<'sponsors'>[];
}>
```

**Returns:**
- Object with sponsors grouped by tier (gold, silver, bronze), each tier sorted alphabetically by slug

**How Tiers are Determined:**
Sponsor tiers are derived from the folder structure in the ID. For example:
- `gold/sponsor-name.md` → Gold tier
- `silver/another-sponsor.md` → Silver tier
- `bronze/third-sponsor.md` → Bronze tier

**Example:**
```typescript
---
import { getSponsorsByTier } from '../utils/contentQueries';

const { gold, silver, bronze } = await getSponsorsByTier();
---

<section>
  <h2>Gold Sponsors</h2>
  {gold.map(sponsor => <SponsorCard sponsor={sponsor} />)}
</section>

<section>
  <h2>Silver Sponsors</h2>
  {silver.map(sponsor => <SponsorCard sponsor={sponsor} />)}
</section>

<section>
  <h2>Bronze Sponsors</h2>
  {bronze.map(sponsor => <SponsorCard sponsor={sponsor} />)}
</section>
```

**Used in:**
- [BecomeSponsor.astro](../components/BecomeSponsor.astro)

---

## Common Patterns

### Pattern 1: Simple Listing Page

```typescript
---
// pages/events.astro
import { getPublishedEvents } from '../utils/contentQueries';
import { loadCollectionImages } from '../utils/imageLoader';

const events = await getPublishedEvents();
const eventsWithImages = await loadCollectionImages(events, 'event');
---

{eventsWithImages.map(event => (
  <EventCard event={event} image={event.loadedImage} />
))}
```

### Pattern 2: Latest News Section

```typescript
---
// components/LatestNews.astro
import { getLatestPosts } from '../utils/contentQueries';

const latestPosts = await getLatestPosts(4);
---

<section>
  <h2>Latest News</h2>
  {latestPosts.map(post => <PostCard post={post} />)}
</section>
```

### Pattern 3: Custom Filtered Query

```typescript
---
import { getPublishedProjects } from '../utils/contentQueries';

// Get all published projects, then filter by domain
const allProjects = await getPublishedProjects();
const aiProjects = allProjects.filter(p => p.data.domain === 'ai');
---
```

### Pattern 4: Combining Utilities

```typescript
---
import { getCollection } from 'astro:content';
import { sortByDateDesc, filterDrafts } from '../utils/contentQueries';

// Build a custom query
const allPosts = await getCollection('posts');
const published = filterDrafts(allPosts);
const recent = published.filter(p =>
  p.data.date > new Date('2024-01-01')
);
const sorted = sortByDateDesc(recent);
---
```

---

## Generic Type Constraints

All utility functions use TypeScript generics with constraints to ensure type safety while remaining reusable:

### Date Sorting Constraint

```typescript
T extends { data: { date: Date } }
```

Works with any collection entry that has a `data.date` property.

### Slug Sorting Constraint

```typescript
T extends { slug: string }
```

Works with any collection entry that has a `slug` property.

### Draft Filtering Constraint

```typescript
T extends { data: { isDraft?: boolean } }
```

Works with any collection entry that has an optional `data.isDraft` property.

---

## Draft Filtering Behavior

Draft filtering respects the build environment:

### Development Mode (`npm run dev`)

```typescript
const posts = await getPublishedEvents();
// Returns ALL events, including those with isDraft: true
```

This allows content creators to preview drafts locally.

### Production Mode (`npm run build`)

```typescript
const posts = await getPublishedEvents();
// Returns ONLY events where isDraft is false or undefined
```

This ensures drafts are never published to the live site.

### Implementation

Internally uses `import.meta.env.DEV`:

```typescript
if (import.meta.env.DEV) {
  return entries; // All entries in dev
}
return entries.filter(entry => !entry.data.isDraft); // Non-drafts in prod
```

---

## Troubleshooting

### No Posts Showing on Page

Check that you're using the correct query function:

```typescript
// For events only
const events = await getPublishedEvents();

// For projects only
const projects = await getPublishedProjects();

// For both combined
const allPosts = await getPublishedPosts();
```

### Drafts Not Showing in Development

Ensure you're running the dev server:

```bash
npm run dev
```

Not the preview server:

```bash
npm run preview  # This runs in production mode
```

### Wrong Sort Order

Check that your collection has a `date` property and it's a valid Date:

```markdown
---
title: My Event
date: 2024-01-15  # Must be a valid date
---
```

### TypeScript "Type Not Assignable" Error

Ensure your collection entries match the generic constraint:

```typescript
// ❌ Won't work - no date property
const sorted = sortByDateDesc(sponsors);

// ✅ Works - posts have date property
const sorted = sortByDateDesc(events);
```

---

## Best Practices

1. **Use Pre-Composed Queries When Possible** - They handle draft filtering and sorting consistently
2. **Don't Mutate Original Arrays** - All utilities return new arrays
3. **Compose for Custom Queries** - Combine utilities for specific needs
4. **Respect Draft Status** - Use `filterDrafts()` or pre-composed queries to respect draft settings
5. **Type Safety** - Let TypeScript guide you with generic constraints

---

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Project overview and architecture
- [Image Loader Utilities](imageLoader.md) - Loading images for content collections
- [Content Collections Guide](../../guides/managing-events-and-projects.md) - Managing content
- [Astro Content Collections Docs](https://docs.astro.build/en/guides/content-collections/)
