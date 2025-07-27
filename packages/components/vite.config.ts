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
    }),
  ],
  build: {
    lib: {
      entry: {
        index: './src/index.ts',
        'remix-hook-form': './src/remix-hook-form/index.ts',
        ui: './src/ui/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('src/**/*.{ts,tsx}', {
            ignore: ['src/**/*.d.ts'],
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
        'react-router',
        'react-router-dom',
        '@react-router/node',
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
      ],
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
