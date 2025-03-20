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
      // Mock Remix dependencies
      '@remix-run/react': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
      '@remix-run/node': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
      '@remix-run/testing': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
      'react-router': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
      '@react-router/testing': path.resolve(__dirname, './src/lib/storybook/remix-mock.tsx'),
    },
  },
  build: {
    rollupOptions: {
      external: [
        '@remix-run/react',
        '@remix-run/node',
        '@remix-run/testing',
        'react-router',
        'react-router-dom',
        '@react-router/testing',
      ],
    },
  },
});
