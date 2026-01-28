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
 * Type alias for content entries that represent events or projects.
 */
export type PostEntry = CollectionEntry<'events'> | CollectionEntry<'projects'>;
