import { z } from 'astro:content';

/**
 * Represents the type of post in the content collection.
 * Used to distinguish between events and projects for routing,
 * image loading, and display logic.
 *
 * @example
 * const postType: PostType = post.slug.startsWith('events/') ? 'events' : 'projects';
 */
export type PostType = 'events' | 'projects';

/**
 * Sponsor tier levels for the BecomeSponsor section.
 * Determines logo size, spacing, and display order.
 */
export type SponsorTier = 'bronze' | 'silver' | 'gold';

/**
 * Zod enum for domain categories used for filtering and organization.
 * Defines valid domain values for posts (events and projects).
 *
 * Used in content collection schema validation.
 *
 * @example
 * // Access all valid domain options:
 * const allDomains = DomainEnum.options; // ['aerospace', 'robotics', ...]
 *
 * // Use in filtering:
 * const filteredPosts = posts.filter(p => p.data.domain === 'aerospace');
 */
export const DomainEnum = z.enum([
  'aerospace',
  'robotics',
  'ai',
  'sustainability',
  'education',
  'research',
  'other'
]);

/**
 * Inferred TypeScript type from DomainEnum Zod schema.
 */
export type Domain = z.infer<typeof DomainEnum>;

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
