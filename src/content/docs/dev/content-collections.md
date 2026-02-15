---
title: "Content Collections"
description: "Schema reference for all nine content collections."
order: 10
group: "Architecture"
---

All website content is managed through [Astro content collections](https://docs.astro.build/en/guides/content-collections/) with Zod schemas that validate frontmatter at build time. Schemas are defined in `src/content/config.ts`.

## Collections Overview

| Collection | Folder | Localized | Key Fields |
|------------|--------|-----------|------------|
| `events` | `src/content/events/{en,de}/` | Yes | title, description, date, categoryEvent, coverImage, isDraft |
| `projects` | `src/content/projects/{en,de}/` | Yes | title, description, date, categoryProject, coverImage, isDraft, isProjectCompleted |
| `testimonials` | `src/content/testimonials/{en,de}/` | Yes | quote, name, role, coverImage |
| `faces-of-bears` | `src/content/faces-of-bears/{en,de}/` | Yes | name, role, coverImage |
| `page-text` | `src/content/page-text/{en,de}/` | Yes | title, subtitle, description, ctas, items, socialLinks, navColumns, faqs, instagramButtonText |
| `sponsors` | `src/content/sponsors/<tier>/` | No | name, logo, url (tier from folder) |
| `hero-slides` | `src/content/hero-slides/` | No | type (image\|video), media, shownText, alt |
| `instagram` | `src/content/instagram/` | No | url, date, isDraft |
| `docs` | `src/content/docs/` | No | title, description, order, group |

**Localized collections** use `en/` and `de/` subfolders with identical filenames in each. Content queries filter by locale and fall back to English if a German translation is missing.

## Image Validation

All image filename fields (`coverImage`, `logo`, `personImage`) are validated against `IMAGE_EXTENSION_REGEX` from `src/utils/imageConstants.ts`. Only `.jpg`, `.jpeg`, `.png`, and `.webp` are accepted. The validation runs through a shared `validateImageExtension` helper in the config file.

## Schema Patterns

### isDraft Filtering

Events, projects, and Instagram posts support an `isDraft` field:

```typescript
isDraft: z.boolean().default(false).optional()
```

In development mode, all entries are visible. In production, entries with `isDraft: true` are filtered out by `filterDrafts()` in `src/utils/contentQueries.ts`.

### coverImageType Derivation

Events and projects schemas use a `.transform()` to derive a `coverImageType` field:

```typescript
.transform((data) => {
  const coverImageType = data.coverImage ? "CUSTOM" : "DEFAULT";
  return { ...data, coverImageType };
})
```

This discriminator is used by the image loader to decide whether to load a custom image or fall back to the default placeholder. Since `coverImage` is a required field, `coverImageType` will always be `"CUSTOM"` in practice. The `"DEFAULT"` path exists as a safety fallback but won't trigger under normal validation.

### Conditional Validation (Projects)

Projects support a "Meet the Team" feature with conditional fields. When `displayMeetTheTeam` is `true`, both `headOfProject` and `personImage` become required. This is enforced with two `.refine()` calls:

```typescript
.refine(
  (data) => !(data.displayMeetTheTeam === true && !data.headOfProject),
  { message: "headOfProject is required when displayMeetTheTeam is true" }
)
```

### Discriminated Unions (Hero Slides)

Hero slides use a `z.discriminatedUnion` on the `type` field to support two media types:

- **`image`** &mdash; requires `alt` (string)
- **`video`** &mdash; `alt` is optional

Both share `media` (filename) and `shownText` (optional overlay text). A separate `validateMediaExtension` helper additionally allows `.mp4`, `.webm`, and `.ogg` extensions.

### Sponsor Tier from Folder Structure

Sponsors don't declare a tier in frontmatter. The tier is derived from the subfolder name:

```
src/content/sponsors/
├── diamond/
├── platinum/
├── gold/
├── silver/
└── bronze/
```

The query function `getSponsorsByTier()` in `contentQueries.ts` groups entries by extracting the first path segment of their slug (e.g., `gold/acme-corp` &rarr; tier `gold`).

### Page Text Flexible Schema

The `page-text` collection is the most flexible schema, supporting many optional fields for different page sections:

| Field | Type | Purpose |
|-------|------|---------|
| `title` | string | Section heading (required) |
| `subtitle` | string? | Secondary heading |
| `description` | string? | Body copy |
| `seoDescription` | string? | Meta description override |
| `buttonText` / `buttonHref` | string? | Single CTA |
| `ctas` | array (max 4)? | Multiple CTAs with title, description, href |
| `items` | string[]? | Simple list items |
| `socialLinks` | array? | Platform + URL + optional hoverColor |
| `navLinks` | array? | Label + href pairs |
| `navColumns` | array? | Grouped navigation (heading + links) |
| `faqs` | array? | Question + answer pairs |
| `instagramButtonText` | string? | Instagram CTA button label |

## Adding a New Collection

1. Define the Zod schema in `src/content/config.ts`
2. Add it to the `collections` export at the bottom of the file
3. Create the content folder under `src/content/<name>/` (use `en/` and `de/` subfolders if the content needs translation)
4. If images are needed, create an asset folder in `src/assets/<name>/` and add a glob pattern in `src/utils/imageGlobs.ts`
5. Add query functions in `src/utils/contentQueries.ts` (use `filterByLocale()` for localized collections)
6. If the collection has categories, add a Zod enum in `src/types/content.ts` and labels in `src/utils/i18n.ts` (`categoryLabels`)
