import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  assetsInclude: ['**/*.gltf', '**/*.bin'],
  build: {
    outDir: '../dist/assignment7',
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    fs: {
      strict: true,
      allow: ['..']
    }
  }
}); 