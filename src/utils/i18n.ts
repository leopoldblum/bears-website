export const LOCALES = ['en', 'de'] as const;
export const DEFAULT_LOCALE = 'en';
export type Locale = (typeof LOCALES)[number];

/**
 * Derives the current locale from a URL pathname.
 * Paths starting with /de/ are German; everything else is English (default).
 */
export function getLocale(url: URL): Locale {
  const pathname = url.pathname;
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de';
  return 'en';
}

/** Returns the other locale. */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'de' : 'en';
}

/**
 * Adds or removes the /de/ prefix to produce a URL for the target locale.
 * English (default) URLs have no prefix.
 * Preserves query strings and hash fragments.
 */
export function localizeUrl(path: string, locale: Locale): string {
  // Split off query string and hash
  const [pathPart, ...rest] = path.split(/(?=[?#])/);
  const suffix = rest.join('');
  const clean = stripLocalePrefix(pathPart);
  const localized = locale === 'en' ? (clean || '/') : `/de${clean}`;
  return localized + suffix;
}

/**
 * Strips /de prefix from a pathname, returning the bare path.
 * If the path has no prefix it's returned unchanged.
 */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/de') return '/';
  if (pathname.startsWith('/de/')) return pathname.slice(3);
  return pathname;
}

/** Returns absolute hreflang URLs for SEO link tags. */
export function getHreflangUrls(pathname: string, siteOrigin: string) {
  const bare = stripLocalePrefix(pathname);
  return {
    en: `${siteOrigin}${bare}`,
    de: `${siteOrigin}/de${bare === '/' ? '' : bare}`,
  };
}

/**
 * Locale-aware category labels for events and projects.
 */
export const categoryLabels: Record<Locale, Record<string, string>> = {
  en: {
    'competitions-and-workshops': 'Competitions & Workshops',
    'trade-fairs-and-conventions': 'Trade Fairs & Conventions',
    'kick-off-events': 'Kick-off Events',
    'experimental-rocketry': 'Experimental Rocketry',
    'science-and-experiments': 'Science & Experiments',
    'robotics': 'Robotics',
    'other': 'Other',
  },
  de: {
    'competitions-and-workshops': 'Wettbewerbe & Workshops',
    'trade-fairs-and-conventions': 'Messen & Konferenzen',
    'kick-off-events': 'Kick-off Events',
    'experimental-rocketry': 'Experimentelle Raketentechnik',
    'science-and-experiments': 'Wissenschaft & Experimente',
    'robotics': 'Robotik',
    'other': 'Sonstige',
  },
};

/** Look up a translated category label. Falls back to the raw key. */
export function getCategoryLabel(key: string, locale: Locale): string {
  return categoryLabels[locale]?.[key] ?? key;
}

/**
 * Locale-aware UI strings for events/projects catalog pages.
 */
export const catalogUiStrings: Record<Locale, Record<string, string>> = {
  en: {
    showing: 'Showing',
    of: 'of',
    'show-more': 'Show more',
    remaining: 'remaining',
    'clear-filters': 'Clear all filters',
    category: 'Category',
    // Events
    events: 'events',
    date: 'Date',
    upcoming: 'Upcoming',
    past: 'Past',
    // Projects
    projects: 'projects',
    status: 'Status',
    completed: 'Completed',
    ongoing: 'Ongoing',
  },
  de: {
    showing: 'Zeige',
    of: 'von',
    'show-more': 'Mehr anzeigen',
    remaining: 'verbleibend',
    'clear-filters': 'Alle Filter zurücksetzen',
    category: 'Kategorie',
    // Events
    events: 'Events',
    date: 'Datum',
    upcoming: 'Bevorstehend',
    past: 'Vergangen',
    // Projects
    projects: 'Projekte',
    status: 'Status',
    completed: 'Abgeschlossen',
    ongoing: 'Laufend',
  },
};

/**
 * Locale-aware UI strings for the media page.
 */
export const mediaUiStrings: Record<Locale, Record<string, string>> = {
  en: {
    'this-is': 'This is',
    'no-media': 'No media available at the moment.',
  },
  de: {
    'this-is': 'This is',
    'no-media': 'Derzeit sind keine Medien verfügbar.',
  },
};
