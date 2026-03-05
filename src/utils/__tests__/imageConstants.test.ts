import {
  VALID_IMAGE_EXTENSIONS,
  VALID_VIDEO_EXTENSIONS,
  IMAGE_GLOB_PATTERN,
  IMAGE_EXTENSION_REGEX,
  VALID_EXTENSIONS_MESSAGE,
  filterImageGlob,
  filterMediaGlob,
  resolveGlobKey,
} from '../imageConstants';

describe('VALID_IMAGE_EXTENSIONS', () => {
  it('contains exactly jpg, jpeg, png, webp', () => {
    expect(VALID_IMAGE_EXTENSIONS).toEqual(['jpg', 'jpeg', 'png', 'webp']);
  });

  it('has 4 entries', () => {
    expect(VALID_IMAGE_EXTENSIONS).toHaveLength(4);
  });
});

describe('IMAGE_EXTENSION_REGEX', () => {
  it.each(['photo.jpg', 'image.jpeg', 'logo.png', 'banner.webp'])(
    'matches valid filename: %s',
    (filename) => {
      expect(IMAGE_EXTENSION_REGEX.test(filename)).toBe(true);
    }
  );

  it.each(['photo.JPG', 'image.Jpeg', 'logo.PNG', 'banner.WEBP'])(
    'matches case-insensitive: %s',
    (filename) => {
      expect(IMAGE_EXTENSION_REGEX.test(filename)).toBe(true);
    }
  );

  it.each(['icon.gif', 'logo.svg', 'photo.bmp', 'image.tiff', 'video.mp4'])(
    'rejects invalid extension: %s',
    (filename) => {
      expect(IMAGE_EXTENSION_REGEX.test(filename)).toBe(false);
    }
  );

  it('rejects filenames with no extension', () => {
    expect(IMAGE_EXTENSION_REGEX.test('photo')).toBe(false);
  });

  it('rejects bare extension words without dot', () => {
    expect(IMAGE_EXTENSION_REGEX.test('jpg')).toBe(false);
  });

  it('matches extension at end of path', () => {
    expect(IMAGE_EXTENSION_REGEX.test('path/to/photo.jpg')).toBe(true);
  });

  it('rejects if valid extension is not at end', () => {
    expect(IMAGE_EXTENSION_REGEX.test('photo.jpg.bak')).toBe(false);
  });
});

describe('IMAGE_GLOB_PATTERN', () => {
  it('produces the correct glob string', () => {
    expect(IMAGE_GLOB_PATTERN).toBe('*.{jpg,jpeg,png,webp}');
  });
});

describe('VALID_EXTENSIONS_MESSAGE', () => {
  it('contains all valid extensions with dots', () => {
    for (const ext of VALID_IMAGE_EXTENSIONS) {
      expect(VALID_EXTENSIONS_MESSAGE).toContain(`.${ext}`);
    }
  });

  it('uses "or" before the last extension', () => {
    expect(VALID_EXTENSIONS_MESSAGE).toContain('or .webp');
  });

  it('formats as a comma-separated list', () => {
    expect(VALID_EXTENSIONS_MESSAGE).toBe('.jpg, .jpeg, .png, or .webp');
  });
});

describe('VALID_VIDEO_EXTENSIONS', () => {
  it('contains exactly mp4, webm, ogg', () => {
    expect(VALID_VIDEO_EXTENSIONS).toEqual(['mp4', 'webm', 'ogg']);
  });
});

/** Helper to build a fake glob record */
function fakeGlob(paths: string[]): Record<string, () => Promise<unknown>> {
  return Object.fromEntries(
    paths.map((p) => [p, () => Promise.resolve({ default: p })]),
  );
}

describe('filterImageGlob', () => {
  it('keeps lowercase image extensions', () => {
    const glob = fakeGlob(['/a/photo.jpg', '/a/logo.png', '/a/banner.webp']);
    expect(Object.keys(filterImageGlob(glob))).toEqual([
      '/a/photo.jpg',
      '/a/logo.png',
      '/a/banner.webp',
    ]);
  });

  it('keeps uppercase image extensions', () => {
    const glob = fakeGlob(['/a/photo.JPG', '/a/logo.PNG', '/a/banner.WEBP']);
    expect(Object.keys(filterImageGlob(glob))).toEqual([
      '/a/photo.JPG',
      '/a/logo.PNG',
      '/a/banner.WEBP',
    ]);
  });

  it('keeps mixed-case image extensions', () => {
    const glob = fakeGlob(['/a/photo.Jpg', '/a/logo.Jpeg']);
    expect(Object.keys(filterImageGlob(glob))).toHaveLength(2);
  });

  it('filters out non-image extensions', () => {
    const glob = fakeGlob(['/a/photo.jpg', '/a/video.mp4', '/a/doc.txt', '/a/logo.svg']);
    expect(Object.keys(filterImageGlob(glob))).toEqual(['/a/photo.jpg']);
  });

  it('filters out video extensions', () => {
    const glob = fakeGlob(['/a/video.mp4', '/a/clip.webm', '/a/audio.ogg']);
    expect(Object.keys(filterImageGlob(glob))).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(Object.keys(filterImageGlob({}))).toEqual([]);
  });

  it('filters out files with no extension', () => {
    const glob = fakeGlob(['/a/Makefile', '/a/photo.jpg']);
    expect(Object.keys(filterImageGlob(glob))).toEqual(['/a/photo.jpg']);
  });
});

describe('filterMediaGlob', () => {
  it('keeps both image and video extensions', () => {
    const glob = fakeGlob(['/a/photo.jpg', '/a/video.mp4', '/a/clip.webm']);
    expect(Object.keys(filterMediaGlob(glob))).toEqual([
      '/a/photo.jpg',
      '/a/video.mp4',
      '/a/clip.webm',
    ]);
  });

  it('keeps uppercase image and video extensions', () => {
    const glob = fakeGlob(['/a/photo.JPG', '/a/video.MP4', '/a/clip.OGG']);
    expect(Object.keys(filterMediaGlob(glob))).toHaveLength(3);
  });

  it('filters out non-media extensions', () => {
    const glob = fakeGlob(['/a/photo.jpg', '/a/video.mp4', '/a/doc.txt', '/a/logo.svg']);
    expect(Object.keys(filterMediaGlob(glob))).toEqual(['/a/photo.jpg', '/a/video.mp4']);
  });

  it('returns empty for empty input', () => {
    expect(Object.keys(filterMediaGlob({}))).toEqual([]);
  });
});

describe('resolveGlobKey', () => {
  it('returns the path on exact match', () => {
    const glob = fakeGlob(['/a/photo.jpg']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBe('/a/photo.jpg');
  });

  it('matches .JPG in glob when looking up .jpg', () => {
    const glob = fakeGlob(['/a/photo.JPG']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBe('/a/photo.JPG');
  });

  it('matches .jpg in glob when looking up .JPG', () => {
    const glob = fakeGlob(['/a/photo.jpg']);
    expect(resolveGlobKey(glob, '/a/photo.JPG')).toBe('/a/photo.jpg');
  });

  it('matches mixed-case extension (.Jpg -> .jpg)', () => {
    const glob = fakeGlob(['/a/photo.Jpg']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBe('/a/photo.Jpg');
  });

  it('matches .JPEG when looking up .jpeg', () => {
    const glob = fakeGlob(['/a/img.JPEG']);
    expect(resolveGlobKey(glob, '/a/img.jpeg')).toBe('/a/img.JPEG');
  });

  it('does NOT match when stem differs in case', () => {
    const glob = fakeGlob(['/a/Photo.jpg']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBeUndefined();
  });

  it('does NOT match when stem differs in case even if ext also differs', () => {
    const glob = fakeGlob(['/a/Photo.JPG']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBeUndefined();
  });

  it('returns undefined when glob is empty', () => {
    expect(resolveGlobKey({}, '/a/photo.jpg')).toBeUndefined();
  });

  it('returns undefined when no key matches', () => {
    const glob = fakeGlob(['/a/other.jpg']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBeUndefined();
  });

  it('returns undefined when requested path has no dot', () => {
    const glob = fakeGlob(['/a/photo.jpg']);
    expect(resolveGlobKey(glob, '/a/photo')).toBeUndefined();
  });

  it('handles multiple dots in filename correctly', () => {
    const glob = fakeGlob(['/a/photo.min.JPG']);
    expect(resolveGlobKey(glob, '/a/photo.min.jpg')).toBe('/a/photo.min.JPG');
  });

  it('does not match different extensions', () => {
    const glob = fakeGlob(['/a/photo.png']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBeUndefined();
  });

  it('prefers exact match over case-insensitive match', () => {
    const glob = fakeGlob(['/a/photo.jpg', '/a/photo.JPG']);
    expect(resolveGlobKey(glob, '/a/photo.jpg')).toBe('/a/photo.jpg');
  });

  it('works with typical Astro asset paths', () => {
    const glob = fakeGlob(['/src/assets/whatIsBears/carousel-7.JPG']);
    expect(resolveGlobKey(glob, '/src/assets/whatIsBears/carousel-7.jpg'))
      .toBe('/src/assets/whatIsBears/carousel-7.JPG');
  });
});
