/**
 * Centralized glob pattern definitions for image loading
 *
 * These patterns are used by the imageLoader utilities to dynamically
 * import images from the assets directory. By centralizing them here,
 * we ensure consistency across all components and pages.
 *
 * Note: Glob patterns use `*.*` so that files with uppercase extensions
 * (e.g. .JPG, .PNG) are picked up by Vite. Each glob is then filtered
 * through filterImageGlob/filterMediaGlob to keep only valid formats.
 * Supported formats are defined in src/utils/imageConstants.ts
 */
import type { ImageMetadata } from 'astro';
import { filterImageGlob, filterMediaGlob } from './imageConstants';

/**
 * Type for glob import results
 */
export type ImageGlob = Record<string, () => Promise<{ default: ImageMetadata }>>;

/**
 * Event cover images
 * Used by: events.astro, [slug].astro, LatestNews.astro
 */
export const eventImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/events/*.*"),
);

/**
 * Project cover images
 * Used by: projects.astro, [slug].astro, LatestNews.astro
 */
export const projectImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/projects/*.*"),
);

/**
 * Team member portrait images for Meet the Team section
 * Used by: MeetTheTeam.astro
 */
export const teamImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/projects/team-members/*.*"),
);

/**
 * Testimonial portrait images
 * Used by: Testimonials.astro
 */
export const testimonialImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/testimonials/*.*"),
);

/**
 * Sponsor logo images
 * Used by: BecomeSponsor.astro
 * Note: Includes subdirectories for tier-based organization
 */
export const sponsorLogos: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/sponsors/**/*.*"),
);

/**
 * WhatIsBears carousel images
 * Used by: WhatIsBears.astro
 */
export const whatIsBearsImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/whatIsBears/*.*"),
);

/**
 * Our Mission hero image
 * Used by: OurMission.astro
 */
export const ourMissionImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/about-us/our-mission/*.*"),
);

/**
 * Faces of BEARS portrait images
 * Used by: FacesOfBears.astro
 */
export const faceImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/faces-of-bears/*.*"),
);

/**
 * All hero images (across all sub-page hero folders)
 * Used by: media.astro
 */
export const allHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/**/*.*"),
);

/**
 * Sub-page hero images
 * Used by: about-us.astro, events.astro, projects.astro, media.astro, sponsors.astro, contact.astro
 */
export const aboutHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/about-us/*.*"),
);
export const eventsHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/events/*.*"),
);
export const projectsHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/projects/*.*"),
);
export const mediaHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/media/*.*"),
);
export const sponsorsHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/sponsors/*.*"),
);
export const contactHeroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/contact/*.*"),
);

/**
 * Header logo image
 * Used by: Header.astro
 * Place a single image in this directory to use as the site header logo.
 */
export const headerLogoImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/header/*.*"),
);

/**
 * Landing hero logo image
 * Used by: LandingHero.astro
 * Place a single image in this directory to use as the landing page hero logo.
 */
export const heroLogoImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/landingpage/logo/*.*"),
);

/**
 * Landing Hero background images
 * Used by: LandingHero.astro
 */
export const heroImages: ImageGlob = filterImageGlob(
  import.meta.glob<{ default: ImageMetadata }>("/src/assets/hero/landingpage/*.*"),
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
export const heroMedia: MediaGlob = filterMediaGlob(
  import.meta.glob<{ default: string }>(
    "/src/assets/hero/landingpage/*.*",
    { eager: false },
  ),
);
