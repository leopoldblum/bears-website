import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// ============================================================================
// COMPOSABLE SORTING UTILITIES
// ============================================================================

/**
 * Sorts collection entries by date in descending order (newest first).
 * Works with any collection that has a data.date property.
 *
 * @param entries - Array of collection entries with a date property
 * @returns New array sorted by date descending (does not mutate original)
 *
 * @example
 * const sortedPosts = sortByDateDesc(allPosts);
 */
export function sortByDateDesc<T extends { data: { date: Date } }>(
  entries: T[]
): T[] {
  return [...entries].sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );
}

/**
 * Sorts collection entries alphabetically by slug in ascending order.
 * Works with any collection entry that has a slug property.
 *
 * @param entries - Array of collection entries with a slug property
 * @returns New array sorted by slug ascending (does not mutate original)
 *
 * @example
 * const sortedSponsors = sortBySlug(goldSponsors);
 */
export function sortBySlug<T extends { slug: string }>(
  entries: T[]
): T[] {
  return [...entries].sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );
}

// ============================================================================
// COMPOSABLE FILTERING UTILITIES
// ============================================================================

/**
 * Filters out draft entries in production mode.
 * In DEV mode, all entries are returned (including drafts).
 * Works with any collection that has an isDraft property.
 *
 * @param entries - Array of collection entries with an isDraft property
 * @returns Filtered array (all entries in DEV, non-drafts in production)
 *
 * @example
 * const publishedPosts = filterDrafts(allPosts);
 */
export function filterDrafts<T extends { data: { isDraft?: boolean } }>(
  entries: T[]
): T[] {
  if (import.meta.env.DEV) {
    return entries;
  }
  return entries.filter(entry => !entry.data.isDraft);
}


// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR POSTS
// ============================================================================

/**
 * Gets all published events, sorted by date (newest first).
 * Filters out drafts in production mode.
 *
 * @returns Array of event posts sorted by date descending
 *
 * @example
 * const events = await getPublishedEvents();
 */
export async function getPublishedEvents() {
  const allEvents = await getCollection('events', ({ data }) => {
    return import.meta.env.DEV || !data.isDraft;
  });
  return sortByDateDesc(allEvents);
}

/**
 * Gets all published projects, sorted by date (newest first).
 * Filters out drafts in production mode.
 *
 * @returns Array of project posts sorted by date descending
 *
 * @example
 * const projects = await getPublishedProjects();
 */
export async function getPublishedProjects() {
  const allProjects = await getCollection('projects', ({ data }) => {
    return import.meta.env.DEV || !data.isDraft;
  });
  return sortByDateDesc(allProjects);
}

/**
 * Gets all published posts (events + projects combined), sorted by date (newest first).
 * Filters out drafts in production mode.
 * Adds _collectionType marker to distinguish between events and projects.
 *
 * @returns Array of all posts sorted by date descending, with _collectionType property
 *
 * @example
 * const allPosts = await getPublishedPosts();
 * const events = allPosts.filter(p => p._collectionType === 'events');
 */
export async function getPublishedPosts() {
  const events = await getPublishedEvents();
  const projects = await getPublishedProjects();

  // Add collection type markers
  const eventsWithType = events.map(e => ({ ...e, _collectionType: 'events' as const }));
  const projectsWithType = projects.map(p => ({ ...p, _collectionType: 'projects' as const }));

  const combined = [...eventsWithType, ...projectsWithType];
  return sortByDateDesc(combined);
}

/**
 * Gets published projects for the "Meet the Team" section.
 * Only includes projects with displayMeetTheTeam: true.
 * Sorted by date (newest first).
 *
 * @returns Array of team-displayable projects sorted by date descending
 *
 * @example
 * const teamProjects = await getMeetTheTeamProjects();
 */
export async function getMeetTheTeamProjects() {
  const allProjects = await getCollection('projects', ({ data }) => {
    return data.displayMeetTheTeam === true &&
           (import.meta.env.DEV || !data.isDraft);
  });
  return sortByDateDesc(allProjects);
}

/**
 * Gets the latest N published posts (events + projects), sorted by date.
 * Useful for "Latest News" sections.
 *
 * @param limit - Maximum number of posts to return (default: 4)
 * @returns Array of latest posts sorted by date descending
 *
 * @example
 * const latestNews = await getLatestPosts(4);
 */
export async function getLatestPosts(limit: number = 4) {
  const allPosts = await getPublishedPosts();
  return allPosts.slice(0, limit);
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR INSTAGRAM
// ============================================================================

/**
 * Gets all published Instagram posts, sorted by date (newest first).
 * Filters out drafts in production mode.
 *
 * @returns Array of Instagram posts sorted by date descending
 *
 * @example
 * const posts = await getPublishedInstagramPosts();
 */
export async function getPublishedInstagramPosts() {
  const allPosts = await getCollection('instagram', ({ data }) => {
    return import.meta.env.DEV || !data.isDraft;
  });
  return sortByDateDesc(allPosts);
}

/**
 * Gets the latest N published Instagram posts, sorted by date.
 * Useful for the landing page Instagram section.
 *
 * @param limit - Maximum number of posts to return (default: 3)
 * @returns Array of latest Instagram posts sorted by date descending
 *
 * @example
 * const latestPosts = await getLatestInstagramPosts(3);
 */
export async function getLatestInstagramPosts(limit: number = 3) {
  const allPosts = await getPublishedInstagramPosts();
  return allPosts.slice(0, limit);
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR OTHER COLLECTIONS
// ============================================================================

/**
 * Gets all testimonials sorted alphabetically by slug.
 *
 * @returns Array of testimonials sorted by slug
 *
 * @example
 * const testimonials = await getTestimonialsSorted();
 */
export async function getTestimonialsSorted() {
  const allTestimonials = await getCollection('testimonials');
  return sortBySlug(allTestimonials);
}

/**
 * Gets all sponsors grouped by tier, sorted alphabetically within each tier.
 *
 * @returns Object with sponsors grouped by tier (gold, silver, bronze)
 *
 * @example
 * const { gold, silver, bronze } = await getSponsorsByTier();
 */
export async function getSponsorsByTier() {
  const allSponsors = await getCollection('sponsors');

  const groupedSponsors = {
    diamond: [] as CollectionEntry<'sponsors'>[],
    platinum: [] as CollectionEntry<'sponsors'>[],
    gold: [] as CollectionEntry<'sponsors'>[],
    silver: [] as CollectionEntry<'sponsors'>[],
    bronze: [] as CollectionEntry<'sponsors'>[],
  };

  // Group sponsors by tier (derived from folder structure)
  allSponsors.forEach(sponsor => {
    const tier = sponsor.id.split('/')[0] as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    groupedSponsors[tier].push(sponsor);
  });

  // Sort each tier alphabetically by slug
  return {
    diamond: sortBySlug(groupedSponsors.diamond),
    platinum: sortBySlug(groupedSponsors.platinum),
    gold: sortBySlug(groupedSponsors.gold),
    silver: sortBySlug(groupedSponsors.silver),
    bronze: sortBySlug(groupedSponsors.bronze),
  };
}

/**
 * Gets a single page content entry by its id.
 * Used for configurable page text (headings, descriptions, buttons).
 *
 * @param id - The entry id including subfolder (e.g., 'landing/what-is-bears')
 * @returns Single page content entry or undefined
 *
 * @example
 * const content = await getPageContent('landing/what-is-bears');
 * const title = content?.data.title;
 */
export async function getPageContent(id: string) {
  const allContent = await getCollection('page-text');
  const idWithExtension = id.endsWith('.md') ? id : `${id}.md`;
  const entry = allContent.find(entry => entry.id === idWithExtension);
  if (!entry) {
    console.warn(`[getPageContent] No entry found for id "${id}" (resolved to "${idWithExtension}")`);
  }
  return entry;
}

/**
 * Gets all hero slides sorted by numeric filename prefix.
 * Files should be prefixed with numbers for ordering (e.g., 01-slide.md, 02-slide.md).
 *
 * @returns Array of hero slides sorted by numeric prefix
 *
 * @example
 * const slides = await getLandingHeroSlides();
 */
export async function getLandingHeroSlides() {
  const slides = await getCollection('hero-slides');
  return slides.sort((a, b) => {
    const numA = parseInt(a.id.match(/^(\d+)/)?.[1] ?? '0', 10);
    const numB = parseInt(b.id.match(/^(\d+)/)?.[1] ?? '0', 10);
    return numA - numB;
  });
}
