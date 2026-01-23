import { z } from 'astro:content';

/**
 * Represents the type of post in the content collection.
 * Used to distinguish between events and projects for routing,
 * image loading, and display logic.
 *
 * @example
 * // When using getPublishedPosts(), posts have a _collectionType marker
 * const postType: PostType = post._collectionType;
 */
export type PostType = 'events' | 'projects';

/**
 * Sponsor tier levels for the BecomeSponsor section.
 * Determines logo size, spacing, and display order.
 */
export type SponsorTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/**
 * Zod enum for event categories used for filtering and organization.
 * Defines valid category values for events.
 *
 * Used in events collection schema validation.
 *
 * @example
 * // Access all valid event category options:
 * const allEventCategories = CategoryEventEnum.options;
 *
 * // Use in filtering:
 * const workshops = events.filter(e => e.data.categoryEvent === 'competitions-and-workshops');
 */
export const CategoryEventEnum = z.enum([
  'trade-fairs-and-conventions',
  'competitions-and-workshops',
  'kick-off-events',
  'other'
]);

/**
 * Inferred TypeScript type from CategoryEventEnum Zod schema.
 */
export type CategoryEvent = z.infer<typeof CategoryEventEnum>;

/**
 * Zod enum for project categories used for filtering and organization.
 * Defines valid category values for projects.
 *
 * Used in projects collection schema validation.
 *
 * @example
 * // Access all valid project category options:
 * const allProjectCategories = CategoryProjectEnum.options;
 *
 * // Use in filtering:
 * const rocketryProjects = projects.filter(p => p.data.categoryProject === 'experimental-rocketry');
 */
export const CategoryProjectEnum = z.enum([
  'experimental-rocketry',
  'science-and-experiments',
  'robotics',
  'other'
]);

/**
 * Inferred TypeScript type from CategoryProjectEnum Zod schema.
 */
export type CategoryProject = z.infer<typeof CategoryProjectEnum>;

/**
 * Zod enum for cover image type discrimination.
 * - DEFAULT: Post uses the default image for its type (event/project)
 * - CUSTOM: Post has a custom cover image specified in frontmatter
 *
 * Used in content collection schema transformation.
 */
export const CoverImageType = z.enum(["DEFAULT", "CUSTOM"]);

/**
 * Inferred TypeScript type from CoverImageType Zod enum.
 */
export type CoverImageTypeValue = z.infer<typeof CoverImageType>;
