import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      // false = 'es' en la raíz (/), 'en' en /en
      // true = 'es' en /es, 'en' en /en
      prefixDefaultLocale: false 
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
  // output: 'static', 
});