import { z } from 'astro:content';

// PostType - the main type user requested
export type PostType = 'events' | 'projects';

// Additional content-related types
export type SponsorTier = 'bronze' | 'silver' | 'gold';

export type Domain =
  | 'aerospace'
  | 'robotics'
  | 'ai'
  | 'sustainability'
  | 'education'
  | 'research'
  | 'other';

// CoverImageType - Zod enum with DEFAULT and CUSTOM values
export const CoverImageType = z.enum(["DEFAULT", "CUSTOM"]);
export type CoverImageTypeValue = z.infer<typeof CoverImageType>;
