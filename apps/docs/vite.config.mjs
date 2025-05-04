import path from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.resolve();

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib/utils': path.resolve(__dirname, '../../packages/components/lib/utils'),
      '@lambdacurry/forms': path.resolve(__dirname, '../../packages/components/src'),
      '@lambdacurry/forms/lib': path.resolve(__dirname, '../../packages/components/lib'),
      '@lambdacurry/forms/ui': path.resolve(__dirname, '../../packages/components/src/ui'),
      '@lambdacurry/forms/ui/data-table-filter': path.resolve(__dirname, '../../packages/components/src/ui/data-table-filter'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'react-router', 
        'react-router-dom',
        // Ignore "use client" directive errors
        /@radix-ui\/.*\/dist\/index\.mjs/,
        /cmdk\/dist\/index\.mjs/,
        'react-day-picker',
      ],
    },
  },
  plugins: [tailwindcss()],
});

