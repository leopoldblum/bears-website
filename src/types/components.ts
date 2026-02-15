import type { ImageMetadata } from 'astro';

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
