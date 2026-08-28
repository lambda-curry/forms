import { extname, isAbsolute, relative } from 'node:path';
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
            ignore: [
              'src/**/*.d.ts',
              'src/**/core/types.ts', // Exclude type-only files to avoid empty chunks
            ],
          })
          .filter((file) => {
            // Exclude files that are likely type-only (e.g., files that only export types)
            // This prevents empty chunk warnings
            return !file.includes('/core/types');
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
      // Externalize every bare module specifier (npm packages) so no dependency
      // code is bundled into dist. Only relative/absolute paths and the '@/'
      // source alias are treated as internal.
      external: (id) => !id.startsWith('.') && !isAbsolute(id) && !id.startsWith('@/') && !id.startsWith('\0'),
      output: {
        // Emit one output module per source module instead of merged shared
        // chunks. Merged chunks force Rollup to hoist transitive external
        // imports as bare side-effect imports (`import "date-fns"`) into every
        // entry stub, which defeats tree shaking in consumer bundlers.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Belt and braces: never inject transitive dependencies as bare
        // imports into entry modules.
        hoistTransitiveImports: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
