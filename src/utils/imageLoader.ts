/**
 * Image Loading Utilities
 *
 * Centralized utilities for dynamically loading images from glob imports
 * with fallback support and development warnings.
 */

import type { ImageMetadata } from 'astro';

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
          
          // Return early with null image (component will use default)
          return { ...item, loadedImage: null };
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
            // Silent failure - will use fallback if provided
          }
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
