import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: '../dist/assignment1',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    },
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  }
}); 