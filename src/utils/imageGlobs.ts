/**
 * Centralized glob pattern definitions for image loading
 *
 * These patterns are used by the imageLoader utilities to dynamically
 * import images from the assets directory. By centralizing them here,
 * we ensure consistency across all components and pages.
 */
import type { ImageMetadata } from 'astro';

/**
 * Type for glob import results
 */
export type ImageGlob = Record<string, () => Promise<{ default: ImageMetadata }>>;

/**
 * Event cover images
 * Used by: events.astro, [slug].astro, LatestNews.astro
 */
export const eventImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp}"
);

/**
 * Project cover images
 * Used by: projects.astro, [slug].astro, LatestNews.astro, MeetTheTeam.astro
 */
export const projectImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/projects/*.{jpg,jpeg,png,webp}"
);

/**
 * Testimonial portrait images
 * Used by: Testimonials.astro
 */
export const testimonialImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/testimonials/*.{jpg,jpeg,png}"
);

/**
 * Sponsor logo images
 * Used by: BecomeSponsor.astro
 */
export const sponsorLogos: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/sponsors/*.{jpg,jpeg,png}"
);

/**
 * WhatIsBears carousel images
 * Used by: WhatIsBears.astro
 */
export const whatIsBearsImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/whatIsBears/*.{jpg,jpeg,png,webp}"
);
