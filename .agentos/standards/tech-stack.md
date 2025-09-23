# Tech Stack — forms (v0.1)

This document defines the enforced technologies, structure, and commands for this repository. It mirrors and operationalizes the policies in /AGENTS.md.

Monorepo Structure
- apps/docs — Storybook docs, examples, and UI tests (workspace: @lambdacurry/forms-docs)
- packages/components — Source for @lambdacurry/forms (src/** → dist/)
- types/ — Shared ambient types
- .changeset/ — Versioning and release metadata
- Root configs — biome.json, turbo.json, tsconfig.json, package.json (Yarn workspaces)

Runtimes and Package Management
- Node: 22.9.0 (see .nvmrc)
- Package manager: Yarn 4 (workspaces)

Language and Frameworks
- TypeScript (strict)
- React 19 (ES modules)
- Routing: react-router (modern data APIs; loaders/actions where applicable in docs/testing)

UI, Styling, and Component Patterns
- Tailwind CSS v4
- Radix UI primitives
- CVA (Class Variance Authority) for variants
- Accessibility-first: correct roles, labels, keyboard navigation

Forms and Validation
- Remix Hook Form integration patterns
- Zod schemas for validation and error messages
- Patterns: fetcher.Form, server actions, surface errors via FormMessage

Build, Dev, and Distribution
- Turbo orchestrates workspace tasks (dev/build/test/lint)
- apps/docs uses Storybook (React + Vite) for docs and interaction tests
- packages/components builds to dist/ (do not import from dist inside repo packages)

Quality: Linting, Formatting, and Testing
- Lint/format: Biome
  - 2-space indentation; max line width 120; single quotes; organized imports
- Testing: Storybook Test Runner (Playwright)
  - Co-locate tests as *.test.tsx near stories/components
  - Per-story decorators (e.g., router stub)
  - Cover forms, validation, a11y, data table/filter behavior

Workspace Commands
- yarn dev — Run all workspace dev tasks via Turbo
- yarn build — Build all packages/apps
- yarn serve — Serve built Storybook (apps/docs)
- yarn test — Run workspace tests (Storybook test-runner)
- yarn lint | yarn lint:fix — Check/auto-fix with Biome
- Per-workspace examples
  - yarn workspace @lambdacurry/forms build
  - yarn workspace @lambdacurry/forms-docs dev

Versioning and Releases
- Changesets required when changing published packages (yarn changeset)
- Versioning policy: patch or minor version bumps-first; CI publishes on merge
- PRs must include a Changeset when applicable; keep entries scoped and clear

Module Boundaries and Imports
- No cross-package relative imports; use package exports and TS paths
- Prefer local index.ts barrels where useful; avoid cycles
- Do not import from dist/ within the monorepo; use source modules

Security and Compliance
- Do not commit secrets; ensure .gitignore excludes large artifacts (dist, node_modules)
- Verify PR previews for Storybook via GitHub Pages

CI and Required Checks
- Required gates: yarn lint, yarn build, yarn test must pass
- CI should mirror local commands and versions (Node 22.9.0, Yarn 4)

Open Questions / Gaps
- Data layer and backend contracts are not defined in this repo. If introduced, standardize on contract-first schemas and typed clients.
- If additional apps/packages are added, update turbo.json, package exports, and TS paths accordingly.

References
- /AGENTS.md (Repository Guidelines)
- .cursor/rules/*: react-typescript-patterns.mdc, ui-component-patterns.mdc, form-component-patterns.mdc, storybook-testing.mdc, monorepo-organization.mdc, versioning-with-npm.mdc