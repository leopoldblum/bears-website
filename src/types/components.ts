import type { CollectionEntry } from 'astro:content';

// Testimonial types (replaces 'any' usage)
export type TestimonialEntry = CollectionEntry<'testimonials'>;

// Sponsor types (replaces 'any' usage)
export type SponsorEntry = CollectionEntry<'sponsors'>;

// Post types
export type PostEntry = CollectionEntry<'posts'>;
