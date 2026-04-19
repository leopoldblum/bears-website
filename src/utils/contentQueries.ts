import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, type Locale } from './i18n';

// ============================================================================
// COMPOSABLE SORTING UTILITIES
// ============================================================================

/**
 * Sorts collection entries by date in descending order (newest first).
 * Works with any collection that has a data.date property.
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
 */
export function sortBySlug<T extends { slug: string }>(
  entries: T[]
): T[] {
  return [...entries].sort((a, b) =>
    a.slug.localeCompare(b.slug)
  );
}

// ============================================================================
// LOCALE-AWARE FILTERING UTILITIES
// ============================================================================

/**
 * Filters entries to only those belonging to the given locale.
 * Entries are identified by their id prefix (e.g., "en/rocket-launch.mdx").
 * Falls back to defaultLocale entries when no entries exist for the requested locale.
 */
function filterByLocale<T extends { id: string }>(
  entries: T[],
  locale: Locale
): T[] {
  const localeEntries = entries.filter(e => e.id.startsWith(`${locale}/`));
  if (localeEntries.length > 0 || locale === DEFAULT_LOCALE) return localeEntries;
  // Fallback to default locale
  return entries.filter(e => e.id.startsWith(`${DEFAULT_LOCALE}/`));
}

/**
 * Filters out draft entries in production mode.
 * In DEV mode, all entries are returned (including drafts).
 */
export function filterDrafts<T extends { data: { isDraft?: boolean } }>(
  entries: T[]
): T[] {
  if (import.meta.env.DEV) {
    return entries;
  }
  return entries.filter(entry => !entry.data.isDraft);
}

/**
 * Strips the locale prefix from a content entry slug.
 * e.g., "en/rocket-launch" → "rocket-launch"
 */
export function stripLocaleFromSlug(slug: string): string {
  return slug.replace(/^(en|de)\//, '');
}


// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR POSTS
// ============================================================================

/**
 * Gets all published events for a locale, sorted by date (newest first).
 * Falls back to default locale if no entries exist for the requested locale.
 */
export async function getPublishedEvents(locale: Locale = DEFAULT_LOCALE) {
  const allEvents = await getCollection('events');
  return sortByDateDesc(filterDrafts(filterByLocale(allEvents, locale)));
}

/**
 * Gets all published projects for a locale, sorted by date (newest first).
 * Falls back to default locale if no entries exist for the requested locale.
 */
export async function getPublishedProjects(locale: Locale = DEFAULT_LOCALE) {
  const allProjects = await getCollection('projects');
  return sortByDateDesc(filterDrafts(filterByLocale(allProjects, locale)));
}

/**
 * Gets all published posts (events + projects combined) for a locale, sorted by date.
 * Adds _collectionType marker to distinguish between events and projects.
 */
export async function getPublishedPosts(locale: Locale = DEFAULT_LOCALE) {
  const events = await getPublishedEvents(locale);
  const projects = await getPublishedProjects(locale);

  const eventsWithType = events.map(e => ({ ...e, _collectionType: 'events' as const }));
  const projectsWithType = projects.map(p => ({ ...p, _collectionType: 'projects' as const }));

  const combined = [...eventsWithType, ...projectsWithType];
  return sortByDateDesc(combined);
}

/**
 * Gets published projects for the "Meet the Team" section.
 * Only includes projects with displayMeetTheTeam: true.
 */
export async function getMeetTheTeamProjects(locale: Locale = DEFAULT_LOCALE) {
  const allProjects = await getCollection('projects');
  const localeProjects = filterByLocale(allProjects, locale);
  const published = filterDrafts(localeProjects).filter(
    p => p.data.displayMeetTheTeam === true
  );
  return sortByDateDesc(published);
}

/**
 * Gets the latest N published posts (events + projects) for a locale, sorted by date.
 */
export async function getLatestPosts(limit: number = 4, locale: Locale = DEFAULT_LOCALE) {
  const allPosts = await getPublishedPosts(locale);
  return allPosts.slice(0, limit);
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR INSTAGRAM
// ============================================================================

/**
 * Gets all published Instagram posts, sorted by date (newest first).
 * Instagram posts are not locale-dependent.
 */
export async function getPublishedInstagramPosts() {
  const allPosts = await getCollection('instagram');
  return sortByDateDesc(filterDrafts(allPosts));
}

/**
 * Gets the latest N published Instagram posts, sorted by date.
 */
export async function getLatestInstagramPosts(limit: number = 3) {
  const allPosts = await getPublishedInstagramPosts();
  return allPosts.slice(0, limit);
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR OTHER COLLECTIONS
// ============================================================================

/**
 * Gets all testimonials for a locale, sorted by the `order` frontmatter field
 * (ascending). Ties break on slug for deterministic output.
 */
export async function getTestimonialsSorted(locale: Locale = DEFAULT_LOCALE) {
  const allTestimonials = await getCollection('testimonials');
  const localeEntries = filterByLocale(allTestimonials, locale);
  return [...localeEntries].sort((a, b) => {
    const orderDiff = a.data.order - b.data.order;
    if (orderDiff !== 0) return orderDiff;
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Gets all faces of BEARS for a locale, sorted by the `order` frontmatter
 * field (ascending). Ties break on slug for deterministic output.
 */
export async function getFacesOfBearsSorted(locale: Locale = DEFAULT_LOCALE) {
  const faces = filterByLocale(await getCollection('faces-of-bears'), locale);
  return [...faces].sort((a, b) => {
    const orderDiff = a.data.order - b.data.order;
    if (orderDiff !== 0) return orderDiff;
    return a.slug.localeCompare(b.slug);
  });
}

/**
 * Gets all sponsors grouped by tier, sorted within each tier by the `order`
 * frontmatter field (ascending). Ties break on slug for deterministic output.
 * Sponsors are not locale-dependent (logos + names stay the same).
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
  const validTiers = ['diamond', 'platinum', 'gold', 'silver', 'bronze'] as const;
  allSponsors.forEach(sponsor => {
    const tierRaw = sponsor.id.split('/')[0];
    if (!validTiers.includes(tierRaw as (typeof validTiers)[number])) {
      console.warn(`Unknown sponsor tier "${tierRaw}" in ${sponsor.id}, skipping`);
      return;
    }
    const tier = tierRaw as (typeof validTiers)[number];
    groupedSponsors[tier].push(sponsor);
  });

  const sortByOrder = (list: CollectionEntry<'sponsors'>[]) =>
    [...list].sort((a, b) => {
      const orderDiff = a.data.order - b.data.order;
      if (orderDiff !== 0) return orderDiff;
      return a.slug.localeCompare(b.slug);
    });

  return {
    diamond: sortByOrder(groupedSponsors.diamond),
    platinum: sortByOrder(groupedSponsors.platinum),
    gold: sortByOrder(groupedSponsors.gold),
    silver: sortByOrder(groupedSponsors.silver),
    bronze: sortByOrder(groupedSponsors.bronze),
  };
}

/**
 * Gets a single page content entry by its id and locale.
 * Falls back to default locale (English) if translation is missing.
 *
 * @param id - The entry id WITHOUT locale prefix (e.g., 'landing/what-is-bears')
 * @param locale - The desired locale
 */
export async function getPageContent(id: string, locale: Locale = DEFAULT_LOCALE) {
  const allContent = await getCollection('page-text');
  const cleanId = id.replace(/\.mdx?$/, '');

  // Try requested locale
  const localeId = `${locale}/${cleanId}.mdx`;
  let entry = allContent.find(entry => entry.id === localeId);

  // Fallback to default locale
  if (!entry && locale !== DEFAULT_LOCALE) {
    const fallbackId = `${DEFAULT_LOCALE}/${cleanId}.mdx`;
    entry = allContent.find(entry => entry.id === fallbackId);
  }

  if (!entry) {
    console.warn(`[getPageContent] No entry found for id "${id}" (locale: ${locale})`);
  }
  return entry;
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR DOCS
// ============================================================================

/**
 * Gets all documentation pages grouped by section and sorted by order.
 * Docs are not locale-dependent (English only for now).
 */
export async function getDocsBySection() {
  const allDocs = await getCollection('docs');

  const sections: Record<string, CollectionEntry<'docs'>[]> = {};

  allDocs.forEach(doc => {
    const section = doc.id.split('/')[0];
    if (!sections[section]) sections[section] = [];
    sections[section].push(doc);
  });

  Object.values(sections).forEach(docs =>
    docs.sort((a, b) => a.data.order - b.data.order)
  );

  return sections;
}

// ============================================================================
// PRE-COMPOSED QUERY FUNCTIONS FOR HERO SLIDES
// ============================================================================

/**
 * Gets all hero slides sorted by their `order` frontmatter field (ascending).
 * Ties break on the filename for deterministic output. Hero slides are not
 * locale-dependent.
 */
export async function getLandingHeroSlides() {
  const slides = await getCollection('hero-slides');
  return slides.sort((a, b) => {
    const orderDiff = a.data.order - b.data.order;
    if (orderDiff !== 0) return orderDiff;
    return a.id.localeCompare(b.id);
  });
}
