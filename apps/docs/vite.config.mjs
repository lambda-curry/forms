import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.resolve();

export default defineConfig({
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, '../../packages/components/src'),
      '@/ui': path.resolve(__dirname, '../../packages/components/src/ui'),
      '@/lib/utils': path.resolve(__dirname, '../../packages/components/lib/utils'),
      '@lambdacurry/forms': path.resolve(__dirname, '../../packages/components/src'),
      '@lambdacurry/forms/lib': path.resolve(__dirname, '../../packages/components/lib'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react-router', 'react-router-dom'],
    },
  },
  plugins: [tailwindcss()],
});
