import { defineCollection, z } from 'astro:content';
import { CoverImageType } from '../types/content';

const testimonialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    coverImage: z.string(),
  }),
});

const sponsorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
    // tier is automatically derived from folder structure (bronze/, silver/, gold/)
    // and does not need to be specified in frontmatter
  }),
});

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    domain: z.enum(['aerospace', 'robotics', 'ai', 'sustainability', 'education', 'research', 'other']),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    isDraft: z.boolean().default(false).optional(),
    displayMeetTheTeam: z.boolean().optional(),
    headOfProject: z.string().optional(),
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
  posts: postsCollection,
};
