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
 * Used by: projects.astro, [slug].astro, LatestNews.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const projectImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/projects/*.{jpg,jpeg,png,webp}"
);

/**
 * Team member portrait images for Meet the Team section
 * Used by: MeetTheTeam.astro
 */
export const teamImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/projects/team-members/*.{jpg,jpeg,png,webp}"
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
 * Note: Includes subdirectories for tier-based organization
 */
export const sponsorLogos: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/sponsors/**/*.{jpg,jpeg,png,webp}"
);

/**
 * WhatIsBears carousel images
 * Used by: WhatIsBears.astro
 * Pattern: Generated from IMAGE_GLOB_PATTERN constant
 */
export const whatIsBearsImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/whatIsBears/*.{jpg,jpeg,png,webp}"
);

/**
 * Our Mission hero image
 * Used by: OurMission.astro
 */
export const ourMissionImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/about-us/our-mission/*.{jpg,jpeg,png,webp}"
);

/**
 * Faces of BEARS portrait images
 * Used by: FacesOfBears.astro
 */
export const faceImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/faces-of-bears/*.{jpg,jpeg,png,webp}"
);

/**
 * All hero images (across all sub-page hero folders)
 * Used by: media.astro
 */
export const allHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/**/*.{jpg,jpeg,png,webp}"
);

/**
 * Sub-page hero images
 * Used by: about-us.astro, events.astro, projects.astro, media.astro, sponsors.astro, contact.astro
 */
export const aboutHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/about-us/*.{jpg,jpeg,png,webp}"
);
export const eventsHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/events/*.{jpg,jpeg,png,webp}"
);
export const projectsHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/projects/*.{jpg,jpeg,png,webp}"
);
export const mediaHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/media/*.{jpg,jpeg,png,webp}"
);
export const sponsorsHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/sponsors/*.{jpg,jpeg,png,webp}"
);
export const contactHeroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/contact/*.{jpg,jpeg,png,webp}"
);

/**
 * Header logo image
 * Used by: Header.astro
 * Place a single image in this directory to use as the site header logo.
 */
export const headerLogoImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/header/*.{jpg,jpeg,png,webp}"
);

/**
 * Landing hero logo image
 * Used by: LandingHero.astro
 * Place a single image in this directory to use as the landing page hero logo.
 */
export const heroLogoImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/landingpage/logo/*.{jpg,jpeg,png,webp}"
);

/**
 * Landing Hero background images
 * Used by: LandingHero.astro
 */
export const heroImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/hero/landingpage/*.{jpg,jpeg,png,webp}"
);

/**
 * Type for media glob results (images and videos)
 */
export type MediaGlob = Record<string, () => Promise<{ default: string }>>;

/**
 * Landing Hero all media (images + videos)
 * Used by: LandingHero.astro
 * Includes: jpg, jpeg, png, webp, mp4, webm, ogg
 */
export const heroMedia: MediaGlob = import.meta.glob<{ default: string }>(
  "/src/assets/hero/landingpage/*.{jpg,jpeg,png,webp,mp4,webm,ogg}",
  { eager: false }
);
