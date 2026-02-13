---
title: "Content Queries"
description: "Query utilities for fetching, filtering, and sorting content collections."
order: 51
group: "Systems"
---

All content query functions live in `src/utils/contentQueries.ts`. They follow a composable pattern: generic utilities are combined into pre-composed functions for each collection.

## Composable Utilities

### Sorting

```typescript
sortByDateDesc<T>(entries: T[]): T[]    // Newest first
sortBySlug<T>(entries: T[]): T[]        // Alphabetical by slug
```

Both return new arrays without mutating the original. They work with any collection entry that has the required field (`data.date` or `slug`).

### Filtering

```typescript
filterDrafts<T>(entries: T[]): T[]
```

In development (`import.meta.env.DEV`), returns all entries including drafts. In production, removes entries where `isDraft` is `true`.

## Pre-Composed Queries

### Posts (Events + Projects)

| Function | Returns | Notes |
|----------|---------|-------|
| `getPublishedEvents()` | `CollectionEntry<'events'>[]` | Filtered + sorted by date |
| `getPublishedProjects()` | `CollectionEntry<'projects'>[]` | Filtered + sorted by date |
| `getPublishedPosts()` | Combined array with `_collectionType` | Events + projects merged, sorted |
| `getLatestPosts(limit = 4)` | Sliced array of latest posts | Used by "Latest News" |
| `getMeetTheTeamProjects()` | Projects with `displayMeetTheTeam: true` | Filtered + sorted by date |

The `_collectionType` marker on combined posts is either `'events'` or `'projects'`, used to route to the correct detail page:

```typescript
const posts = await getPublishedPosts();
posts.forEach(post => {
  const href = `/${post._collectionType}/${post.slug}`;
});
```

### Instagram

| Function | Returns | Notes |
|----------|---------|-------|
| `getPublishedInstagramPosts()` | `CollectionEntry<'instagram'>[]` | Filtered + sorted by date |
| `getLatestInstagramPosts(limit = 3)` | Sliced array | Used by landing page |

### Other Collections

| Function | Returns | Notes |
|----------|---------|-------|
| `getTestimonialsSorted()` | `CollectionEntry<'testimonials'>[]` | Sorted by slug |
| `getFacesOfBearsSorted()` | `CollectionEntry<'faces-of-bears'>[]` | Sorted by slug (numeric prefix) |
| `getSponsorsByTier()` | `{ diamond, platinum, gold, silver, bronze }` | Grouped + sorted within each tier |
| `getPageContent(id)` | `CollectionEntry<'page-text'> \| undefined` | Single entry by ID |
| `getDocsBySection()` | `Record<string, CollectionEntry<'docs'>[]>` | Grouped by section folder |
| `getLandingHeroSlides()` | `CollectionEntry<'hero-slides'>[]` | Sorted by numeric filename prefix |

## Sponsor Tier Grouping

Sponsor tiers are derived from the folder structure. The `getSponsorsByTier()` function extracts the tier from the first segment of the entry's ID:

```typescript
const tier = sponsor.id.split('/')[0]; // "gold/acme-corp" → "gold"
```

The returned object has all five tiers, each sorted alphabetically by slug.

## Page Content

`getPageContent(id)` fetches a single `page-text` entry by its ID path. The `.md` extension is auto-appended if not provided:

```typescript
const content = await getPageContent('landing/what-is-bears');
// Resolves to entry with id "landing/what-is-bears.md"
```

A console warning is logged if the entry is not found.

## Docs Sections

`getDocsBySection()` groups docs by their folder path (e.g., `guides/`, `dev/`) and sorts within each section by the `order` field.

## Hero Slide Ordering

`getLandingHeroSlides()` sorts hero slides by the numeric prefix in their filename:

```
01-slide.md  →  parsed as 1
02-slide.md  →  parsed as 2
10-slide.md  →  parsed as 10
```

## Adding a New Query

Follow this pattern for new collections:

```typescript
export async function getMyCollectionSorted() {
  const all = await getCollection('my-collection');
  return sortBySlug(filterDrafts(all)); // or sortByDateDesc
}
```

For collections without `isDraft`, skip `filterDrafts()`. For collections with custom sorting, write the sort inline or create a new composable utility.
