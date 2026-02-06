import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

/**
 * Type alias for sponsor collection entries.
 * Replaces 'any' usage in sponsor tier and display components.
 */
export type SponsorEntry = CollectionEntry<'sponsors'>;

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
