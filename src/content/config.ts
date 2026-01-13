import { defineCollection, z } from 'astro:content';

const testimonialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    image: z.string(),
  }),
});

const sponsorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string().url().optional(),
    tier: z.enum(['bronze', 'silver', 'gold']),
  }),
});

export const collections = {
  testimonials: testimonialsCollection,
  sponsors: sponsorsCollection,
};
