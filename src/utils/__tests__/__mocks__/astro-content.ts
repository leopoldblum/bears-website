/**
 * Mock for astro:content module used in tests.
 * Provides stub implementations of getCollection and re-exports zod as z.
 */
import { vi } from 'vitest';
import { z } from 'zod';

export { z };

export const getCollection = vi.fn();

export const defineCollection = vi.fn((config: unknown) => config);

// Stub for Astro's reference() helper. The real implementation returns a
// schema that validates a slug string into `{ collection, id }`. For tests we
// just need the chainable Zod surface (.optional(), .refine(), …), so we hand
// back a z.string() — the slug shape is what content files actually store.
export const reference = vi.fn((_collection: string) => z.string());

export type CollectionEntry<T extends string> = {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  collection: T;
};
