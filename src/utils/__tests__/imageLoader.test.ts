import type { ImageMetadata } from 'astro';
import {
  loadImage,
  loadImagesForCollection,
  loadAllImagesFromDirectory,
  loadCollectionImages,
  loadCoverImage,
} from '../imageLoader';

// ---------------------------------------------------------------------------
// Mock default image imports (static imports in imageLoader.ts)
// ---------------------------------------------------------------------------

const mockDefaultEvent: ImageMetadata = { src: '/default-event.jpg', width: 100, height: 100, format: 'jpg' };
const mockDefaultProject: ImageMetadata = { src: '/default-project.jpg', width: 100, height: 100, format: 'jpg' };
const mockDefaultTestimonial: ImageMetadata = { src: '/default-testimonial.jpg', width: 100, height: 100, format: 'jpg' };
const mockDefaultSponsor: ImageMetadata = { src: '/default-sponsor.jpg', width: 100, height: 100, format: 'jpg' };

vi.mock('@assets/default-images/default-event.jpg', () => ({
  default: { src: '/default-event.jpg', width: 100, height: 100, format: 'jpg' },
}));
vi.mock('@assets/default-images/default-project.jpg', () => ({
  default: { src: '/default-project.jpg', width: 100, height: 100, format: 'jpg' },
}));
vi.mock('@assets/default-images/default-testimonial.jpg', () => ({
  default: { src: '/default-testimonial.jpg', width: 100, height: 100, format: 'jpg' },
}));
vi.mock('@assets/default-images/default-sponsor.jpg', () => ({
  default: { src: '/default-sponsor.jpg', width: 100, height: 100, format: 'jpg' },
}));

// Mock imageGlobs for loadCollectionImages / loadCoverImage
const mockEventImages: Record<string, () => Promise<{ default: ImageMetadata }>> = {};
const mockProjectImages: Record<string, () => Promise<{ default: ImageMetadata }>> = {};
const mockTestimonialImages: Record<string, () => Promise<{ default: ImageMetadata }>> = {};

vi.mock('../imageGlobs', () => ({
  get eventImages() { return mockEventImages; },
  get projectImages() { return mockProjectImages; },
  get testimonialImages() { return mockTestimonialImages; },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeImage(src: string): ImageMetadata {
  return { src, width: 200, height: 200, format: 'jpg' };
}

function makeGlob(entries: Record<string, ImageMetadata>) {
  const glob: Record<string, () => Promise<{ default: ImageMetadata }>> = {};
  for (const [path, img] of Object.entries(entries)) {
    glob[path] = () => Promise.resolve({ default: img });
  }
  return glob;
}

function makeFailingGlob(paths: string[]) {
  const glob: Record<string, () => Promise<{ default: ImageMetadata }>> = {};
  for (const path of paths) {
    glob[path] = () => Promise.reject(new Error('load failed'));
  }
  return glob;
}

// ---------------------------------------------------------------------------
// loadImage
// ---------------------------------------------------------------------------

describe('loadImage', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns loaded image when found in glob', async () => {
    const img = makeImage('/events/my-event.jpg');
    const glob = makeGlob({ '/src/assets/events/my-event.jpg': img });

    const result = await loadImage({
      glob,
      imagePath: '/src/assets/events/my-event.jpg',
    });
    expect(result).toEqual(img);
  });

  it('returns fallback when image not in glob', async () => {
    const fallback = makeImage('/fallback.jpg');
    const result = await loadImage({
      glob: {},
      imagePath: '/src/assets/events/missing.jpg',
      fallbackImage: fallback,
      context: { itemTitle: 'Test Event' },
    });
    expect(result).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('returns null when image not in glob and no fallback', async () => {
    const result = await loadImage({
      glob: {},
      imagePath: '/src/assets/events/missing.jpg',
      context: { itemTitle: 'Test Event' },
    });
    expect(result).toBeNull();
  });

  it('returns fallback when image load throws', async () => {
    const fallback = makeImage('/fallback.jpg');
    const glob = makeFailingGlob(['/src/assets/events/broken.jpg']);

    const result = await loadImage({
      glob,
      imagePath: '/src/assets/events/broken.jpg',
      fallbackImage: fallback,
      context: { itemTitle: 'Broken Event', itemSlug: 'broken' },
    });
    expect(result).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain('Broken Event');
  });

  it('returns null when image load throws and no fallback', async () => {
    const glob = makeFailingGlob(['/src/assets/events/broken.jpg']);

    const result = await loadImage({
      glob,
      imagePath: '/src/assets/events/broken.jpg',
      context: { itemSlug: 'broken' },
    });
    expect(result).toBeNull();
  });

  it('does not warn when no context is provided', async () => {
    const result = await loadImage({
      glob: {},
      imagePath: '/missing.jpg',
    });
    expect(result).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('resolves image when extension case differs', async () => {
    const img = makeImage('/events/photo.JPG');
    const glob = makeGlob({ '/src/assets/events/photo.JPG': img });

    const result = await loadImage({
      glob,
      imagePath: '/src/assets/events/photo.jpg',
    });
    expect(result).toEqual(img);
  });

  it('does not resolve image when stem case differs', async () => {
    const img = makeImage('/events/Photo.jpg');
    const glob = makeGlob({ '/src/assets/events/Photo.jpg': img });

    const result = await loadImage({
      glob,
      imagePath: '/src/assets/events/photo.jpg',
    });
    expect(result).toBeNull();
  });

  it('includes title and slug in warning message', async () => {
    await loadImage({
      glob: {},
      imagePath: '/missing.jpg',
      fallbackImage: makeImage('/fb.jpg'),
      context: { itemTitle: 'My Title', itemSlug: 'my-slug' },
    });
    const msg = warnSpy.mock.calls[0][0] as string;
    expect(msg).toContain('"My Title"');
    expect(msg).toContain('(my-slug)');
  });
});

// ---------------------------------------------------------------------------
// loadImagesForCollection
// ---------------------------------------------------------------------------

describe('loadImagesForCollection', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns empty array for empty collection', async () => {
    const result = await loadImagesForCollection({
      glob: {},
      collection: [],
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
    });
    expect(result).toEqual([]);
  });

  // --- coverImageType path (events/projects) ---

  it('uses fallback and warns for DEFAULT coverImageType', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { title: 'My Event', coverImage: undefined, coverImageType: 'DEFAULT' },
      slug: 'my-event',
    }];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: fallback,
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain('DEFAULT');
  });

  it('loads custom image for CUSTOM coverImageType', async () => {
    const customImg = makeImage('/events/custom.jpg');
    const glob = makeGlob({ '/src/assets/events/custom.jpg': customImg });
    const collection = [{
      data: { title: 'Custom Event', coverImage: 'custom.jpg', coverImageType: 'CUSTOM' },
      slug: 'custom-event',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: makeImage('/fb.jpg'),
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(customImg);
  });

  it('falls back and warns when CUSTOM image not in glob', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { title: 'Missing Image', coverImage: 'missing.jpg', coverImageType: 'CUSTOM' },
      slug: 'missing',
    }];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: fallback,
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('missing.jpg');
  });

  it('falls back and warns when CUSTOM image load throws', async () => {
    const fallback = makeImage('/fallback.jpg');
    const glob = makeFailingGlob(['/src/assets/events/broken.jpg']);
    const collection = [{
      data: { title: 'Broken', coverImage: 'broken.jpg', coverImageType: 'CUSTOM' },
      slug: 'broken',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: fallback,
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('warns when CUSTOM coverImageType has no image filename', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { title: 'Bad Entry', coverImage: undefined, coverImageType: 'CUSTOM' },
      slug: 'bad-entry',
    }];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: fallback,
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain('CUSTOM');
    expect(warnSpy.mock.calls[0][0]).toContain('no image filename');
  });

  // --- testimonials path (no coverImageType) ---

  it('loads image for testimonial-type items', async () => {
    const img = makeImage('/testimonials/person.jpg');
    const glob = makeGlob({ '/src/assets/testimonials/person.jpg': img });
    const collection = [{
      data: { name: 'Jane', image: 'person.jpg' },
      slug: 'jane',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/testimonials',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: makeImage('/fb.jpg'),
    });

    expect(result[0].loadedImage).toEqual(img);
  });

  it('falls back when testimonial image not in glob', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { name: 'John', image: 'missing.jpg' },
      slug: 'john',
    }];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/testimonials',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: fallback,
      postType: 'testimonial',
    });

    expect(result[0].loadedImage).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0][0]).toContain('John');
    expect(warnSpy.mock.calls[0][0]).toContain('Testimonial');
  });

  it('uses "Item" in warning when postType is not provided', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { name: 'Jane', image: 'missing.jpg' },
      slug: 'jane',
    }];

    await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/other',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: fallback,
    });

    expect(warnSpy.mock.calls[0][0]).toContain('Item');
  });

  it('falls back when testimonial image load throws', async () => {
    const fallback = makeImage('/fallback.jpg');
    const glob = makeFailingGlob(['/src/assets/testimonials/broken.jpg']);
    const collection = [{
      data: { name: 'Error Person', image: 'broken.jpg' },
      slug: 'error',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/testimonials',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: fallback,
    });

    expect(result[0].loadedImage).toEqual(fallback);
  });

  it('uses fallback for items without image filename', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [{
      data: { name: 'No Image' },
      slug: 'no-image',
    }];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/testimonials',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: fallback,
    });

    expect(result[0].loadedImage).toEqual(fallback);
  });

  it('guarantees non-null loadedImage when fallback is provided', async () => {
    const fallback = makeImage('/fallback.jpg');
    const collection = [
      { data: { title: 'A', coverImage: undefined, coverImageType: 'DEFAULT' }, slug: 'a' },
      { data: { title: 'B', coverImage: 'missing.jpg', coverImageType: 'CUSTOM' }, slug: 'b' },
    ];

    const result = await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: fallback,
      postType: 'event',
    });

    result.forEach(item => {
      expect(item.loadedImage).toBeTruthy();
    });
  });

  it('loads CUSTOM image when extension case differs', async () => {
    const customImg = makeImage('/events/custom.JPG');
    const glob = makeGlob({ '/src/assets/events/custom.JPG': customImg });
    const collection = [{
      data: { title: 'Case Test', coverImage: 'custom.jpg', coverImageType: 'CUSTOM' },
      slug: 'case-test',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      fallbackImage: makeImage('/fb.jpg'),
      postType: 'event',
    });

    expect(result[0].loadedImage).toEqual(customImg);
  });

  it('loads testimonial image when extension case differs', async () => {
    const img = makeImage('/testimonials/person.JPG');
    const glob = makeGlob({ '/src/assets/testimonials/person.JPG': img });
    const collection = [{
      data: { name: 'Jane', image: 'person.jpg' },
      slug: 'jane',
    }];

    const result = await loadImagesForCollection({
      glob,
      collection,
      baseDir: '/src/assets/testimonials',
      imageField: 'image' as 'coverImage' | 'image',
      fallbackImage: makeImage('/fb.jpg'),
    });

    expect(result[0].loadedImage).toEqual(img);
  });

  it('capitalizes postType in warning messages', async () => {
    const collection = [{
      data: { title: 'Test', coverImage: undefined, coverImageType: 'DEFAULT' },
      slug: 'test',
    }];

    await loadImagesForCollection({
      glob: {},
      collection,
      baseDir: '/src/assets/events',
      imageField: 'coverImage',
      postType: 'event',
    });

    expect(warnSpy.mock.calls[0][0]).toContain('Event');
  });
});

// ---------------------------------------------------------------------------
// loadAllImagesFromDirectory
// ---------------------------------------------------------------------------

describe('loadAllImagesFromDirectory', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('loads all images from glob', async () => {
    const img1 = makeImage('/a.jpg');
    const img2 = makeImage('/b.jpg');
    const glob = makeGlob({ '/a.jpg': img1, '/b.jpg': img2 });

    const result = await loadAllImagesFromDirectory(glob);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual(img1);
    expect(result).toContainEqual(img2);
  });

  it('filters out failed loads and warns', async () => {
    const img1 = makeImage('/good.jpg');
    const glob: Record<string, () => Promise<{ default: ImageMetadata }>> = {
      '/good.jpg': () => Promise.resolve({ default: img1 }),
      '/bad.jpg': () => Promise.reject(new Error('fail')),
    };

    const result = await loadAllImagesFromDirectory(glob);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(img1);
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('returns empty array for empty glob', async () => {
    const result = await loadAllImagesFromDirectory({});
    expect(result).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// loadCollectionImages (integration with mocked imageGlobs)
// ---------------------------------------------------------------------------

describe('loadCollectionImages', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Clear mock glob entries
    Object.keys(mockEventImages).forEach(k => delete mockEventImages[k]);
    Object.keys(mockProjectImages).forEach(k => delete mockProjectImages[k]);
    Object.keys(mockTestimonialImages).forEach(k => delete mockTestimonialImages[k]);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('loads event images using event config', async () => {
    const img = makeImage('/events/e1.jpg');
    mockEventImages['/src/assets/events/e1.jpg'] = () => Promise.resolve({ default: img });

    const collection = [{
      id: 'e1.md',
      slug: 'e1',
      collection: 'events' as const,
      data: { title: 'Event 1', coverImage: 'e1.jpg', coverImageType: 'CUSTOM' },
    }];

    const result = await loadCollectionImages(collection as any, 'event');
    expect(result[0].loadedImage).toEqual(img);
  });

  it('loads project images using project config', async () => {
    const img = makeImage('/projects/p1.jpg');
    mockProjectImages['/src/assets/projects/p1.jpg'] = () => Promise.resolve({ default: img });

    const collection = [{
      id: 'p1.md',
      slug: 'p1',
      collection: 'projects' as const,
      data: { title: 'Project 1', coverImage: 'p1.jpg', coverImageType: 'CUSTOM' },
    }];

    const result = await loadCollectionImages(collection as any, 'project');
    expect(result[0].loadedImage).toEqual(img);
  });

  it('loads testimonial images using testimonial config', async () => {
    const img = makeImage('/testimonials/t1.jpg');
    mockTestimonialImages['/src/assets/testimonials/t1.jpg'] = () => Promise.resolve({ default: img });

    const collection = [{
      id: 't1.md',
      slug: 't1',
      collection: 'testimonials' as const,
      data: { name: 'Person 1', coverImage: 't1.jpg' },
    }];

    const result = await loadCollectionImages(collection as any, 'testimonial');
    expect(result[0].loadedImage).toEqual(img);
  });

  it('uses default fallback when image missing', async () => {
    const collection = [{
      id: 'e1.md',
      slug: 'e1',
      collection: 'events' as const,
      data: { title: 'No Image', coverImage: undefined, coverImageType: 'DEFAULT' },
    }];

    const result = await loadCollectionImages(collection as any, 'event');
    expect(result[0].loadedImage).toEqual(mockDefaultEvent);
  });
});

// ---------------------------------------------------------------------------
// loadCoverImage
// ---------------------------------------------------------------------------

describe('loadCoverImage', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    Object.keys(mockEventImages).forEach(k => delete mockEventImages[k]);
    Object.keys(mockProjectImages).forEach(k => delete mockProjectImages[k]);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('returns default event image when fileName is undefined', async () => {
    const result = await loadCoverImage(undefined, 'event');
    expect(result).toEqual(mockDefaultEvent);
  });

  it('returns default project image when fileName is undefined', async () => {
    const result = await loadCoverImage(undefined, 'project');
    expect(result).toEqual(mockDefaultProject);
  });

  it('loads image when fileName is provided and exists', async () => {
    const img = makeImage('/events/cover.jpg');
    mockEventImages['/src/assets/events/cover.jpg'] = () => Promise.resolve({ default: img });

    const result = await loadCoverImage('cover.jpg', 'event');
    expect(result).toEqual(img);
  });

  it('loads image when extension case differs', async () => {
    const img = makeImage('/events/cover.JPG');
    mockEventImages['/src/assets/events/cover.JPG'] = () => Promise.resolve({ default: img });

    const result = await loadCoverImage('cover.jpg', 'event');
    expect(result).toEqual(img);
  });

  it('returns fallback when image fails to load', async () => {
    const result = await loadCoverImage('missing.jpg', 'event', {
      itemTitle: 'Test',
      itemSlug: 'test',
    });
    expect(result).toEqual(mockDefaultEvent);
  });
});
