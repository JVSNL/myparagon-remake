/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build:
    mode === 'demo'
      ? {
          // Shareable demo: one self-contained bundle (fonts inlined, no lazy chunks),
          // turned into a single HTML file by scripts/build-demo.mjs.
          outDir: 'dist-demo',
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          chunkSizeWarningLimit: 2000,
          rolldownOptions: { output: { codeSplitting: false } },
        }
      : {
          // React, the router and the illustrated avatars add up to ~235 kB gzipped; fine for this app.
          chunkSizeWarningLimit: 800,
        },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
}))
