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
    coverImage: z.string().refine(
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
    coverImage: z.string().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    isDraft: z.boolean().default(false).optional(),
    displayMeetTheTeam: z.boolean().optional(),
    headOfProject: z.string().optional(),
    personImage: z.string().optional().refine(
      validateImageExtension,
      { message: `personImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
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
  ).refine(
    (data) => {
      // If displayMeetTheTeam is true, personImage must be provided
      if (data.displayMeetTheTeam === true && !data.personImage) {
        return false;
      }
      return true;
    },
    {
      message: "personImage is required when displayMeetTheTeam is true",
      path: ["personImage"],
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

const heroSlideBase = {
  media: z.string().refine(
    validateMediaExtension,
    { message: `media must have a valid extension: ${VALID_EXTENSIONS_MESSAGE} or mp4, webm, ogg` }
  ),
  shownText: z.string().optional(),
};

const heroSlidesCollection = defineCollection({
  type: 'content',
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('image'),
      ...heroSlideBase,
      alt: z.string(),
    }),
    z.object({
      type: z.literal('video'),
      ...heroSlideBase,
      alt: z.string().optional(),
    }),
  ]),
});

const instagramCollection = defineCollection({
  type: 'content',
  schema: z.object({
    url: z.string().url(),
    date: z.date(),
    isDraft: z.boolean().default(false).optional(),
  }),
});

const facesOfBearsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    coverImage: z.string().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
  }),
});

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
    group: z.string().optional(),
  }),
});

const pageTextCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    seoDescription: z.string().optional(),
    buttonText: z.string().optional(),
    buttonHref: z.string().optional(),
    ctas: z.array(z.object({
      title: z.string(),
      description: z.string(),
      href: z.string(),
    })).max(4).optional(),
    items: z.array(z.string()).optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
      hoverColor: z.string().optional(),
    })).optional(),
    navLinks: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })).optional(),
    navColumns: z.array(z.object({
      heading: z.string(),
      href: z.string(),
      links: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })),
    })).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    instagramButtonText: z.string().optional(),
    mediaCategories: z.array(z.object({
      id: z.string(),
      label: z.string(),
    })).optional(),
  }),
});

export const collections = {
  testimonials: testimonialsCollection,
  sponsors: sponsorsCollection,
  events: eventsCollection,
  projects: projectsCollection,
  'hero-slides': heroSlidesCollection,
  'page-text': pageTextCollection,
  instagram: instagramCollection,
  'faces-of-bears': facesOfBearsCollection,
  docs: docsCollection,
};
