import type { ImageMetadata } from 'astro';

/**
 * Image with required alt text for accessibility.
 * Used by ImageGrid and other image display components.
 */
export interface ImageWithAlt {
  /** Image file to display — imported ImageMetadata or string path resolved by `<Img>`. */
  image: ImageMetadata | string;
  /** Descriptive alt text for accessibility (required) */
  alt: string;
}
