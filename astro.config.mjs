// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import alpinejs from '@astrojs/alpinejs';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bears-space.de',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [alpinejs(), mdx(), react(), sitemap({
    filter: (page) => !page.includes('/docs/')
  })]
});