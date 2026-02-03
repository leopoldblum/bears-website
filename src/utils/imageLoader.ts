/**
 * Image Loading Utilities
 *
 * Centralized utilities for dynamically loading images from glob imports
 * with fallback support and development warnings.
 */

import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import defaultEventImage from '@assets/default-images/default-event.jpg';
import defaultProjectImage from '@assets/default-images/default-project.jpg';
import defaultTestimonialImage from '@assets/default-images/default-testimonial.jpg';
import defaultSponsorImage from '@assets/default-images/default-sponsor.jpg';

// Export default images for components that need direct access
export { defaultEventImage, defaultProjectImage, defaultTestimonialImage, defaultSponsorImage };

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

  // Check if image exists in glob
  if (glob[imagePath]) {
    try {
      const imageModule = await glob[imagePath]();
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
  postType?: 'event' | 'project' | 'testimonial';
}

/**
 * Load images for a collection of items (posts, testimonials, etc.)
 *
 * Handles both simple image loading (testimonials) and posts with coverImageType logic.
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
 *   fallbackImage: defaultEventImage,
 *   postType: 'event'
 * });
 * ```
 */
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
>(options: LoadImagesForCollectionOptions<T>): Promise<Array<T & { loadedImage: ImageMetadata }>> {
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
          const imagePath = `${baseDir}/${imageFileName}`;

          if (glob[imagePath]) {
            try {
              const imageModule = await glob[imagePath]();
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
      }
      // For items without coverImageType field (testimonials)
      else if (imageFileName) {
        const imagePath = `${baseDir}/${imageFileName}`;

        if (glob[imagePath]) {
          try {
            const imageModule = await glob[imagePath]();
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
            `⚠️ Testimonial ${nameInfo} ${slugInfo} - image "${imageFileName}" failed to load, using default`
          );
        }
      }

      // Apply fallback image if no image was loaded and fallback is provided
      if (!loadedImage && fallbackImage) {
        loadedImage = fallbackImage;
      }

      return { ...item, loadedImage };
    })
  ).then(items => {
    // For collections with fallbackImage, guarantee non-null loadedImage
    if (fallbackImage) {
      return items.map(item => ({
        ...item,
        loadedImage: item.loadedImage || fallbackImage
      })) as Array<T & { loadedImage: ImageMetadata }>;
    }

    return items as Array<T & { loadedImage: ImageMetadata }>;
  });
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
 * Supports events, projects, and testimonials.
 *
 * @param collection - Collection of items to load images for
 * @param type - Type of collection ('event', 'project', or 'testimonial')
 * @returns Array of items with loaded images attached as `loadedImage` property
 *
 * @example
 * ```ts
 * const eventsWithImages = await loadCollectionImages(sortedEvents, 'event');
 * const projectsWithImages = await loadCollectionImages(sortedProjects, 'project');
 * const testimonialsWithImages = await loadCollectionImages(sortedTestimonials, 'testimonial');
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
  collection: CollectionEntry<'testimonials'>[],
  type: 'testimonial'
): Promise<Array<CollectionEntry<'testimonials'> & { loadedImage: ImageMetadata }>>;
export async function loadCollectionImages(
  collection: CollectionEntry<'events'>[] | CollectionEntry<'projects'>[] | CollectionEntry<'testimonials'>[],
  type: 'event' | 'project' | 'testimonial'
): Promise<Array<(CollectionEntry<'events'> | CollectionEntry<'projects'> | CollectionEntry<'testimonials'>) & { loadedImage: ImageMetadata }>> {
  // Configuration mapping for each collection type
  const config = {
    event: {
      glob: async () => (await import('./imageGlobs')).eventImages,
      baseDir: '/src/assets/events',
      fallbackImage: defaultEventImage,
      postType: 'event' as const,
    },
    project: {
      glob: async () => (await import('./imageGlobs')).projectImages,
      baseDir: '/src/assets/projects',
      fallbackImage: defaultProjectImage,
      postType: 'project' as const,
    },
    testimonial: {
      glob: async () => (await import('./imageGlobs')).testimonialImages,
      baseDir: '/src/assets/testimonials',
      fallbackImage: defaultTestimonialImage,
      postType: 'testimonial' as const,
    },
  };

  const typeConfig = config[type];
  const glob = await typeConfig.glob();

  // Type assertion needed: CollectionEntry types from Zod transforms don't
  // structurally match the generic constraint, but the overload signatures
  // above guarantee callers always pass the correct collection type.
  return loadImagesForCollection({
    glob,
    collection: collection as Parameters<typeof loadImagesForCollection>[0]['collection'],
    baseDir: typeConfig.baseDir,
    imageField: 'coverImage',
    fallbackImage: typeConfig.fallbackImage,
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
      fallbackImage: defaultEventImage,
    },
    project: {
      glob: async () => (await import('./imageGlobs')).projectImages,
      baseDir: '/src/assets/projects',
      fallbackImage: defaultProjectImage,
    },
  };

  const typeConfig = config[type];

  if (!fileName) {
    return typeConfig.fallbackImage;
  }

  const glob = await typeConfig.glob();
  const image = await loadImage({
    glob,
    imagePath: `${typeConfig.baseDir}/${fileName}`,
    fallbackImage: typeConfig.fallbackImage,
    context,
  });

  return image || typeConfig.fallbackImage;
}


