/**
 * Centralized glob pattern definitions for image loading
 *
 * These patterns are used by the imageLoader utilities to dynamically
 * import images from the assets directory. By centralizing them here,
 * we ensure consistency across all components and pages.
 *
 * Note: Glob patterns must be static strings (Vite limitation).
 * Supported formats are defined in src/utils/imageConstants.ts
 */
import type { ImageMetadata } from 'astro';

/**
 * Type for glob import results
 */
export type ImageGlob = Record<string, () => Promise<{ default: ImageMetadata }>>;

/**
 * Event cover images
 * Used by: events.astro, [slug].astro, LatestNews.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const eventImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp}"
);

/**
 * Project cover images
 * Used by: projects.astro, [slug].astro, LatestNews.astro, MeetTheTeam.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const projectImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/projects/*.{jpg,jpeg,png,webp}"
);

/**
 * Testimonial portrait images
 * Used by: Testimonials.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const testimonialImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/testimonials/*.{jpg,jpeg,png,webp}"
);

/**
 * Sponsor logo images
 * Used by: BecomeSponsor.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const sponsorLogos: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/sponsors/*.{jpg,jpeg,png,webp}"
);

/**
 * WhatIsBears carousel images
 * Used by: WhatIsBears.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const whatIsBearsImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/whatIsBears/*.{jpg,jpeg,png,webp}"
);
