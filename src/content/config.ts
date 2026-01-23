import { defineCollection, z } from 'astro:content';
import { CoverImageType, CategoryEventEnum, CategoryProjectEnum } from '../types/content';
import { IMAGE_EXTENSION_REGEX, VALID_EXTENSIONS_MESSAGE } from '../utils/imageConstants';

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

export const collections = {
  testimonials: testimonialsCollection,
  sponsors: sponsorsCollection,
  events: eventsCollection,
  projects: projectsCollection,
};
