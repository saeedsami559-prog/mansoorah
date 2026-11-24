/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the site from /mansoorah/.
const base = process.env.BASE_PATH ?? '/mansoorah/';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['brand/*.svg', 'brand/*.png', 'favicon.ico'],
      manifest: {
        name: 'Mansoorah – Smart Home Experts in Oman',
        short_name: 'Mansoorah',
        description: 'Book verified Omani technicians for smart-home installation and tech maintenance at fixed prices.',
        lang: 'en',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#F7F9FC',
        theme_color: '#1C5AA6',
        icons: [
          { src: 'brand/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'brand/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ico,webmanifest}'],
        globIgnores: ['**/og-image.png', '**/*/index.html'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
        },
      },
    },
  },
  server: { port: 5173 },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
