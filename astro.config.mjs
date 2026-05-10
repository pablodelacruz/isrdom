import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://calculadora-isr.dev',
  integrations: [
    tailwind(),
    react()
  ],
  output: 'static',
  build: {
    assets: 'assets'
  }
});