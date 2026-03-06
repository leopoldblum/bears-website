import {
  getLocale,
  getAlternateLocale,
  localizeUrl,
  stripLocalePrefix,
  getHreflangUrls,
  getCategoryLabel,
  categoryLabels,
  catalogUiStrings,
  mediaUiStrings,
  LOCALES,
  DEFAULT_LOCALE,
} from '../i18n';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('i18n constants', () => {
  it('LOCALES contains en and de', () => {
    expect(LOCALES).toContain('en');
    expect(LOCALES).toContain('de');
    expect(LOCALES).toHaveLength(2);
  });

  it('DEFAULT_LOCALE is en', () => {
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

// ---------------------------------------------------------------------------
// getLocale
// ---------------------------------------------------------------------------

describe('getLocale', () => {
  it('returns "de" for /de path', () => {
    expect(getLocale(new URL('https://example.com/de'))).toBe('de');
  });

  it('returns "de" for /de/ path', () => {
    expect(getLocale(new URL('https://example.com/de/'))).toBe('de');
  });

  it('returns "de" for /de/about path', () => {
    expect(getLocale(new URL('https://example.com/de/about'))).toBe('de');
  });

  it('returns "de" for deeply nested German path', () => {
    expect(getLocale(new URL('https://example.com/de/events/my-event'))).toBe('de');
  });

  it('returns "en" for root path /', () => {
    expect(getLocale(new URL('https://example.com/'))).toBe('en');
  });

  it('returns "en" for /about path', () => {
    expect(getLocale(new URL('https://example.com/about'))).toBe('en');
  });

  it('returns "en" for /events/my-event path', () => {
    expect(getLocale(new URL('https://example.com/events/my-event'))).toBe('en');
  });

  it('returns "en" for paths that start with "de" but not "/de/"', () => {
    // e.g., /delivery or /demo should NOT be treated as German
    expect(getLocale(new URL('https://example.com/delivery'))).toBe('en');
    expect(getLocale(new URL('https://example.com/demo'))).toBe('en');
  });

  it('returns "en" for /de-something path (no slash after de)', () => {
    expect(getLocale(new URL('https://example.com/de-something'))).toBe('en');
  });

  it('handles query strings without confusion', () => {
    expect(getLocale(new URL('https://example.com/de/about?lang=en'))).toBe('de');
    expect(getLocale(new URL('https://example.com/about?lang=de'))).toBe('en');
  });

  it('handles hash fragments', () => {
    expect(getLocale(new URL('https://example.com/de/about#section'))).toBe('de');
  });
});

// ---------------------------------------------------------------------------
// getAlternateLocale
// ---------------------------------------------------------------------------

describe('getAlternateLocale', () => {
  it('returns "de" when given "en"', () => {
    expect(getAlternateLocale('en')).toBe('de');
  });

  it('returns "en" when given "de"', () => {
    expect(getAlternateLocale('de')).toBe('en');
  });
});

// ---------------------------------------------------------------------------
// stripLocalePrefix
// ---------------------------------------------------------------------------

describe('stripLocalePrefix', () => {
  it('strips /de to /', () => {
    expect(stripLocalePrefix('/de')).toBe('/');
  });

  it('strips /de/ prefix from path', () => {
    expect(stripLocalePrefix('/de/about')).toBe('/about');
  });

  it('strips /de/ prefix from nested path', () => {
    expect(stripLocalePrefix('/de/events/my-event')).toBe('/events/my-event');
  });

  it('returns / unchanged', () => {
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('returns English paths unchanged', () => {
    expect(stripLocalePrefix('/about')).toBe('/about');
    expect(stripLocalePrefix('/events/my-event')).toBe('/events/my-event');
  });

  it('does not strip paths that start with /de but not /de/', () => {
    expect(stripLocalePrefix('/delivery')).toBe('/delivery');
    expect(stripLocalePrefix('/demo')).toBe('/demo');
  });
});

// ---------------------------------------------------------------------------
// localizeUrl
// ---------------------------------------------------------------------------

describe('localizeUrl', () => {
  it('adds /de prefix for German locale', () => {
    expect(localizeUrl('/about', 'de')).toBe('/de/about');
  });

  it('removes /de prefix for English locale', () => {
    expect(localizeUrl('/de/about', 'en')).toBe('/about');
  });

  it('returns / for English root', () => {
    expect(localizeUrl('/', 'en')).toBe('/');
  });

  it('returns /de for German root', () => {
    expect(localizeUrl('/', 'de')).toBe('/de/');
  });

  it('converts /de to / for English', () => {
    expect(localizeUrl('/de', 'en')).toBe('/');
  });

  it('preserves query strings', () => {
    expect(localizeUrl('/about?ref=home', 'de')).toBe('/de/about?ref=home');
    expect(localizeUrl('/de/about?ref=home', 'en')).toBe('/about?ref=home');
  });

  it('preserves hash fragments', () => {
    expect(localizeUrl('/about#section', 'de')).toBe('/de/about#section');
    expect(localizeUrl('/de/about#section', 'en')).toBe('/about#section');
  });

  it('preserves both query string and hash', () => {
    expect(localizeUrl('/about?ref=home#section', 'de')).toBe('/de/about?ref=home#section');
  });

  it('does not double-prefix when already localized to same locale', () => {
    expect(localizeUrl('/de/about', 'de')).toBe('/de/about');
  });

  it('handles nested paths', () => {
    expect(localizeUrl('/events/my-event', 'de')).toBe('/de/events/my-event');
    expect(localizeUrl('/de/events/my-event', 'en')).toBe('/events/my-event');
  });
});

// ---------------------------------------------------------------------------
// getHreflangUrls
// ---------------------------------------------------------------------------

describe('getHreflangUrls', () => {
  const origin = 'https://bears.example.com';

  it('generates correct URLs for English page', () => {
    const result = getHreflangUrls('/about', origin);
    expect(result.en).toBe('https://bears.example.com/about');
    expect(result.de).toBe('https://bears.example.com/de/about');
  });

  it('generates correct URLs for German page', () => {
    const result = getHreflangUrls('/de/about', origin);
    expect(result.en).toBe('https://bears.example.com/about');
    expect(result.de).toBe('https://bears.example.com/de/about');
  });

  it('generates correct URLs for root page', () => {
    const result = getHreflangUrls('/', origin);
    expect(result.en).toBe('https://bears.example.com/');
    expect(result.de).toBe('https://bears.example.com/de');
  });

  it('generates correct URLs for /de root', () => {
    const result = getHreflangUrls('/de', origin);
    expect(result.en).toBe('https://bears.example.com/');
    expect(result.de).toBe('https://bears.example.com/de');
  });

  it('generates correct URLs for nested paths', () => {
    const result = getHreflangUrls('/events/my-event', origin);
    expect(result.en).toBe('https://bears.example.com/events/my-event');
    expect(result.de).toBe('https://bears.example.com/de/events/my-event');
  });
});

// ---------------------------------------------------------------------------
// getCategoryLabel
// ---------------------------------------------------------------------------

describe('getCategoryLabel', () => {
  it('returns English label for known category', () => {
    expect(getCategoryLabel('experimental-rocketry', 'en')).toBe('Experimental Rocketry');
  });

  it('returns German label for known category', () => {
    expect(getCategoryLabel('experimental-rocketry', 'de')).toBe('Experimentelle Raketentechnik');
  });

  it('returns the raw key for unknown category', () => {
    expect(getCategoryLabel('unknown-category', 'en')).toBe('unknown-category');
    expect(getCategoryLabel('unknown-category', 'de')).toBe('unknown-category');
  });

  it('has translations for all event categories', () => {
    const eventCategories = [
      'competitions-and-workshops',
      'trade-fairs-and-conventions',
      'kick-off-events',
      'other',
    ];
    for (const cat of eventCategories) {
      expect(getCategoryLabel(cat, 'en')).not.toBe(cat);
      expect(getCategoryLabel(cat, 'de')).not.toBe(cat);
    }
  });

  it('has translations for all project categories', () => {
    const projectCategories = [
      'experimental-rocketry',
      'science-and-experiments',
      'robotics',
      'other',
    ];
    for (const cat of projectCategories) {
      expect(getCategoryLabel(cat, 'en')).not.toBe(cat);
      expect(getCategoryLabel(cat, 'de')).not.toBe(cat);
    }
  });

  it('en and de labels have the same set of keys', () => {
    const enKeys = Object.keys(categoryLabels.en).sort();
    const deKeys = Object.keys(categoryLabels.de).sort();
    expect(enKeys).toEqual(deKeys);
  });
});

// ---------------------------------------------------------------------------
// UI string parity (en/de have same keys)
// ---------------------------------------------------------------------------

describe('UI string locale parity', () => {
  it('catalogUiStrings: en and de have the same keys', () => {
    const enKeys = Object.keys(catalogUiStrings.en).sort();
    const deKeys = Object.keys(catalogUiStrings.de).sort();
    expect(enKeys).toEqual(deKeys);
  });

  it('mediaUiStrings: en and de have the same keys', () => {
    const enKeys = Object.keys(mediaUiStrings.en).sort();
    const deKeys = Object.keys(mediaUiStrings.de).sort();
    expect(enKeys).toEqual(deKeys);
  });
});
