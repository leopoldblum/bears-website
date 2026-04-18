import { collections } from '../../content/config';

// ---------------------------------------------------------------------------
// Events schema
// ---------------------------------------------------------------------------

describe('events schema', () => {
  const schema = collections.events.schema;

  const validBase = {
    title: 'Test Event',
    description: 'A description',
    date: new Date('2024-06-15'),
    categoryEvent: 'competitions-and-workshops',
    coverImage: 'event.jpg',
  };

  it('adds coverImageType "CUSTOM" when coverImage is provided', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('CUSTOM');
    }
  });

  it('fails when coverImage is missing', () => {
    const { coverImage, ...withoutCover } = validBase;
    const result = schema.safeParse(withoutCover);
    expect(result.success).toBe(false);
  });

  it('rejects invalid image extension', () => {
    const result = schema.safeParse({ ...validBase, coverImage: 'event.gif' });
    expect(result.success).toBe(false);
  });

  it('accepts valid image extensions', () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'svg']) {
      const result = schema.safeParse({ ...validBase, coverImage: `event.${ext}` });
      expect(result.success).toBe(true);
    }
  });

  it('fails when required fields are missing', () => {
    const result = schema.safeParse({ title: 'Only title' });
    expect(result.success).toBe(false);
  });

  it('allows isDraft to be omitted (optional after default)', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts isDraft: true', () => {
    const result = schema.safeParse({ ...validBase, isDraft: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isDraft).toBe(true);
    }
  });

  it('rejects invalid categoryEvent enum value', () => {
    const result = schema.safeParse({ ...validBase, categoryEvent: 'invalid-category' });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Projects schema
// ---------------------------------------------------------------------------

describe('projects schema', () => {
  const schema = collections.projects.schema;

  const validBase = {
    title: 'Test Project',
    description: 'A project description',
    date: new Date('2024-06-15'),
    categoryProject: 'experimental-rocketry',
    coverImage: 'project.jpg',
    isProjectCompleted: false,
  };

  it('fails when displayMeetTheTeam is true but headOfProject is missing', () => {
    const result = schema.safeParse({ ...validBase, displayMeetTheTeam: true, personImage: 'person.jpg' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('headOfProject');
    }
  });

  it('fails when displayMeetTheTeam is true but personImage is missing', () => {
    const result = schema.safeParse({ ...validBase, displayMeetTheTeam: true, headOfProject: 'Jane Doe' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('personImage');
    }
  });

  it('passes when displayMeetTheTeam is true with headOfProject and personImage', () => {
    const result = schema.safeParse({
      ...validBase,
      displayMeetTheTeam: true,
      headOfProject: 'Jane Doe',
      personImage: 'jane-doe.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid personImage extension', () => {
    const result = schema.safeParse({ ...validBase, personImage: 'person.gif' });
    expect(result.success).toBe(false);
  });

  it('accepts personImage with valid extensions', () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'svg']) {
      const result = schema.safeParse({ ...validBase, personImage: `person.${ext}` });
      expect(result.success).toBe(true);
    }
  });

  it('passes when displayMeetTheTeam is false without headOfProject or personImage', () => {
    const result = schema.safeParse({ ...validBase, displayMeetTheTeam: false });
    expect(result.success).toBe(true);
  });

  it('passes when displayMeetTheTeam is omitted', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('adds coverImageType "CUSTOM" when coverImage is provided', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('CUSTOM');
    }
  });

  it('fails when coverImage is missing', () => {
    const { coverImage, ...withoutCover } = validBase;
    const result = schema.safeParse(withoutCover);
    expect(result.success).toBe(false);
  });

  it('rejects invalid categoryProject enum value', () => {
    const result = schema.safeParse({ ...validBase, categoryProject: 'invalid-category' });
    expect(result.success).toBe(false);
  });

  it('fails when isProjectCompleted is missing', () => {
    const { isProjectCompleted, ...withoutCompleted } = validBase;
    const result = schema.safeParse(withoutCompleted);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Landing Hero schema (media extension validation)
// ---------------------------------------------------------------------------

describe('hero-slides schema', () => {
  const schema = collections['hero-slides'].schema;

  it('accepts image extensions', () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'svg']) {
      const result = schema.safeParse({ order: 1, type: 'image', media: `hero.${ext}`, alt: 'description' });
      expect(result.success).toBe(true);
    }
  });

  it('accepts video extensions', () => {
    for (const ext of ['mp4', 'webm', 'ogg']) {
      const result = schema.safeParse({ order: 1, type: 'video', media: `hero.${ext}` });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid media extensions', () => {
    const result = schema.safeParse({ order: 1, type: 'image', media: 'hero.gif', alt: 'description' });
    expect(result.success).toBe(false);
  });

  it('requires alt for image slides', () => {
    const result = schema.safeParse({ order: 1, type: 'image', media: 'hero.jpg' });
    expect(result.success).toBe(false);
  });

  it('does not require alt for video slides', () => {
    const result = schema.safeParse({ order: 1, type: 'video', media: 'hero.mp4' });
    expect(result.success).toBe(true);
  });

  it('rejects slides without an order', () => {
    const result = schema.safeParse({ type: 'image', media: 'hero.jpg', alt: 'description' });
    expect(result.success).toBe(false);
  });

});

// ---------------------------------------------------------------------------
// Testimonials schema
// ---------------------------------------------------------------------------

describe('testimonials schema', () => {
  const schema = collections.testimonials.schema;

  it('accepts valid data', () => {
    const result = schema.safeParse({
      quote: 'Great experience',
      name: 'John Doe',
      role: 'Engineer',
      order: 1,
      coverImage: 'john.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid coverImage extension', () => {
    const result = schema.safeParse({
      quote: 'Great',
      name: 'John',
      role: 'Dev',
      order: 1,
      coverImage: 'john.gif',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing order', () => {
    const result = schema.safeParse({
      quote: 'Great',
      name: 'John',
      role: 'Dev',
      coverImage: 'john.jpg',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Sponsors schema
// ---------------------------------------------------------------------------

describe('sponsors schema', () => {
  const schema = collections.sponsors.schema;

  it('accepts valid data with optional url', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      order: 1,
      logo: 'acme.png',
      url: 'https://acme.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts data without url', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      order: 1,
      logo: 'acme.png',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid logo extension', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      order: 1,
      logo: 'acme.gif',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing order', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      logo: 'acme.png',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid url format', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      order: 1,
      logo: 'acme.png',
      url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Instagram schema
// ---------------------------------------------------------------------------

describe('instagram schema', () => {
  const schema = collections.instagram.schema;

  const validBase = {
    url: 'https://www.instagram.com/p/abc123/',
    date: new Date('2024-06-15'),
  };

  it('accepts valid data', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('rejects invalid URL', () => {
    const result = schema.safeParse({ ...validBase, url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('rejects missing url', () => {
    const result = schema.safeParse({ date: new Date('2024-01-01') });
    expect(result.success).toBe(false);
  });

  it('rejects missing date', () => {
    const result = schema.safeParse({ url: 'https://instagram.com/p/1' });
    expect(result.success).toBe(false);
  });

  it('allows isDraft to be omitted', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts isDraft: true', () => {
    const result = schema.safeParse({ ...validBase, isDraft: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isDraft).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Page-text schema
// ---------------------------------------------------------------------------

describe('page-text schema', () => {
  const schema = collections['page-text'].schema;

  const validBase = { title: 'Test Page Title' };

  it('accepts minimal valid data (title only)', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('accepts full data with all optional fields', () => {
    const result = schema.safeParse({
      ...validBase,
      subtitle: 'A subtitle',
      description: 'Some description',
      buttonText: 'Click me',
      buttonHref: '/some-path',
      ctas: [
        { title: 'CTA 1', description: 'Desc 1', href: '/cta-1' },
        { title: 'CTA 2', description: 'Desc 2', href: '/cta-2' },
      ],
      items: ['Item 1', 'Item 2'],
      socialLinks: [
        { platform: 'github', url: 'https://github.com/bears', hoverColor: '#333' },
      ],
      navLinks: [
        { label: 'Impressum', href: '/imprint' },
      ],
      navColumns: [
        {
          heading: 'Projects',
          href: '/projects',
          links: [
            { label: 'Current Projects', href: '/projects?status=ongoing' },
          ],
        },
      ],
      faqs: [
        { question: 'What is BEARS?', answer: 'An awesome student organization.' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title (required)', () => {
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects buttonText without buttonHref', () => {
    const result = schema.safeParse({ ...validBase, buttonText: 'Click me' });
    expect(result.success).toBe(false);
  });

  it('rejects buttonHref without buttonText', () => {
    const result = schema.safeParse({ ...validBase, buttonHref: '/path' });
    expect(result.success).toBe(false);
  });

  it('rejects secondButtonText without secondButtonHref', () => {
    const result = schema.safeParse({ ...validBase, secondButtonText: 'More' });
    expect(result.success).toBe(false);
  });

  it('rejects secondButtonHref without secondButtonText', () => {
    const result = schema.safeParse({ ...validBase, secondButtonHref: '/more' });
    expect(result.success).toBe(false);
  });

  it('accepts button pair together', () => {
    const result = schema.safeParse({ ...validBase, buttonText: 'Click', buttonHref: '/go' });
    expect(result.success).toBe(true);
  });

  it('rejects ctas with more than 4 items', () => {
    const ctas = Array.from({ length: 5 }, (_, i) => ({
      title: `CTA ${i}`,
      description: `Desc ${i}`,
      href: `/cta-${i}`,
    }));
    const result = schema.safeParse({ ...validBase, ctas });
    expect(result.success).toBe(false);
  });

  it('accepts ctas with exactly 4 items', () => {
    const ctas = Array.from({ length: 4 }, (_, i) => ({
      title: `CTA ${i}`,
      description: `Desc ${i}`,
      href: `/cta-${i}`,
    }));
    const result = schema.safeParse({ ...validBase, ctas });
    expect(result.success).toBe(true);
  });

  it('rejects invalid socialLinks url', () => {
    const result = schema.safeParse({
      ...validBase,
      socialLinks: [{ platform: 'x', url: 'not-a-url' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects ctas item missing required fields', () => {
    const result = schema.safeParse({
      ...validBase,
      ctas: [{ title: 'Only title' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects faqs item missing required fields', () => {
    const result = schema.safeParse({
      ...validBase,
      faqs: [{ question: 'Q only' }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts socialLinks without optional hoverColor', () => {
    const result = schema.safeParse({
      ...validBase,
      socialLinks: [{ platform: 'github', url: 'https://github.com' }],
    });
    expect(result.success).toBe(true);
  });

  it('accepts navLinks array', () => {
    const result = schema.safeParse({
      ...validBase,
      navLinks: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('rejects navLinks item missing label', () => {
    const result = schema.safeParse({
      ...validBase,
      navLinks: [{ href: '/about' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects navLinks item missing href', () => {
    const result = schema.safeParse({
      ...validBase,
      navLinks: [{ label: 'About' }],
    });
    expect(result.success).toBe(false);
  });

  it('accepts navColumns with nested links', () => {
    const result = schema.safeParse({
      ...validBase,
      navColumns: [
        {
          heading: 'Projects',
          href: '/projects',
          links: [
            { label: 'Current', href: '/projects?status=ongoing' },
            { label: 'Past', href: '/projects?status=completed' },
          ],
        },
        {
          heading: 'Events',
          href: '/events',
          links: [{ label: 'Upcoming', href: '/events?date=upcoming' }],
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('accepts navColumns with empty links array', () => {
    const result = schema.safeParse({
      ...validBase,
      navColumns: [{ heading: 'Empty', href: '/empty', links: [] }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects navColumns item missing heading', () => {
    const result = schema.safeParse({
      ...validBase,
      navColumns: [{ href: '/projects', links: [] }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects navColumns item missing links', () => {
    const result = schema.safeParse({
      ...validBase,
      navColumns: [{ heading: 'Projects', href: '/projects' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects navColumns link missing label', () => {
    const result = schema.safeParse({
      ...validBase,
      navColumns: [{
        heading: 'Projects',
        href: '/projects',
        links: [{ href: '/projects?status=ongoing' }],
      }],
    });
    expect(result.success).toBe(false);
  });
});
