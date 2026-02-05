import { defineCollection, z } from 'astro:content';
import { CoverImageType, CategoryEventEnum, CategoryProjectEnum } from '@types';
import { IMAGE_EXTENSION_REGEX, VALID_EXTENSIONS_MESSAGE } from '@utils/imageConstants';

/**
 * Helper for validating image file extensions
 * Ensures image filenames have valid extensions matching supported glob patterns
 */
const validateImageExtension = (value: string | undefined) => {
  if (!value) return true; // Allow undefined for optional fields
  return IMAGE_EXTENSION_REGEX.test(value);
};

const testimonialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    coverImage: z.string().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
  }),
});

const sponsorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string().refine(
      validateImageExtension,
      { message: `logo must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    url: z.string().url().optional(),
    // tier is automatically derived from folder structure (bronze/, silver/, gold/)
    // and does not need to be specified in frontmatter
  }),
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    categoryEvent: CategoryEventEnum,
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    isDraft: z.boolean().default(false).optional(),
  }).transform((data) => {
    // Derive coverImageType from coverImage presence
    const coverImageType: z.infer<typeof CoverImageType> = data.coverImage ? "CUSTOM" : "DEFAULT";
    return {
      ...data,
      coverImageType,
    };
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    categoryProject: CategoryProjectEnum,
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    isDraft: z.boolean().default(false).optional(),
    displayMeetTheTeam: z.boolean().optional(),
    headOfProject: z.string().optional(),
    isProjectCompleted: z.boolean(),
  }).refine(
    (data) => {
      // If displayMeetTheTeam is true, headOfProject must be provided
      if (data.displayMeetTheTeam === true && !data.headOfProject) {
        return false;
      }
      return true;
    },
    {
      message: "headOfProject is required when displayMeetTheTeam is true",
      path: ["headOfProject"],
    }
  ).transform((data) => {
    // Derive coverImageType from coverImage presence
    const coverImageType: z.infer<typeof CoverImageType> = data.coverImage ? "CUSTOM" : "DEFAULT";
    return {
      ...data,
      coverImageType,
    };
  }),
});

/**
 * Helper for validating media file extensions (images + videos)
 */
const validateMediaExtension = (value: string | undefined) => {
  if (!value) return true;
  // Allow image extensions and video extensions
  return IMAGE_EXTENSION_REGEX.test(value) || /\.(mp4|webm|ogg)$/i.test(value);
};

const landingHeroCollection = defineCollection({
  type: 'content',
  schema: z.object({
    type: z.enum(['image', 'video']),
    media: z.string().refine(
      validateMediaExtension,
      { message: `media must have a valid extension: ${VALID_EXTENSIONS_MESSAGE} or mp4, webm, ogg` }
    ),
    alt: z.string().optional(),
    poster: z.string().optional().refine(
      validateImageExtension,
      { message: `poster must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    shownText: z.string().optional(),
  }),
});

const instagramCollection = defineCollection({
  type: 'content',
  schema: z.object({
    url: z.string().url(),
    date: z.date(),
    isDraft: z.boolean().default(false).optional(),
  }),
});

const pageContentCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    buttonText: z.string().optional(),
    buttonHref: z.string().optional(),
    ctas: z.array(z.object({
      title: z.string(),
      description: z.string(),
      href: z.string(),
    })).max(4).optional(),
  }),
});

export const collections = {
  testimonials: testimonialsCollection,
  sponsors: sponsorsCollection,
  events: eventsCollection,
  projects: projectsCollection,
  landingHero: landingHeroCollection,
  pageContent: pageContentCollection,
  instagram: instagramCollection,
};
