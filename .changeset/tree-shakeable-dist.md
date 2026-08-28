---
'@lambdacurry/forms': minor
---

Make the published package tree-shakeable

- Declare `"sideEffects": false` so consumer bundlers can drop unused modules (no CSS or side-effectful modules are shipped).
- Build with `preserveModules` instead of merged shared chunks. Entry stubs such as `dist/ui/checkbox.js` previously opened with ~40 bare side-effect imports (`import "date-fns"`, `import "react-day-picker"`, `import "input-otp"`, …) — a chunking artifact that welded the whole component set (~200 KB gzip of date-fns, react-day-picker, cmdk, input-otp, etc.) onto every chunk importing anything from the `./ui` or `./remix-hook-form` barrels. Each source module now maps to one dist module with only its own imports, so barrel imports cost the same as deep subpath imports.
- Externalize every npm dependency instead of a hand-maintained list. `libphonenumber-js` and `react-stately` were silently bundled because they were missing from the list (and from `dependencies`); they are now proper dependencies resolved from the consumer's node_modules.
- `remix-hook-form` is now only a peer dependency (previously duplicated as a regular dependency, which could resolve a second nested copy alongside the consumer's own). The peer range is widened from exactly `7.1.0` to `^7.1.0`. If you install with Yarn/pnpm and do not already list `remix-hook-form` in your own dependencies, add it — npm installs peers automatically.
