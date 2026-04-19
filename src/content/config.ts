import { defineCollection, reference, z } from 'astro:content';
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

/** Social-platform icons must be SVGs (rendered as silhouettes via CSS mask). */
const validateSvgExtension = (value: string) => /\.svg$/i.test(value);

const sponsorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    order: z.number(),
    logo: z.string().refine(
      validateImageExtension,
      { message: `logo must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    url: z.string().url().optional(),
    bgColor: z.string().default('#ffffff'),
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
    // Reference into the `people` collection. Replaces the old flat
    // headOfProject (string) + personImage (filename) pair. Required when
    // displayMeetTheTeam is true (enforced by the .refine() below).
    person: reference('people').optional(),
    isProjectCompleted: z.boolean(),
  }).refine(
    (data) => !(data.displayMeetTheTeam === true && !data.person),
    {
      message: "person is required when displayMeetTheTeam is true",
      path: ["person"],
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
  order: z.number(),
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

const peopleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    roleEn: z.string(),
    roleDe: z.string(),
    coverImage: z.string().refine(
      validateImageExtension,
      { message: `coverImage must have a valid image extension: ${VALID_EXTENSIONS_MESSAGE}` }
    ),
    showInFaces: z.boolean().default(false),
    // Only meaningful when showInFaces is true. Defaulted so people referenced
    // only from a project (showInFaces: false) don't need to set it.
    order: z.number().default(0),
    // Testimonial-surface fields: a person with `showAsTestimonial: true` also
    // appears in the landing-page testimonials carousel. Both quote translations
    // are required in that case (enforced by the refine below).
    quoteEn: z.string().optional(),
    quoteDe: z.string().optional(),
    showAsTestimonial: z.boolean().default(false),
    testimonialOrder: z.number().default(0),
  }).refine(
    (data) => !(data.showAsTestimonial === true && (!data.quoteEn || !data.quoteDe)),
    {
      message: 'quoteEn and quoteDe are both required when showAsTestimonial is true',
      path: ['quoteEn'],
    }
  ),
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
    secondButtonText: z.string().optional(),
    secondButtonHref: z.string().optional(),
    ctas: z.array(z.object({
      title: z.string(),
      description: z.string(),
      href: z.string(),
    })).max(4).optional(),
    items: z.array(z.string()).optional(),
    titledItems: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
    })).optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    room: z.string().optional(),
    schedule: z.string().optional(),
    mapLat: z.number().min(-90).max(90).optional(),
    mapLng: z.number().min(-180).max(180).optional(),
    socialLinks: z.array(z.object({
      platform: reference('social-platforms'),
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
    bankName: z.string().optional(),
    accountHolder: z.string().optional(),
    iban: z.string().optional(),
    bic: z.string().optional(),
    reference: z.string().optional(),
    paypalUrl: z.string().url().optional(),
    paypalButtonText: z.string().optional(),
    tierDescriptions: z.object({
      diamond: z.string().optional(),
      platinum: z.string().optional(),
      gold: z.string().optional(),
      silver: z.string().optional(),
      bronze: z.string().optional(),
    }).optional(),
  }).refine(d => !d.buttonText || d.buttonHref, {
    message: 'buttonHref is required when buttonText is set',
    path: ['buttonHref'],
  }).refine(d => !d.buttonHref || d.buttonText, {
    message: 'buttonText is required when buttonHref is set',
    path: ['buttonText'],
  }).refine(d => !d.secondButtonText || d.secondButtonHref, {
    message: 'secondButtonHref is required when secondButtonText is set',
    path: ['secondButtonHref'],
  }).refine(d => !d.secondButtonHref || d.secondButtonText, {
    message: 'secondButtonText is required when secondButtonHref is set',
    path: ['secondButtonText'],
  }),
});

const socialPlatformsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    label: z.string(),
    iconFile: z.string().refine(
      validateSvgExtension,
      { message: 'iconFile must be an SVG (.svg)' },
    ),
    defaultHoverColor: z.string().optional(),
  }),
});

export const collections = {
  sponsors: sponsorsCollection,
  events: eventsCollection,
  projects: projectsCollection,
  'hero-slides': heroSlidesCollection,
  'page-text': pageTextCollection,
  instagram: instagramCollection,
  people: peopleCollection,
  docs: docsCollection,
  'social-platforms': socialPlatformsCollection,
};
