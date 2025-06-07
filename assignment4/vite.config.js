import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: '../dist/assignment4',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
}); 