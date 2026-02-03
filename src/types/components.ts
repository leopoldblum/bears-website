import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

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

/**
 * Image with required alt text for accessibility.
 * Used by ImageGrid and other image display components.
 */
export interface ImageWithAlt {
  /** Image file to display */
  image: ImageMetadata;
  /** Descriptive alt text for accessibility (required) */
  alt: string;
}
