// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import alpinejs from '@astrojs/alpinejs';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

const ADMIN_BUILD = process.env.ADMIN_BUILD === 'true';

const baseIntegrations = [alpinejs(), mdx(), react(), sitemap({
  filter: (page) => !page.includes('/docs/') && !page.includes('/keystatic') && !page.includes('/translation-status'),
})];

// https://astro.build/config
export default defineConfig({
  site: ADMIN_BUILD ? 'https://admin.bears-space.de' : 'https://bears-space.de',

  ...(ADMIN_BUILD
    ? {
        output: 'server',
        adapter: cloudflare(),
      }
    : {}),

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: ADMIN_BUILD
    ? [...baseIntegrations, keystatic()]
    : baseIntegrations,
});
