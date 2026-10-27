import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' with { type: 'json' };

const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  'react-dom',
  '@react-router/node',
];

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
      // Externalize every declared dependency and peer dependency (including subpaths such as
      // `react/jsx-runtime`) so consumers dedupe them instead of getting inlined copies.
      external: (id) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        // Emit one file per source module so each subpath (e.g. `ui/checkbox.js`) only pulls in
        // the modules it actually imports, instead of hash-named shared chunks that mix unrelated code.
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Keep each file's imports limited to its direct dependencies (no hoisted `import 'x'` lines).
        hoistTransitiveImports: false,
        // Undeclared third-party code that still gets bundled (e.g. libphonenumber-js) would land in
        // `dist/node_modules`, which npm strips from published tarballs, so emit it under `dist/_vendor`.
        entryFileNames: (chunk) => `${chunk.name.replace(/(^|\/)node_modules\//g, '$1_vendor/')}.js`,
      },
    },
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
