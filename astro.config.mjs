import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config

//   base: '/docs',
//   trailingSlash: "never",
export default defineConfig({
  integrations: [react() ],
  site: 'https://www.softrbezzee.cn',

});