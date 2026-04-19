import { getCollection, getEntry } from 'astro:content';
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
 * Gets published projects for the "Meet the Team" section, each augmented with
 * its referenced person entry from the `people` collection.
 *
 * `displayName` and `displayRole` are projected once (with locale-correct role)
 * so callers don't need to know about the roleEn/roleDe split. Projects that
 * reference an unknown person are skipped with a dev warning rather than
 * crashing the build.
 */
export async function getMeetTheTeamProjectsWithPeople(locale: Locale = DEFAULT_LOCALE) {
  const allProjects = await getCollection('projects');
  const allPeople = await getCollection('people');
  const peopleBySlug = new Map(allPeople.map((p) => [p.slug, p]));

  const localeProjects = filterByLocale(allProjects, locale);
  const published = filterDrafts(localeProjects).filter(
    (p) => p.data.displayMeetTheTeam === true
  );

  return sortByDateDesc(published).flatMap((project) => {
    const ref = project.data.person;
    if (!ref) return [];
    // Astro's reference() at the schema layer surfaces as `{ collection, id }`
    // in the typed entry; the underlying frontmatter is just the slug string.
    const personSlug = typeof ref === 'string' ? ref : ref.id;
    const person = peopleBySlug.get(personSlug);
    if (!person) {
      console.warn(`[MeetTheTeam] project "${project.slug}" references unknown person "${personSlug}"`);
      return [];
    }
    return [{
      project,
      person,
      displayName: person.data.name,
      displayRole: locale === 'de' ? person.data.roleDe : person.data.roleEn,
    }];
  });
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
 * Reads the landing-page testimonials list (a single-entry `testimonials`
 * data collection backed by a Keystatic singleton, at
 * `src/content/testimonials/list.mdx`). Resolves each item's `person`
 * reference to the matching `people` entry and returns people-shaped entries
 * augmented with `role` (from the locale-appropriate roleEn/roleDe) and
 * `quote` (locale-appropriate). Array order in the file IS the carousel
 * order — no sort key. Items whose `person` reference doesn't resolve are
 * skipped with a dev warning.
 *
 * Return shape stays aligned with `CollectionEntry<'people'>` so callers can
 * feed the result directly into `loadCollectionImages(..., 'person')`.
 */
export async function getTestimonials(locale: Locale = DEFAULT_LOCALE) {
  const [list, people] = await Promise.all([
    getEntry('testimonials', 'list'),
    getCollection('people'),
  ]);
  if (!list) return [];
  const peopleBySlug = new Map(people.map((p) => [p.slug, p]));

  return list.data.items.flatMap((item, index) => {
    const ref = item.person;
    // Astro's reference() surfaces as `{ collection, id }` in the typed entry;
    // the underlying frontmatter is just the slug string.
    const personSlug = typeof ref === 'string' ? ref : ref.id;
    const person = peopleBySlug.get(personSlug);
    if (!person) {
      console.warn(`[Testimonials] item #${index + 1} references unknown person "${personSlug}"`);
      return [];
    }
    const quote = locale === 'de' ? item.quoteDe : item.quoteEn;
    return [{
      ...person,
      data: {
        ...person.data,
        role: locale === 'de' ? person.data.roleDe : person.data.roleEn,
        quote,
      },
    }];
  });
}

/**
 * Gets all people flagged `showInFaces: true`, sorted by `order` (ascending),
 * with `role` projected from the locale-appropriate roleEn/roleDe field. Ties
 * break on slug. The `people` collection is locale-agnostic — a single entry
 * per person — so we don't filter by locale folder here, only by the flag.
 */
export async function getFacesOfBearsPeople(locale: Locale = DEFAULT_LOCALE) {
  const all = await getCollection('people');
  const shown = all.filter((p) => p.data.showInFaces === true);
  return [...shown]
    .sort((a, b) => {
      const orderDiff = a.data.order - b.data.order;
      if (orderDiff !== 0) return orderDiff;
      return a.slug.localeCompare(b.slug);
    })
    .map((p) => ({
      ...p,
      data: {
        ...p.data,
        role: locale === 'de' ? p.data.roleDe : p.data.roleEn,
      },
    }));
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
