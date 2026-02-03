// Re-export all types from a single entry point
export * from './content';
export * from './components';

// Note: ImageMetadata should be imported directly from 'astro'
// import type { ImageMetadata } from 'astro';

// Named exports for clarity
export type {
  PostType,
  SponsorTier,
  CategoryEvent,
  CategoryProject,
  CoverImageTypeValue,
} from './content';

export {
  CoverImageType,
  CategoryEventEnum,
  CategoryProjectEnum,
} from './content';

export type {
  TestimonialEntry,
  SponsorEntry,
  PostEntry,
  ImageWithAlt,
} from './components';
