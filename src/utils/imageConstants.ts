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
