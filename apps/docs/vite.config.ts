import path from 'node:path';
import { defineConfig } from 'vite';

// Configuration for Vite with external Remix dependencies
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
      external: [
        '@remix-run/react',
        '@remix-run/node',
        'react-router',
        'react-router-dom',
      ],
    },
  },
});
