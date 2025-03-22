import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import netlify from '@astrojs/netlify';

// https://astro.build/config

//   base: '/docs',
//   trailingSlash: "never",
export default defineConfig({
  integrations: [react(),mdx(), sitemap() ],
  site: 'https://www.softrbezzee.cn',
  adapter: netlify(),
});