import { getCollection } from 'astro:content';
import {
  sortByDateDesc,
  sortBySlug,
  filterDrafts,
  getPublishedEvents,
  getPublishedProjects,
  getPublishedPosts,
  getLatestPosts,
  getPageContent,
  getDocsBySection,
  getLandingHeroSlides,
  getMeetTheTeamProjects,
  getSponsorsByTier,
  getTestimonialsSorted,
  getPublishedInstagramPosts,
  getLatestInstagramPosts,
} from '../contentQueries';

const mockedGetCollection = vi.mocked(getCollection);

// ---------------------------------------------------------------------------
// Helpers for creating mock entries
// ---------------------------------------------------------------------------

function makeEntry(overrides: { date?: Date; slug?: string; isDraft?: boolean; id?: string; displayMeetTheTeam?: boolean }) {
  return {
    id: overrides.id ?? 'en/test.md',
    slug: overrides.slug ?? 'test',
    data: {
      date: overrides.date ?? new Date('2024-01-01'),
      isDraft: overrides.isDraft,
      displayMeetTheTeam: overrides.displayMeetTheTeam,
    },
  };
}

// ---------------------------------------------------------------------------
// sortByDateDesc
// ---------------------------------------------------------------------------

describe('sortByDateDesc', () => {
  it('sorts entries newest-first', () => {
    const entries = [
      makeEntry({ date: new Date('2023-01-01') }),
      makeEntry({ date: new Date('2024-06-15') }),
      makeEntry({ date: new Date('2023-07-01') }),
    ];
    const sorted = sortByDateDesc(entries);
    expect(sorted[0].data.date).toEqual(new Date('2024-06-15'));
    expect(sorted[1].data.date).toEqual(new Date('2023-07-01'));
    expect(sorted[2].data.date).toEqual(new Date('2023-01-01'));
  });

  it('does not mutate the original array', () => {
    const entries = [
      makeEntry({ date: new Date('2023-01-01') }),
      makeEntry({ date: new Date('2024-01-01') }),
    ];
    const original = [...entries];
    sortByDateDesc(entries);
    expect(entries).toEqual(original);
  });

  it('returns empty array for empty input', () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  it('returns same entry for single-element input', () => {
    const entry = makeEntry({ date: new Date('2024-01-01') });
    const result = sortByDateDesc([entry]);
    expect(result).toHaveLength(1);
    expect(result[0].data.date).toEqual(new Date('2024-01-01'));
  });

  it('handles dates across different years', () => {
    const entries = [
      makeEntry({ date: new Date('2020-12-31') }),
      makeEntry({ date: new Date('2025-01-01') }),
      makeEntry({ date: new Date('2022-06-15') }),
    ];
    const sorted = sortByDateDesc(entries);
    expect(sorted.map(e => e.data.date.getFullYear())).toEqual([2025, 2022, 2020]);
  });

  it('handles dates within the same day', () => {
    const entries = [
      makeEntry({ date: new Date('2024-01-01T08:00:00') }),
      makeEntry({ date: new Date('2024-01-01T20:00:00') }),
      makeEntry({ date: new Date('2024-01-01T12:00:00') }),
    ];
    const sorted = sortByDateDesc(entries);
    expect(sorted[0].data.date.getHours()).toBe(20);
    expect(sorted[1].data.date.getHours()).toBe(12);
    expect(sorted[2].data.date.getHours()).toBe(8);
  });
});

// ---------------------------------------------------------------------------
// sortBySlug
// ---------------------------------------------------------------------------

describe('sortBySlug', () => {
  it('sorts alphabetically ascending', () => {
    const entries = [
      makeEntry({ slug: 'charlie' }),
      makeEntry({ slug: 'alpha' }),
      makeEntry({ slug: 'bravo' }),
    ];
    const sorted = sortBySlug(entries);
    expect(sorted.map(e => e.slug)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('does not mutate the original array', () => {
    const entries = [
      makeEntry({ slug: 'b' }),
      makeEntry({ slug: 'a' }),
    ];
    const original = [...entries];
    sortBySlug(entries);
    expect(entries).toEqual(original);
  });

  it('returns empty array for empty input', () => {
    expect(sortBySlug([])).toEqual([]);
  });

  it('returns same entry for single-element input', () => {
    const entry = makeEntry({ slug: 'only' });
    expect(sortBySlug([entry])).toHaveLength(1);
  });

  it('sorts numeric-prefix slugs correctly', () => {
    const entries = [
      makeEntry({ slug: '02-bar' }),
      makeEntry({ slug: '01-foo' }),
      makeEntry({ slug: '10-baz' }),
    ];
    const sorted = sortBySlug(entries);
    expect(sorted.map(e => e.slug)).toEqual(['01-foo', '02-bar', '10-baz']);
  });

  it('handles identical slugs', () => {
    const entries = [
      makeEntry({ slug: 'same' }),
      makeEntry({ slug: 'same' }),
    ];
    const sorted = sortBySlug(entries);
    expect(sorted).toHaveLength(2);
    expect(sorted.every(e => e.slug === 'same')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// filterDrafts
// ---------------------------------------------------------------------------

describe('filterDrafts', () => {
  describe('production mode (DEV=false)', () => {
    beforeEach(() => {
      import.meta.env.DEV = false;
    });

    it('filters out entries with isDraft: true', () => {
      const entries = [
        makeEntry({ isDraft: true }),
        makeEntry({ isDraft: false }),
      ];
      const result = filterDrafts(entries);
      expect(result).toHaveLength(1);
      expect(result[0].data.isDraft).toBe(false);
    });

    it('keeps entries with isDraft: false', () => {
      const entries = [makeEntry({ isDraft: false })];
      expect(filterDrafts(entries)).toHaveLength(1);
    });

    it('keeps entries with isDraft: undefined', () => {
      const entries = [makeEntry({})];
      expect(filterDrafts(entries)).toHaveLength(1);
    });

    it('returns empty array for empty input', () => {
      expect(filterDrafts([])).toEqual([]);
    });

    it('returns empty array when all entries are drafts', () => {
      const entries = [
        makeEntry({ isDraft: true }),
        makeEntry({ isDraft: true }),
      ];
      expect(filterDrafts(entries)).toHaveLength(0);
    });

    it('filters mixed draft/non-draft entries correctly', () => {
      const entries = [
        makeEntry({ isDraft: false, slug: 'a' }),
        makeEntry({ isDraft: true, slug: 'b' }),
        makeEntry({ isDraft: false, slug: 'c' }),
        makeEntry({ isDraft: true, slug: 'd' }),
      ];
      const result = filterDrafts(entries);
      expect(result).toHaveLength(2);
      expect(result.map(e => e.slug)).toEqual(['a', 'c']);
    });

    it('does not mutate the original array', () => {
      const entries = [
        makeEntry({ isDraft: true }),
        makeEntry({ isDraft: false }),
      ];
      const original = [...entries];
      filterDrafts(entries);
      expect(entries).toEqual(original);
    });
  });

  describe('development mode (DEV=true)', () => {
    beforeEach(() => {
      import.meta.env.DEV = true;
    });

    it('returns all entries including drafts', () => {
      const entries = [
        makeEntry({ isDraft: true }),
        makeEntry({ isDraft: false }),
        makeEntry({}),
      ];
      expect(filterDrafts(entries)).toHaveLength(3);
    });
  });
});

// ---------------------------------------------------------------------------
// Async query functions (require getCollection mock)
// ---------------------------------------------------------------------------

describe('getPublishedEvents', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('returns events sorted by date descending', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ id: 'en/old.mdx', date: new Date('2023-01-01'), slug: 'old' }),
      makeEntry({ id: 'en/new.mdx', date: new Date('2024-06-01'), slug: 'new' }),
    ]);
    const result = await getPublishedEvents();
    expect(result[0].slug).toBe('new');
    expect(result[1].slug).toBe('old');
  });

  it('calls getCollection with "events"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getPublishedEvents();
    expect(mockedGetCollection).toHaveBeenCalledWith('events');
  });
});

describe('getPublishedProjects', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('returns projects sorted by date descending', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ id: 'en/older.mdx', date: new Date('2022-03-01'), slug: 'older' }),
      makeEntry({ id: 'en/newer.mdx', date: new Date('2024-09-01'), slug: 'newer' }),
    ]);
    const result = await getPublishedProjects();
    expect(result[0].slug).toBe('newer');
  });

  it('calls getCollection with "projects"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getPublishedProjects();
    expect(mockedGetCollection).toHaveBeenCalledWith('projects');
  });
});

describe('getPublishedPosts', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('merges events and projects sorted by date', async () => {
    // First call returns events, second returns projects
    mockedGetCollection
      .mockResolvedValueOnce([
        makeEntry({ id: 'en/event-1.mdx', date: new Date('2024-01-01'), slug: 'event-1' }),
      ])
      .mockResolvedValueOnce([
        makeEntry({ id: 'en/project-1.mdx', date: new Date('2024-06-01'), slug: 'project-1' }),
      ]);

    const result = await getPublishedPosts();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('project-1'); // newer
    expect(result[1].slug).toBe('event-1');   // older
  });

  it('adds _collectionType markers', async () => {
    mockedGetCollection
      .mockResolvedValueOnce([makeEntry({ id: 'en/e1.mdx', slug: 'e1' })])
      .mockResolvedValueOnce([makeEntry({ id: 'en/p1.mdx', slug: 'p1' })]);

    const result = await getPublishedPosts();
    const event = result.find(p => p.slug === 'e1');
    const project = result.find(p => p.slug === 'p1');
    expect(event).toHaveProperty('_collectionType', 'events');
    expect(project).toHaveProperty('_collectionType', 'projects');
  });

  it('returns empty array when no content exists', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const result = await getPublishedPosts();
    expect(result).toEqual([]);
  });
});

describe('getLatestPosts', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('returns at most N posts', async () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ id: `en/post-${i}.mdx`, date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `post-${i}` })
    );
    mockedGetCollection.mockResolvedValue(entries);

    const result = await getLatestPosts(3);
    expect(result).toHaveLength(3);
  });

  it('defaults to 4 posts', async () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ id: `en/post-${i}.mdx`, date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `post-${i}` })
    );
    mockedGetCollection.mockResolvedValue(entries);

    const result = await getLatestPosts();
    expect(result).toHaveLength(4);
  });
});

describe('getPageContent', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('finds entry by id', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero' } },
      { id: 'en/sub-pages/about.md', slug: 'about', data: { title: 'About' } },
    ]);
    const result = await getPageContent('landing/hero');
    expect(result?.data.title).toBe('Hero');
  });

  it('appends .md extension if missing', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const result = await getPageContent('landing/hero');
    expect(result).toBeDefined();
  });

  it('does not double-append .md', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const result = await getPageContent('landing/hero.md');
    expect(result).toBeDefined();
  });

  it('returns undefined for non-existent id', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await getPageContent('does-not-exist');
    expect(result).toBeUndefined();
    warnSpy.mockRestore();
  });

  it('warns when id is not found', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await getPageContent('nonexistent/page');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nonexistent/page')
    );
    warnSpy.mockRestore();
  });
});

describe('getLandingHeroSlides', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('sorts slides by numeric prefix', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: '03-slide.md', slug: 'slide-3', data: {} },
      { id: '01-slide.md', slug: 'slide-1', data: {} },
      { id: '02-slide.md', slug: 'slide-2', data: {} },
    ]);
    const result = await getLandingHeroSlides();
    expect(result.map(s => s.id)).toEqual(['01-slide.md', '02-slide.md', '03-slide.md']);
  });

  it('sorts numerically not lexicographically', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: '10-slide.md', slug: 'slide-10', data: {} },
      { id: '2-slide.md', slug: 'slide-2', data: {} },
      { id: '1-slide.md', slug: 'slide-1', data: {} },
    ]);
    const result = await getLandingHeroSlides();
    expect(result.map(s => s.id)).toEqual(['1-slide.md', '2-slide.md', '10-slide.md']);
  });

  it('sorts slides without numeric prefix to the beginning', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: '05-slide.md', slug: 'slide-5', data: {} },
      { id: 'about.md', slug: 'about', data: {} },
      { id: '01-slide.md', slug: 'slide-1', data: {} },
    ]);
    const result = await getLandingHeroSlides();
    expect(result.map(s => s.id)).toEqual(['about.md', '01-slide.md', '05-slide.md']);
  });

  it('handles slides with same numeric prefix', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: '01-alpha.md', slug: 'alpha', data: {} },
      { id: '01-beta.md', slug: 'beta', data: {} },
    ]);
    const result = await getLandingHeroSlides();
    expect(result).toHaveLength(2);
    expect(result.map(s => s.id)).toContain('01-alpha.md');
    expect(result.map(s => s.id)).toContain('01-beta.md');
  });

  it('returns empty array for empty collection', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const result = await getLandingHeroSlides();
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getMeetTheTeamProjects
// ---------------------------------------------------------------------------

describe('getMeetTheTeamProjects', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('calls getCollection with "projects"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getMeetTheTeamProjects();
    expect(mockedGetCollection).toHaveBeenCalledWith('projects');
  });

  it('returns projects sorted by date descending', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ id: 'en/old-project.mdx', date: new Date('2023-01-01'), slug: 'old-project', displayMeetTheTeam: true }),
      makeEntry({ id: 'en/new-project.mdx', date: new Date('2024-06-01'), slug: 'new-project', displayMeetTheTeam: true }),
    ]);
    const result = await getMeetTheTeamProjects();
    expect(result[0].slug).toBe('new-project');
    expect(result[1].slug).toBe('old-project');
  });

  it('filters out projects without displayMeetTheTeam', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ id: 'en/team-project.mdx', slug: 'team-project', displayMeetTheTeam: true }),
      makeEntry({ id: 'en/regular-project.mdx', slug: 'regular-project' }),
    ]);
    const result = await getMeetTheTeamProjects();
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('team-project');
  });

  it('returns empty array when no projects match', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const result = await getMeetTheTeamProjects();
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getSponsorsByTier
// ---------------------------------------------------------------------------

function makeSponsor(overrides: { id: string; slug: string }) {
  return {
    id: overrides.id,
    slug: overrides.slug,
    data: { name: overrides.slug },
    collection: 'sponsors',
  };
}

describe('getSponsorsByTier', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('groups sponsors by tier derived from id', async () => {
    mockedGetCollection.mockResolvedValue([
      makeSponsor({ id: 'gold/acme', slug: 'acme' }),
      makeSponsor({ id: 'silver/beta', slug: 'beta' }),
      makeSponsor({ id: 'gold/zeta', slug: 'zeta' }),
      makeSponsor({ id: 'bronze/gamma', slug: 'gamma' }),
    ]);

    const result = await getSponsorsByTier();
    expect(result.gold).toHaveLength(2);
    expect(result.silver).toHaveLength(1);
    expect(result.bronze).toHaveLength(1);
    expect(result.diamond).toHaveLength(0);
    expect(result.platinum).toHaveLength(0);
  });

  it('sorts each tier alphabetically by slug', async () => {
    mockedGetCollection.mockResolvedValue([
      makeSponsor({ id: 'gold/zeta-corp', slug: 'zeta-corp' }),
      makeSponsor({ id: 'gold/alpha-inc', slug: 'alpha-inc' }),
      makeSponsor({ id: 'gold/mid-co', slug: 'mid-co' }),
    ]);

    const result = await getSponsorsByTier();
    expect(result.gold.map(s => s.slug)).toEqual(['alpha-inc', 'mid-co', 'zeta-corp']);
  });

  it('returns all five tier keys', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const result = await getSponsorsByTier();
    expect(Object.keys(result)).toEqual(['diamond', 'platinum', 'gold', 'silver', 'bronze']);
  });

  it('returns empty arrays for tiers with no sponsors', async () => {
    mockedGetCollection.mockResolvedValue([
      makeSponsor({ id: 'gold/only', slug: 'only' }),
    ]);
    const result = await getSponsorsByTier();
    expect(result.diamond).toEqual([]);
    expect(result.platinum).toEqual([]);
    expect(result.silver).toEqual([]);
    expect(result.bronze).toEqual([]);
  });

  it('calls getCollection with "sponsors"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getSponsorsByTier();
    expect(mockedGetCollection).toHaveBeenCalledWith('sponsors');
  });

  it('throws when sponsor has unknown tier prefix', async () => {
    mockedGetCollection.mockResolvedValue([
      makeSponsor({ id: 'unknown/corp', slug: 'corp' }),
    ]);
    await expect(getSponsorsByTier()).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// getTestimonialsSorted
// ---------------------------------------------------------------------------

describe('getTestimonialsSorted', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('returns testimonials sorted by slug', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ id: 'en/charlie.md', slug: 'charlie' }),
      makeEntry({ id: 'en/alpha.md', slug: 'alpha' }),
      makeEntry({ id: 'en/bravo.md', slug: 'bravo' }),
    ]);
    const result = await getTestimonialsSorted();
    expect(result.map(t => t.slug)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('calls getCollection with "testimonials"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getTestimonialsSorted();
    expect(mockedGetCollection).toHaveBeenCalledWith('testimonials');
  });
});

// ---------------------------------------------------------------------------
// getPublishedInstagramPosts
// ---------------------------------------------------------------------------

describe('getPublishedInstagramPosts', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('returns instagram posts sorted by date descending', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ date: new Date('2024-01-01'), slug: 'old-post' }),
      makeEntry({ date: new Date('2024-06-01'), slug: 'new-post' }),
    ]);
    const result = await getPublishedInstagramPosts();
    expect(result[0].slug).toBe('new-post');
    expect(result[1].slug).toBe('old-post');
  });

  it('calls getCollection with "instagram"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getPublishedInstagramPosts();
    expect(mockedGetCollection).toHaveBeenCalledWith('instagram');
  });
});

// ---------------------------------------------------------------------------
// getLatestInstagramPosts
// ---------------------------------------------------------------------------

describe('getLatestInstagramPosts', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('defaults to 3 posts', async () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `ig-${i}` })
    );
    mockedGetCollection.mockResolvedValue(entries);

    const result = await getLatestInstagramPosts();
    expect(result).toHaveLength(3);
  });

  it('respects custom limit', async () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `ig-${i}` })
    );
    mockedGetCollection.mockResolvedValue(entries);

    const result = await getLatestInstagramPosts(5);
    expect(result).toHaveLength(5);
  });

  it('returns all posts when fewer than limit', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ date: new Date('2024-01-01'), slug: 'only' }),
    ]);

    const result = await getLatestInstagramPosts(3);
    expect(result).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// getPageContent — locale fallback
// ---------------------------------------------------------------------------

describe('getPageContent locale fallback', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('returns German entry when available', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero EN' } },
      { id: 'de/landing/hero.md', slug: 'hero', data: { title: 'Hero DE' } },
    ]);
    const result = await getPageContent('landing/hero', 'de');
    expect(result?.data.title).toBe('Hero DE');
  });

  it('falls back to English when German entry is missing', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'en/landing/hero.md', slug: 'hero', data: { title: 'Hero EN' } },
    ]);
    const result = await getPageContent('landing/hero', 'de');
    expect(result?.data.title).toBe('Hero EN');
  });

  it('does not fall back when locale is en (default)', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'de/landing/hero.md', slug: 'hero', data: { title: 'Hero DE' } },
    ]);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await getPageContent('landing/hero', 'en');
    expect(result).toBeUndefined();
    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// getDocsBySection
// ---------------------------------------------------------------------------

describe('getDocsBySection', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('groups docs by section folder', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'guides/getting-started.md', slug: 'getting-started', data: { title: 'Getting Started', order: 10 } },
      { id: 'guides/advanced.md', slug: 'advanced', data: { title: 'Advanced', order: 20 } },
      { id: 'dev/architecture.md', slug: 'architecture', data: { title: 'Architecture', order: 10 } },
    ]);

    const result = await getDocsBySection();
    expect(Object.keys(result)).toContain('guides');
    expect(Object.keys(result)).toContain('dev');
    expect(result.guides).toHaveLength(2);
    expect(result.dev).toHaveLength(1);
  });

  it('sorts docs within each section by order', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'guides/z-last.md', slug: 'z-last', data: { title: 'Last', order: 30 } },
      { id: 'guides/a-first.md', slug: 'a-first', data: { title: 'First', order: 10 } },
      { id: 'guides/m-middle.md', slug: 'm-middle', data: { title: 'Middle', order: 20 } },
    ]);

    const result = await getDocsBySection();
    expect(result.guides.map(d => d.data.order)).toEqual([10, 20, 30]);
  });

  it('returns empty object for empty collection', async () => {
    mockedGetCollection.mockResolvedValue([]);
    const result = await getDocsBySection();
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('calls getCollection with "docs"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getDocsBySection();
    expect(mockedGetCollection).toHaveBeenCalledWith('docs');
  });
});
