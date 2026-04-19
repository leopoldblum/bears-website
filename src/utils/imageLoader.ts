/**
 * Image Loading Utilities
 *
 * Centralized utilities for dynamically loading images from glob imports
 * with fallback support and development warnings.
 */

import type { ImageMetadata } from 'astro';
import { getEntry, type CollectionEntry } from 'astro:content';
import { resolveGlobKey } from './imageConstants';
import { defaultImages } from './imageGlobs';

// Default fallback images are chosen by the editor through the `branding`
// Keystatic singleton and resolved at runtime via the `defaultImages` glob.
type DefaultImageSlot =
  | 'defaultEventImage'
  | 'defaultProjectImage'
  | 'defaultSponsorImage'
  | 'defaultFaceImage';

async function getDefaultImage(slot: DefaultImageSlot): Promise<ImageMetadata> {
  const entry = await getEntry('default-images', 'fallbacks');
  if (!entry) {
    throw new Error(
      'Default-images entry "fallbacks" is missing — expected src/content/default-images/fallbacks.yaml'
    );
  }

  const fileName = entry.data[slot];
  const imagePath = resolveImagePath('/src/assets/default-images', fileName);
  const key = resolveGlobKey(defaultImages, imagePath);
  if (!key) {
    throw new Error(
      `Default image "${fileName}" for slot "${slot}" not found under /src/assets/default-images/`
    );
  }
  return (await defaultImages[key]()).default;
}

export const getDefaultEventImage = () => getDefaultImage('defaultEventImage');
export const getDefaultProjectImage = () => getDefaultImage('defaultProjectImage');
export const getDefaultSponsorImage = () => getDefaultImage('defaultSponsorImage');
export const getDefaultFaceImage = () => getDefaultImage('defaultFaceImage');

/**
 * Resolve a frontmatter `coverImage` / `logo` / `image` value to a glob key.
 *
 * Handles three shapes that appear in the wild:
 *  - legacy flat filename: `event-8.jpg` → `{baseDir}/event-8.jpg`
 *  - Keystatic per-slug subfolder, relative:        `test/coverImage.png`
 *  - Keystatic per-slug subfolder, leading slash:  `/test/coverImage.png`
 *  - Keystatic with non-empty publicPath:     `/src/assets/.../file.jpg`
 */
export function resolveImagePath(baseDir: string, fileName: string): string {
  // Already a full asset path (older publicPath config wrote these)
  if (fileName.startsWith('/src/')) return fileName;
  // Strip any leading slashes so `${baseDir}/${fileName}` doesn't double up
  const cleaned = fileName.replace(/^\/+/, '');
  return `${baseDir}/${cleaned}`;
}

/**
 * Options for loading a single image
 */
interface LoadImageOptions {
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>;
  imagePath: string;
  fallbackImage?: ImageMetadata;
  context?: {
    itemTitle?: string;
    itemSlug?: string;
  };
}

/**
 * Load a single image from a glob import with optional fallback
 *
 * @param options - Configuration for loading the image
 * @returns The loaded image, fallback image, or null if no fallback provided
 *
 * @example
 * ```ts
 * const images = import.meta.glob("/src/assets/events/*.{jpg,png}");
 * const image = await loadImage({
 *   glob: images,
 *   imagePath: "/src/assets/events/event-1.jpg",
 *   fallbackImage: defaultImage,
 *   context: { itemTitle: "My Event", itemSlug: "my-event" }
 * });
 * ```
 */
export async function loadImage(options: LoadImageOptions): Promise<ImageMetadata | null> {
  const { glob, imagePath, fallbackImage, context } = options;

  // Check if image exists in glob (case-insensitive extension matching)
  const resolvedKey = resolveGlobKey(glob, imagePath);
  if (resolvedKey) {
    try {
      const imageModule = await glob[resolvedKey]();
      return imageModule.default;
    } catch (error) {
      // Log warning for failed load
      if (context) {
        const titleInfo = context.itemTitle ? `"${context.itemTitle}"` : '';
        const slugInfo = context.itemSlug ? `(${context.itemSlug})` : '';
        console.warn(
          `⚠️ ${titleInfo} ${slugInfo} - Failed to load image "${imagePath}", falling back to ${fallbackImage ? 'default image' : 'null'}`
        );
      }
      return fallbackImage || null;
    }
  }

  // Image not found in glob
  if (context) {
    const titleInfo = context.itemTitle ? `"${context.itemTitle}"` : '';
    const slugInfo = context.itemSlug ? `(${context.itemSlug})` : '';
    console.warn(
      `⚠️ ${titleInfo} ${slugInfo} - Image "${imagePath}" not found, falling back to ${fallbackImage ? 'default image' : 'null'}`
    );
  }

  return fallbackImage || null;
}

/**
 * Options for loading images for a collection
 */
interface LoadImagesForCollectionOptions<T> {
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>;
  collection: T[];
  baseDir: string;
  imageField: 'coverImage' | 'image';
  fallbackImage?: ImageMetadata;
  postType?: 'event' | 'project' | 'person';
}

/**
 * Load images for a collection of items (posts, people, etc.)
 *
 * Handles both simple image loading (people) and posts with coverImageType logic.
 * For posts with coverImageType:
 * - Only loads if coverImageType === "CUSTOM"
 * - Logs dev warning if coverImageType === "DEFAULT"
 * - Logs dev warning if custom image fails to load
 *
 * @param options - Configuration for loading collection images
 * @returns Array of items with loaded images attached as `loadedImage` property
 *
 * @example
 * ```ts
 * const images = import.meta.glob("/src/assets/events/*.{jpg,png}");
 * const eventsWithImages = await loadImagesForCollection({
 *   glob: images,
 *   collection: events,
 *   baseDir: '/src/assets/events',
 *   imageField: 'coverImage',
 *   fallbackImage: await getDefaultEventImage(),
 *   postType: 'event'
 * });
 * ```
 */
// Overload: with fallback → guaranteed non-null loadedImage
export async function loadImagesForCollection<
  T extends {
    data: {
      coverImage?: string;
      image?: string;
      coverImageType?: string;
      title?: string;
      name?: string;
    };
    slug?: string;
  }
>(options: LoadImagesForCollectionOptions<T> & { fallbackImage: ImageMetadata }): Promise<Array<T & { loadedImage: ImageMetadata }>>;

// Overload: without fallback → loadedImage may be null
export async function loadImagesForCollection<
  T extends {
    data: {
      coverImage?: string;
      image?: string;
      coverImageType?: string;
      title?: string;
      name?: string;
    };
    slug?: string;
  }
>(options: LoadImagesForCollectionOptions<T>): Promise<Array<T & { loadedImage: ImageMetadata | null }>>;

// Implementation
export async function loadImagesForCollection<
  T extends {
    data: {
      coverImage?: string;
      image?: string;
      coverImageType?: string;
      title?: string;
      name?: string;
    };
    slug?: string;
  }
>(options: LoadImagesForCollectionOptions<T>): Promise<Array<T & { loadedImage: ImageMetadata | null }>> {
  const { glob, collection, baseDir, imageField, fallbackImage, postType } = options;

  return await Promise.all(
    collection.map(async (item) => {
      let loadedImage: ImageMetadata | null = null;
      let imageLoadFailed = false;

      const imageFileName = item.data[imageField];
      const hasCoverImageType = 'coverImageType' in item.data;

      // For posts with coverImageType field (events/projects)
      if (hasCoverImageType) {
        // Check for DEFAULT coverImageType
        if (item.data.coverImageType === "DEFAULT") {
          const titleInfo = item.data.title ? `"${item.data.title}"` : '';
          const slugInfo = item.slug ? `(${item.slug})` : '';
          console.warn(
            `🔹 ${postType ? postType.charAt(0).toUpperCase() + postType.slice(1) : 'Item'} ${titleInfo} ${slugInfo} has no image provided, using DEFAULT cover image`
          );

          // Apply fallback for DEFAULT cases (don't return early)
          loadedImage = fallbackImage || null;
        }

        // Only try to load if coverImageType is CUSTOM and we have an image filename
        if (item.data.coverImageType === "CUSTOM" && imageFileName) {
          const imagePath = resolveImagePath(baseDir, imageFileName);
          const resolvedKey = resolveGlobKey(glob, imagePath);

          if (resolvedKey) {
            try {
              const imageModule = await glob[resolvedKey]();
              loadedImage = imageModule.default;
            } catch (error) {
              imageLoadFailed = true;
            }
          } else {
            imageLoadFailed = true;
          }

          // Log warning if custom image failed to load
          if (imageLoadFailed) {
            const titleInfo = item.data.title ? `"${item.data.title}"` : '';
            const slugInfo = item.slug ? `(${item.slug})` : '';
            console.warn(
              `⚠️ ${postType ? postType.charAt(0).toUpperCase() + postType.slice(1) : 'Item'} ${titleInfo} ${slugInfo} - image "${imageFileName}" failed to load, using default`
            );
          }
        }

        // Warn if CUSTOM but no image filename was provided
        if (item.data.coverImageType === "CUSTOM" && !imageFileName) {
          const titleInfo = item.data.title ? `"${item.data.title}"` : '';
          const slugInfo = item.slug ? `(${item.slug})` : '';
          console.warn(
            `⚠️ ${postType ? postType.charAt(0).toUpperCase() + postType.slice(1) : 'Item'} ${titleInfo} ${slugInfo} has coverImageType "CUSTOM" but no image filename provided, using default`
          );
        }
      }
      // For items without coverImageType field (people)
      else if (imageFileName) {
        const imagePath = resolveImagePath(baseDir, imageFileName);
        const resolvedKey = resolveGlobKey(glob, imagePath);

        if (resolvedKey) {
          try {
            const imageModule = await glob[resolvedKey]();
            loadedImage = imageModule.default;
          } catch (error) {
            imageLoadFailed = true;
          }
        } else {
          imageLoadFailed = true;
        }

        // Log warning if image failed to load
        if (imageLoadFailed) {
          const nameInfo = item.data.name ? `"${item.data.name}"` : '';
          const slugInfo = item.slug ? `(${item.slug})` : '';
          console.warn(
            `⚠️ ${postType ? postType.charAt(0).toUpperCase() + postType.slice(1) : 'Item'} ${nameInfo} ${slugInfo} - image "${imageFileName}" failed to load, using default`
          );
        }
      }

      // Apply fallback image if no image was loaded and fallback is provided
      if (!loadedImage && fallbackImage) {
        loadedImage = fallbackImage;
      }

      return { ...item, loadedImage };
    })
  );
}

/**
 * Load all images from a glob import
 *
 * Useful for carousels, galleries, or any component that needs to display
 * all images from a directory without filtering.
 *
 * @param glob - Glob import result containing image paths
 * @returns Array of loaded ImageMetadata objects
 *
 * @example
 * ```ts
 * import { whatIsBearsImages } from '../utils/imageGlobs';
 * const carouselImages = await loadAllImagesFromDirectory(whatIsBearsImages);
 * ```
 */
export async function loadAllImagesFromDirectory(
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>
): Promise<ImageMetadata[]> {
  const imagePaths = Object.keys(glob);

  const loadedImages = await Promise.all(
    imagePaths.map(async (path) => {
      try {
        const imageModule = await glob[path]();
        return imageModule.default;
      } catch (error) {
        console.warn(`⚠️ Failed to load image from "${path}"`);
        return null;
      }
    })
  );

  // Filter out null values (failed loads)
  return loadedImages.filter((img): img is ImageMetadata => img !== null);
}

/**
 * Unified collection image loader
 *
 * Loads images for a collection of items with type-specific configuration.
 * Supports events, projects, and people.
 *
 * @param collection - Collection of items to load images for
 * @param type - Type of collection ('event', 'project', or 'person')
 * @returns Array of items with loaded images attached as `loadedImage` property
 *
 * @example
 * ```ts
 * const eventsWithImages = await loadCollectionImages(sortedEvents, 'event');
 * const projectsWithImages = await loadCollectionImages(sortedProjects, 'project');
 * const peopleWithImages = await loadCollectionImages(sortedPeople, 'person');
 * ```
 */
export async function loadCollectionImages(
  collection: CollectionEntry<'events'>[],
  type: 'event'
): Promise<Array<CollectionEntry<'events'> & { loadedImage: ImageMetadata }>>;
export async function loadCollectionImages(
  collection: CollectionEntry<'projects'>[],
  type: 'project'
): Promise<Array<CollectionEntry<'projects'> & { loadedImage: ImageMetadata }>>;
export async function loadCollectionImages(
  collection: CollectionEntry<'people'>[],
  type: 'person'
): Promise<Array<CollectionEntry<'people'> & { loadedImage: ImageMetadata }>>;
export async function loadCollectionImages(
  collection: CollectionEntry<'events'>[] | CollectionEntry<'projects'>[] | CollectionEntry<'people'>[],
  type: 'event' | 'project' | 'person'
): Promise<Array<(CollectionEntry<'events'> | CollectionEntry<'projects'> | CollectionEntry<'people'>) & { loadedImage: ImageMetadata }>> {
  // Configuration mapping for each collection type
  const config = {
    event: {
      glob: async () => (await import('./imageGlobs')).eventImages,
      baseDir: '/src/assets/events',
      getFallbackImage: getDefaultEventImage,
      postType: 'event' as const,
    },
    project: {
      glob: async () => (await import('./imageGlobs')).projectImages,
      baseDir: '/src/assets/projects',
      getFallbackImage: getDefaultProjectImage,
      postType: 'project' as const,
    },
    person: {
      glob: async () => (await import('./imageGlobs')).peopleImages,
      baseDir: '/src/assets/people',
      getFallbackImage: getDefaultFaceImage,
      postType: 'person' as const,
    },
  };

  const typeConfig = config[type];
  const [glob, fallbackImage] = await Promise.all([
    typeConfig.glob(),
    typeConfig.getFallbackImage(),
  ]);

  // Type assertion needed: CollectionEntry types from Zod transforms don't
  // structurally match the generic constraint, but the overload signatures
  // above guarantee callers always pass the correct collection type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return loadImagesForCollection({
    glob,
    collection: collection as any,
    baseDir: typeConfig.baseDir,
    imageField: 'coverImage',
    fallbackImage,
    postType: typeConfig.postType,
  });
}

/**
 * Unified cover image loader
 *
 * Loads a single cover image with type-specific configuration.
 * Supports events and projects.
 *
 * @param fileName - Filename of the cover image (without directory path)
 * @param type - Type of image ('event' or 'project')
 * @param context - Optional context for logging (item title and slug)
 * @returns The loaded image or default image for the type
 *
 * @example
 * ```ts
 * const eventCover = await loadCoverImage(
 *   entry.data.coverImage,
 *   'event',
 *   { itemTitle: entry.data.title, itemSlug: entry.slug }
 * );
 * ```
 */
export async function loadCoverImage(
  fileName: string | undefined,
  type: 'event' | 'project',
  context?: { itemTitle?: string; itemSlug?: string }
): Promise<ImageMetadata> {
  // Configuration mapping for each type
  const config = {
    event: {
      glob: async () => (await import('./imageGlobs')).eventImages,
      baseDir: '/src/assets/events',
      getFallbackImage: getDefaultEventImage,
    },
    project: {
      glob: async () => (await import('./imageGlobs')).projectImages,
      baseDir: '/src/assets/projects',
      getFallbackImage: getDefaultProjectImage,
    },
  };

  const typeConfig = config[type];
  const fallbackImage = await typeConfig.getFallbackImage();

  if (!fileName) {
    return fallbackImage;
  }

  const glob = await typeConfig.glob();
  const image = await loadImage({
    glob,
    imagePath: resolveImagePath(typeConfig.baseDir, fileName),
    fallbackImage,
    context,
  });

  return image || fallbackImage;
}


