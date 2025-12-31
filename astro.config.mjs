import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: node({
    mode: "standalone"
  }),
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    routing: {
      // false = 'es' en la raíz (/), 'en' en /en
      // true = 'es' en /es, 'en' en /en
      prefixDefaultLocale: true
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://portfoliov3-backend-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Opcional: si usas 'hybrid' o 'server' para el admin en el futuro
  output: 'server', 
});