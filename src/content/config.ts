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

export const collections = {
  testimonials: testimonialsCollection,
};
