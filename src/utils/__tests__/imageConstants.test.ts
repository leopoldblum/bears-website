import {
  VALID_IMAGE_EXTENSIONS,
  IMAGE_GLOB_PATTERN,
  IMAGE_EXTENSION_REGEX,
  VALID_EXTENSIONS_MESSAGE,
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
