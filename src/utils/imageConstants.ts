/**
 * Centralized image format configuration
 *
 * This file defines the supported image formats for the website.
 * Updating this list will automatically update:
 * - Glob patterns in imageGlobs.ts
 * - Schema validation in content/config.ts
 */

/**
 * Supported image file extensions
 * Used for both glob patterns and schema validation
 */
export const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;

/**
 * Supported video file extensions
 * Used for media glob filtering (e.g. hero background videos)
 */
export const VALID_VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg'] as const;

/**
 * Glob pattern string for use in import.meta.glob()
 * Format: "*.{jpg,jpeg,png,webp}"
 */
export const IMAGE_GLOB_PATTERN = `*.{${VALID_IMAGE_EXTENSIONS.join(',')}}`;

/**
 * Regular expression for validating image file extensions
 * Case-insensitive match for any valid extension
 */
export const IMAGE_EXTENSION_REGEX = new RegExp(
  `\\.(${VALID_IMAGE_EXTENSIONS.join('|')})$`,
  'i'
);

/**
 * Human-readable list of valid extensions for error messages
 * Format: ".jpg, .jpeg, .png, or .webp"
 */
export const VALID_EXTENSIONS_MESSAGE = VALID_IMAGE_EXTENSIONS
  .map(ext => `.${ext}`)
  .join(', ')
  .replace(/, ([^,]*)$/, ', or $1');

/**
 * Generic glob result type — works for both image and string (video) imports
 */
type GlobRecord = Record<string, () => Promise<unknown>>;

/**
 * Filters a glob result to only include entries whose file extension
 * matches one of the allowed extensions (case-insensitive).
 */
function filterByExtensions<T extends GlobRecord>(
  glob: T,
  extensions: readonly string[],
): T {
  const allowed = new Set(extensions.map(e => e.toLowerCase()));
  return Object.fromEntries(
    Object.entries(glob).filter(([path]) => {
      const ext = path.split('.').pop()?.toLowerCase();
      return ext !== undefined && allowed.has(ext);
    }),
  ) as T;
}

/**
 * Filters a glob result to only include valid image files (case-insensitive).
 * Use this to wrap `import.meta.glob('*.*')` patterns so that uppercase
 * extensions like `.JPG` or `.PNG` are matched.
 */
export function filterImageGlob<T extends GlobRecord>(glob: T): T {
  return filterByExtensions(glob, VALID_IMAGE_EXTENSIONS);
}

/**
 * Filters a glob result to include valid image AND video files (case-insensitive).
 * Use this for media globs that need to match both image and video formats.
 */
export function filterMediaGlob<T extends GlobRecord>(glob: T): T {
  return filterByExtensions(glob, [...VALID_IMAGE_EXTENSIONS, ...VALID_VIDEO_EXTENSIONS]);
}
