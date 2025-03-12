import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://www.my-site.dev',
  base: '/docs',
  trailingSlash: "never",

});