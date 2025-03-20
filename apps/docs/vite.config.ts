import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, '../../packages/components/src'),
      '@/ui': path.resolve(__dirname, '../../packages/components/src/ui'),
      '@/lib/utils': path.resolve(__dirname, '../../packages/components/lib/utils'),
      '@lambdacurry/forms': path.resolve(__dirname, '../../packages/components/src'),
      '@lambdacurry/forms/lib': path.resolve(__dirname, '../../packages/components/lib'),
      // React Router mocks for Remix compatibility
      'react-router': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
      'react-router-dom': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'react-router',
        'react-router-dom',
      ],
    },
  },
});
