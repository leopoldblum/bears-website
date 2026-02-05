/**
 * Mock for astro:content module used in tests.
 * Provides stub implementations of getCollection and re-exports zod as z.
 */
import { vi } from 'vitest';
import { z } from 'zod';

export { z };

export const getCollection = vi.fn();

export const defineCollection = vi.fn((config: unknown) => config);

export type CollectionEntry<T extends string> = {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  collection: T;
};
