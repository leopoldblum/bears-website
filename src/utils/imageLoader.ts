/**
 * Image Loading Utilities
 *
 * Centralized utilities for dynamically loading images from glob imports
 * with fallback support and development warnings.
 */

import type { ImageMetadata } from 'astro';
import defaultEventImage from '../assets/default-images/default-event.jpg';
import defaultProjectImage from '../assets/default-images/default-project.jpg';
import defaultTestimonialImage from '../assets/default-images/default-testimonial.jpg';

// Export default images for components that need direct access
export { defaultEventImage, defaultProjectImage, defaultTestimonialImage };

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
 * Options for loading an image with simple fallback
 */
interface LoadImageWithSimpleFallbackOptions {
  glob: Record<string, () => Promise<{ default: ImageMetadata }>>;
  imagePath: string;
  fallbackImage: ImageMetadata;
}

/**
 * Load a single image with simple fallback (no logging)
 *
 * Simpler variant of loadImage() that doesn't log warnings.
 * Useful for cases where missing images are expected (e.g., optional logos).
 *
 * @param options - Configuration for loading the image
 * @returns The loaded image or fallback image if not found
 *
 * @example
 * ```ts
 * const logo = await loadImageWithSimpleFallback({
 *   glob: sponsorLogos,
 *   imagePath: `/src/assets/sponsors/${logoFileName}`,
 *   fallbackImage: placeholderLogo
 * });
 * ```
 */
export async function loadImageWithSimpleFallback(
  options: LoadImageWithSimpleFallbackOptions
): Promise<ImageMetadata> {
  const { glob, imagePath, fallbackImage } = options;

  if (glob[imagePath]) {
    try {
      const imageModule = await glob[imagePath]();
      return imageModule.default;
    } catch (error) {
      // Silent failure - return fallback
      return fallbackImage;
    }
  }

  return fallbackImage;
}

/**
 * Pre-configured helper: Load event images for a collection
 *
 * @param collection - Collection of event items
 * @returns Items with loaded images attached as `loadedImage` property (guaranteed non-null)
 *
 * @example
 * ```ts
 * const eventsWithImages = await loadEventImages(sortedEvents);
 * ```
 */
export async function loadEventImages<T extends { data: { coverImage?: string; coverImageType?: string; title?: string }; slug?: string }>(
  collection: T[]
): Promise<Array<T & { loadedImage: ImageMetadata }>> {
  const { eventImages } = await import('./imageGlobs');

  return loadImagesForCollection({
    glob: eventImages,
    collection,
    baseDir: '/src/assets/events',
    imageField: 'coverImage',
    fallbackImage: defaultEventImage,
    postType: 'event',
  }) as Promise<Array<T & { loadedImage: ImageMetadata }>>;
}

/**
 * Pre-configured helper: Load project images for a collection
 *
 * @param collection - Collection of project items
 * @returns Items with loaded images attached as `loadedImage` property (guaranteed non-null)
 *
 * @example
 * ```ts
 * const projectsWithImages = await loadProjectImages(sortedProjects);
 * ```
 */
export async function loadProjectImages<T extends { data: { coverImage?: string; coverImageType?: string; title?: string }; slug?: string }>(
  collection: T[]
): Promise<Array<T & { loadedImage: ImageMetadata }>> {
  const { projectImages } = await import('./imageGlobs');

  return loadImagesForCollection({
    glob: projectImages,
    collection,
    baseDir: '/src/assets/projects',
    imageField: 'coverImage',
    fallbackImage: defaultProjectImage,
    postType: 'project',
  }) as Promise<Array<T & { loadedImage: ImageMetadata }>>;
}

/**
 * Pre-configured helper: Load single event cover image
 *
 * @param coverImageFileName - Filename of the cover image (without directory path)
 * @param context - Optional context for logging (item title and slug)
 * @returns The loaded image or default event image
 *
 * @example
 * ```ts
 * const coverImage = await loadEventCoverImage(
 *   entry.data.coverImage,
 *   { itemTitle: entry.data.title, itemSlug: entry.slug }
 * );
 * ```
 */
export async function loadEventCoverImage(
  coverImageFileName: string | undefined,
  context?: { itemTitle?: string; itemSlug?: string }
): Promise<ImageMetadata> {
  const { eventImages } = await import('./imageGlobs');

  if (!coverImageFileName) {
    return defaultEventImage;
  }

  const image = await loadImage({
    glob: eventImages,
    imagePath: `/src/assets/events/${coverImageFileName}`,
    fallbackImage: defaultEventImage,
    context,
  });

  return image || defaultEventImage;
}

/**
 * Pre-configured helper: Load single project cover image
 *
 * @param coverImageFileName - Filename of the cover image (without directory path)
 * @param context - Optional context for logging (item title and slug)
 * @returns The loaded image or default project image
 *
 * @example
 * ```ts
 * const coverImage = await loadProjectCoverImage(
 *   entry.data.coverImage,
 *   { itemTitle: entry.data.title, itemSlug: entry.slug }
 * );
 * ```
 */
export async function loadProjectCoverImage(
  coverImageFileName: string | undefined,
  context?: { itemTitle?: string; itemSlug?: string }
): Promise<ImageMetadata> {
  const { projectImages } = await import('./imageGlobs');

  if (!coverImageFileName) {
    return defaultProjectImage;
  }

  const image = await loadImage({
    glob: projectImages,
    imagePath: `/src/assets/projects/${coverImageFileName}`,
    fallbackImage: defaultProjectImage,
    context,
  });

  return image || defaultProjectImage;
}

/**
 * Pre-configured helper: Load testimonial images
 *
 * @param collection - Collection of testimonial items
 * @returns Items with loaded images attached as `loadedImage` property (guaranteed non-null)
 *
 * @example
 * ```ts
 * const testimonialsWithImages = await loadTestimonialImages(
 *   sortedTestimonials
 * );
 * ```
 */
export async function loadTestimonialImages<T extends { data: { image?: string; title?: string }; slug?: string }>(
  collection: T[]
): Promise<Array<T & { loadedImage: ImageMetadata }>> {
  const { testimonialImages } = await import('./imageGlobs');

  return loadImagesForCollection({
    glob: testimonialImages,
    collection,
    baseDir: '/src/assets/testimonials',
    imageField: 'image',
    fallbackImage: defaultTestimonialImage,
    postType: 'testimonial',
  }) as Promise<Array<T & { loadedImage: ImageMetadata }>>;
}
