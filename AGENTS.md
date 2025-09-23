# Repository Guidelines

## Project Structure & Module Organization
- `apps/docs`: Storybook docs, examples, and UI tests.
- `packages/components`: Source for `@lambdacurry/forms` (`src/**`, built to `dist/`).
- `types/`: Shared ambient types.
- `.changeset/`: Versioning and release metadata.
- Root configs: `biome.json`, `turbo.json`, `tsconfig.json`, `package.json` (Yarn workspaces).

## Build, Test, and Development Commands
- `yarn dev`: Run all workspace dev tasks via Turbo.
- `yarn build`: Build all packages/apps.
- `yarn serve`: Serve built Storybook (`apps/docs`).
- `yarn test`: Run workspace tests (Storybook test-runner in `apps/docs`).
- `yarn lint` | `:fix`: Check/auto-fix with Biome.
- Per workspace (examples):
  - `yarn workspace @lambdacurry/forms build`
  - `yarn workspace @lambdacurry/forms-docs dev`

## Coding Style & Naming Conventions
- Indentation: 2 spaces; max line width 120; single quotes (Biome enforced).
- TypeScript + React (ES modules). Keep components pure and typed.
- Filenames: kebab-case (e.g., `text-field.tsx`, `data-table-filter/**`).
- Components/Types: PascalCase; hooks: camelCase with `use*` prefix.
- Imports: organized automatically (Biome). Prefer local `index.ts` barrels when useful.

## Testing Guidelines
- Framework: Storybook Test Runner (Playwright under the hood) in `apps/docs`.
- Naming: co-locate tests as `*.test.tsx` near stories/components.
- Run: `yarn test` (CI-like) or `yarn workspace @lambdacurry/forms-docs test:local`.
- Cover critical interactions (forms, validation, a11y, filter behavior). Add stories to exercise states.

## Commit & Pull Request Guidelines
- Commits: short imperative subject, optional scope, concise body explaining rationale.
  - Example: `Fix: remove deprecated dropdown select`.
- PRs: clear description, linked issues, screenshots or Storybook links, notes on testing.
- Required checks: `yarn lint` passes; build succeeds; tests updated/added.
- Versioning: when changing published package(s), add a Changeset (`yarn changeset`) before merge.

## Security & Configuration
- Node `22.9.0` (`.nvmrc`) and Yarn 4 (`packageManager`).
- Do not commit secrets. Keep large artifacts out of VCS (`dist`, `node_modules`).
- PR previews for Storybook are published via GitHub Pages; verify links in PR comments.

## Cursor Rules Review
- `.cursor/rules/react-typescript-patterns.mdc` (Always): React 19 + TS conventions, refs, props/types, naming.
- `.cursor/rules/ui-component-patterns.mdc` (Always): Radix + Tailwind 4 + CVA patterns, a11y, performance.
- `.cursor/rules/form-component-patterns.mdc`: Remix Hook Form + Zod wrappers, errors, server actions.
- `.cursor/rules/storybook-testing.mdc`: Storybook play tests, router stub decorator, local/CI flows.
- `.cursor/rules/monorepo-organization.mdc`: Imports/exports, package boundaries, Turbo/Vite/TS paths.
- `.cursor/rules/versioning-with-npm.mdc`: npm CLI version bumps (patch-first), CI publishes on merge.

## Agent OS

AgentOS is a governance and automation framework embedded in this repository to ensure consistency, safety, and traceability across all development workflows. It defines a set of agents (e.g., :researcher, :spec-creation) that guide how features are specified, implemented, and reviewed.

Two foundational documents provide essential context for all contributors and agents:
- `.agentos/memory/constitution.md`: Codifies the non-negotiable principles, rules, and review gates that govern how code is written, tested, versioned, and released. This constitution enforces standards for code style, module boundaries, testing, forms, UI, accessibility, security, and traceability.
- `.agentos/standards/tech-stack.md`: Documents the enforced technologies, frameworks, and tooling for the repository. It operationalizes the constitution by specifying the required stack (e.g., Node, Yarn, TypeScript, React, Tailwind, Storybook, Turbo, Biome) and the structure of the monorepo.

Together, these files ensure that all changes are aligned with the repository’s philosophy and technical standards, providing clear context and guardrails for both human contributors and AI agents.


### AI Agent Workflows
- `:researcher` - Investigate bugs/implementation questions and produce evidence-backed recommendations aligned with the constitution and tech stack.
- `:spec-creation` - Drafts clear, testable AI specs with scope, acceptance criteria, and open questions; see `.agentos/agents/:spec-creation.md`.


When to review before starting work
- Building/refactoring UI components: react-typescript-patterns + ui-component-patterns.
- Form-aware components or validation: form-component-patterns.
- Writing/updating stories or interaction tests: storybook-testing.
- Moving files, changing exports/imports, adding deps/build entries: monorepo-organization.
- Complex UI (data table, Radix primitives, variants): ui-component-patterns for a11y/perf.

Quick checklist
- Files/names: kebab-case files; PascalCase components; named exports only.
- Types: explicit props interfaces; React 19 ref patterns; organize imports (Biome).
- Forms: Zod schemas, proper messages, `fetcher.Form`, show `FormMessage` errors.
- Tests: per-story decorators, semantic queries, three-phase play tests; run `yarn test`.
- Monorepo: no cross-package relative imports; verify `exports`, TS `paths`, Turbo outputs.
