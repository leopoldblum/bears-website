# Image Constants Documentation

> **🔧 For Developers**

## Overview

The `imageConstants` module provides centralized configuration for all supported image formats across the website. This ensures consistency between glob patterns, schema validation, and error messages.

## Location

[/src/utils/imageConstants.ts](imageConstants.ts)

## Why Centralized Constants?

Having a single source of truth for image formats provides:
- **Consistency**: Glob patterns and validation always match
- **Maintainability**: Add new formats by updating one array
- **Type Safety**: Constants are properly typed for TypeScript
- **Clear Error Messages**: Validation uses the same format list everywhere

## Exported Constants

### `VALID_IMAGE_EXTENSIONS`

Array of supported image file extensions.

**Type:** `readonly ['jpg', 'jpeg', 'png', 'webp']`

**Usage:**
```typescript
import { VALID_IMAGE_EXTENSIONS } from './imageConstants';

// Check if an extension is valid
const isValid = VALID_IMAGE_EXTENSIONS.includes('webp'); // true
```

### `IMAGE_GLOB_PATTERN`

Glob pattern string for use in `import.meta.glob()`.

**Value:** `"*.{jpg,jpeg,png,webp}"`

**Note:** This constant is defined but cannot be used directly in `import.meta.glob()` due to Vite's requirement for static strings. It's kept for reference and documentation purposes.

**Usage:**
```typescript
// Reference only - cannot be used in actual glob imports
import { IMAGE_GLOB_PATTERN } from './imageConstants';
console.log(IMAGE_GLOB_PATTERN); // "*.{jpg,jpeg,png,webp}"

// Actual glob imports must use static strings:
const images = import.meta.glob("/src/assets/events/*.{jpg,jpeg,png,webp}");
```

### `IMAGE_EXTENSION_REGEX`

Regular expression for validating image file extensions.

**Pattern:** `/\.(jpg|jpeg|png|webp)$/i` (case-insensitive)

**Usage:**
```typescript
import { IMAGE_EXTENSION_REGEX } from './imageConstants';

// Validate an image filename
IMAGE_EXTENSION_REGEX.test('photo.jpg');    // true
IMAGE_EXTENSION_REGEX.test('photo.PNG');    // true (case-insensitive)
IMAGE_EXTENSION_REGEX.test('photo.gif');    // false
IMAGE_EXTENSION_REGEX.test('photo');        // false (no extension)
```

**Used in:**
- [content/config.ts](../content/config.ts) - Schema validation for all collections

### `VALID_EXTENSIONS_MESSAGE`

Human-readable list of valid extensions for error messages.

**Value:** `".jpg, .jpeg, .png, or .webp"`

**Usage:**
```typescript
import { VALID_EXTENSIONS_MESSAGE } from './imageConstants';

throw new Error(`Invalid format. Supported: ${VALID_EXTENSIONS_MESSAGE}`);
// Error: Invalid format. Supported: .jpg, .jpeg, .png, or .webp
```

**Used in:**
- [content/config.ts](../content/config.ts) - Zod validation error messages

## Adding New Image Formats

To add support for a new image format (e.g., `.avif` or `.jxl`):

### Step 1: Update the Array

Edit the `VALID_IMAGE_EXTENSIONS` array in [imageConstants.ts](imageConstants.ts):

```typescript
export const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const;
```

### Step 2: Update Glob Patterns Manually

Due to Vite limitations, you must manually update the glob patterns in [imageGlobs.ts](imageGlobs.ts):

```typescript
// Update all five glob patterns
export const eventImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp,avif}"
);

// Repeat for projectImages, testimonialImages, sponsorLogos, whatIsBearsImages
```

### Step 3: Automatic Updates

These will update automatically:
- ✅ Schema validation in [config.ts](../content/config.ts)
- ✅ Error messages shown to users
- ✅ `IMAGE_EXTENSION_REGEX` pattern
- ✅ `VALID_EXTENSIONS_MESSAGE` text

### Step 4: Test

Run the build to verify:
```bash
npm run build
```

## Implementation Details

### Why Can't We Use `IMAGE_GLOB_PATTERN` in Globs?

Vite's glob import feature requires **static string literals** at build time. Template literals with variables are not supported:

```typescript
// ❌ Does NOT work - Vite can't analyze dynamic patterns
const pattern = IMAGE_GLOB_PATTERN;
const images = import.meta.glob(`/src/assets/events/${pattern}`);

// ✅ Works - Static string literal
const images = import.meta.glob("/src/assets/events/*.{jpg,jpeg,png,webp}");
```

This is a fundamental limitation of Vite's static analysis. The `IMAGE_GLOB_PATTERN` constant serves as documentation and is used to generate the regex, but glob patterns must be manually kept in sync.

### How Constants Are Derived

```typescript
// Source: VALID_IMAGE_EXTENSIONS array
['jpg', 'jpeg', 'png', 'webp']

// Derived: IMAGE_GLOB_PATTERN (for reference)
"*.{jpg,jpeg,png,webp}"

// Derived: IMAGE_EXTENSION_REGEX (for validation)
/\.(jpg|jpeg|png|webp)$/i

// Derived: VALID_EXTENSIONS_MESSAGE (for errors)
".jpg, .jpeg, .png, or .webp"
```

All derived constants are automatically generated from `VALID_IMAGE_EXTENSIONS`.

## Related Files

### Files That Import These Constants

1. **[content/config.ts](../content/config.ts)**
   - Imports: `IMAGE_EXTENSION_REGEX`, `VALID_EXTENSIONS_MESSAGE`
   - Uses: Schema validation for all content collections

### Files That Reference These Formats

1. **[imageGlobs.ts](imageGlobs.ts)**
   - Must manually sync glob patterns (Vite limitation)
   - Comments reference this file for format definitions

2. **[imageGlobs.md](imageGlobs.md)**
   - Documents the centralized constants approach
   - Links to this file

## Best Practices

### When Adding New Formats

1. ✅ Update `VALID_IMAGE_EXTENSIONS` array first
2. ✅ Manually update all five glob patterns in `imageGlobs.ts`
3. ✅ Test build to verify everything works
4. ✅ Update documentation if needed

### What NOT to Do

- ❌ Don't try to use `IMAGE_GLOB_PATTERN` in glob imports
- ❌ Don't add formats without updating glob patterns
- ❌ Don't modify the regex directly (it's derived from the array)
- ❌ Don't modify the message string directly (it's derived from the array)

## Example: Adding AVIF Support

```typescript
// 1. Update imageConstants.ts
export const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const;

// 2. Update imageGlobs.ts (all 5 patterns)
export const eventImages: ImageGlob = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/events/*.{jpg,jpeg,png,webp,avif}"
);
// ... repeat for other 4 patterns

// 3. Schema validation automatically updates! ✨
// IMAGE_EXTENSION_REGEX now matches .avif
// VALID_EXTENSIONS_MESSAGE now includes ".avif"

// 4. Test
npm run build
```

## Related Documentation

- [Image Globs Utilities](imageGlobs.md) - Glob pattern definitions
- [Content Config](../content/config.ts) - Schema validation
- [CLAUDE.md](../../CLAUDE.md) - Project architecture
