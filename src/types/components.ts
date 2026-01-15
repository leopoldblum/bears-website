import type { CollectionEntry } from 'astro:content';

/**
 * Type alias for testimonial collection entries.
 * Replaces 'any' usage in testimonial processing and display components.
 *
 * @example
 * const testimonials = await getCollection('testimonials');
 * testimonials.map((testimonial: TestimonialEntry) => { ... })
 */
export type TestimonialEntry = CollectionEntry<'testimonials'>;

/**
 * Type alias for sponsor collection entries.
 * Replaces 'any' usage in sponsor tier and display components.
 */
export type SponsorEntry = CollectionEntry<'sponsors'>;

/**
 * Type alias for posts collection entries (events and projects).
 * Use with PostType to determine if entry is an event or project.
 */
export type PostEntry = CollectionEntry<'posts'>;
