import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.test.tsx'],
      outDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        'controlled/index': './src/controlled/index.ts',
        'ui/index': './src/ui/index.ts',
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ['src/**/*.d.ts', '**/*.stories.tsx', '**/*.test.tsx'],
          })
          .map((file) => [
            // The name of the entry point
            // src/nested/foo.ts becomes nested/foo
            relative('src', file.slice(0, file.length - extname(file).length)),
            // The absolute path to the entry file
            // src/nested/foo.ts becomes /project/src/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: [
        {
          format: 'es',
          dir: 'dist/esm',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: 'dist/cjs',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
        },
      ],
      external: [
        'react',
        'react/jsx-runtime',
        '@radix-ui/react-alert-dialog',
        '@radix-ui/react-avatar',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-icons',
        '@radix-ui/react-label',
        '@radix-ui/react-popover',
        '@radix-ui/react-radio-group',
        '@radix-ui/react-scroll-area',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-tooltip',
        'class-variance-authority',
        'clsx',
        'date-fns',
        'input-otp',
        'lucide-react',
        'next-themes',
        'react-day-picker',
        'react-hook-form',
        'remix-hook-form',
        'sonner',
        'tailwind-merge',
        'tailwindcss-animate',
        'zod',
        '@hookform/error-message',
        '@medusajs/ui',
      ],
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
