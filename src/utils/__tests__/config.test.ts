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
  };

  it('adds coverImageType "CUSTOM" when coverImage is provided', () => {
    const result = schema.safeParse({ ...validBase, coverImage: 'event.jpg' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('CUSTOM');
    }
  });

  it('adds coverImageType "DEFAULT" when coverImage is absent', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('DEFAULT');
    }
  });

  it('rejects invalid image extension', () => {
    const result = schema.safeParse({ ...validBase, coverImage: 'event.gif' });
    expect(result.success).toBe(false);
  });

  it('accepts valid image extensions', () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
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
    isProjectCompleted: false,
  };

  it('fails when displayMeetTheTeam is true but headOfProject is missing', () => {
    const result = schema.safeParse({ ...validBase, displayMeetTheTeam: true });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join('.'));
      expect(paths).toContain('headOfProject');
    }
  });

  it('passes when displayMeetTheTeam is true and headOfProject is provided', () => {
    const result = schema.safeParse({
      ...validBase,
      displayMeetTheTeam: true,
      headOfProject: 'Jane Doe',
    });
    expect(result.success).toBe(true);
  });

  it('passes when displayMeetTheTeam is false without headOfProject', () => {
    const result = schema.safeParse({ ...validBase, displayMeetTheTeam: false });
    expect(result.success).toBe(true);
  });

  it('passes when displayMeetTheTeam is omitted', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('adds coverImageType "CUSTOM" when coverImage is provided', () => {
    const result = schema.safeParse({ ...validBase, coverImage: 'project.jpg' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('CUSTOM');
    }
  });

  it('adds coverImageType "DEFAULT" when coverImage is absent', () => {
    const result = schema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.coverImageType).toBe('DEFAULT');
    }
  });
});

// ---------------------------------------------------------------------------
// Landing Hero schema (media extension validation)
// ---------------------------------------------------------------------------

describe('hero-slides schema', () => {
  const schema = collections['hero-slides'].schema;

  it('accepts image extensions', () => {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const result = schema.safeParse({ type: 'image', media: `hero.${ext}` });
      expect(result.success).toBe(true);
    }
  });

  it('accepts video extensions', () => {
    for (const ext of ['mp4', 'webm', 'ogg']) {
      const result = schema.safeParse({ type: 'video', media: `hero.${ext}` });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid media extensions', () => {
    const result = schema.safeParse({ type: 'image', media: 'hero.gif' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid poster extension', () => {
    const result = schema.safeParse({ type: 'video', media: 'hero.mp4', poster: 'poster.bmp' });
    expect(result.success).toBe(false);
  });

  it('accepts valid poster extension', () => {
    const result = schema.safeParse({ type: 'video', media: 'hero.mp4', poster: 'poster.jpg' });
    expect(result.success).toBe(true);
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
      coverImage: 'john.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid coverImage extension', () => {
    const result = schema.safeParse({
      quote: 'Great',
      name: 'John',
      role: 'Dev',
      coverImage: 'john.svg',
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
      logo: 'acme.png',
      url: 'https://acme.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts data without url', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      logo: 'acme.png',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid logo extension', () => {
    const result = schema.safeParse({
      name: 'Acme Corp',
      logo: 'acme.svg',
    });
    expect(result.success).toBe(false);
  });
});
