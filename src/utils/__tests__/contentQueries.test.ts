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
  getLandingHeroSlides,
} from '../contentQueries';

const mockedGetCollection = vi.mocked(getCollection);

// ---------------------------------------------------------------------------
// Helpers for creating mock entries
// ---------------------------------------------------------------------------

function makeEntry(overrides: { date?: Date; slug?: string; isDraft?: boolean; id?: string }) {
  return {
    id: overrides.id ?? 'test.md',
    slug: overrides.slug ?? 'test',
    data: {
      date: overrides.date ?? new Date('2024-01-01'),
      isDraft: overrides.isDraft,
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
      makeEntry({ date: new Date('2023-01-01'), slug: 'old' }),
      makeEntry({ date: new Date('2024-06-01'), slug: 'new' }),
    ]);
    const result = await getPublishedEvents();
    expect(result[0].slug).toBe('new');
    expect(result[1].slug).toBe('old');
  });

  it('calls getCollection with "events"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getPublishedEvents();
    expect(mockedGetCollection).toHaveBeenCalledWith('events', expect.any(Function));
  });
});

describe('getPublishedProjects', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
    import.meta.env.DEV = false;
  });

  it('returns projects sorted by date descending', async () => {
    mockedGetCollection.mockResolvedValue([
      makeEntry({ date: new Date('2022-03-01'), slug: 'older' }),
      makeEntry({ date: new Date('2024-09-01'), slug: 'newer' }),
    ]);
    const result = await getPublishedProjects();
    expect(result[0].slug).toBe('newer');
  });

  it('calls getCollection with "projects"', async () => {
    mockedGetCollection.mockResolvedValue([]);
    await getPublishedProjects();
    expect(mockedGetCollection).toHaveBeenCalledWith('projects', expect.any(Function));
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
        makeEntry({ date: new Date('2024-01-01'), slug: 'event-1' }),
      ])
      .mockResolvedValueOnce([
        makeEntry({ date: new Date('2024-06-01'), slug: 'project-1' }),
      ]);

    const result = await getPublishedPosts();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('project-1'); // newer
    expect(result[1].slug).toBe('event-1');   // older
  });

  it('adds _collectionType markers', async () => {
    mockedGetCollection
      .mockResolvedValueOnce([makeEntry({ slug: 'e1' })])
      .mockResolvedValueOnce([makeEntry({ slug: 'p1' })]);

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
      makeEntry({ date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `post-${i}` })
    );
    mockedGetCollection.mockResolvedValue(entries);

    const result = await getLatestPosts(3);
    expect(result).toHaveLength(3);
  });

  it('defaults to 4 posts', async () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({ date: new Date(`2024-${String(i + 1).padStart(2, '0')}-01`), slug: `post-${i}` })
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
      { id: 'landing-page/hero.md', slug: 'hero', data: { title: 'Hero' } },
      { id: 'sub-pages/about.md', slug: 'about', data: { title: 'About' } },
    ]);
    const result = await getPageContent('landing-page/hero');
    expect(result?.data.title).toBe('Hero');
  });

  it('appends .md extension if missing', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'landing-page/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const result = await getPageContent('landing-page/hero');
    expect(result).toBeDefined();
  });

  it('does not double-append .md', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'landing-page/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const result = await getPageContent('landing-page/hero.md');
    expect(result).toBeDefined();
  });

  it('returns undefined for non-existent id', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: 'landing-page/hero.md', slug: 'hero', data: { title: 'Hero' } },
    ]);
    const result = await getPageContent('does-not-exist');
    expect(result).toBeUndefined();
  });
});

describe('getLandingHeroSlides', () => {
  beforeEach(() => {
    mockedGetCollection.mockReset();
  });

  it('sorts slides by id', async () => {
    mockedGetCollection.mockResolvedValue([
      { id: '03-slide.md', slug: 'slide-3', data: {} },
      { id: '01-slide.md', slug: 'slide-1', data: {} },
      { id: '02-slide.md', slug: 'slide-2', data: {} },
    ]);
    const result = await getLandingHeroSlides();
    expect(result.map(s => s.id)).toEqual(['01-slide.md', '02-slide.md', '03-slide.md']);
  });
});
