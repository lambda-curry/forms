# AgentOS Constitution — forms (v0.1)

Purpose
- Establish non‑negotiable principles for how this repository is built, tested, reviewed, versioned, and released.
- Aligns with Repository Guidelines in /AGENTS.md and codifies guardrails for AgentOS workflows.

Scope
- Applies to all packages and apps in this monorepo.
- Overrides conflicting guidance in other docs unless a later, more specific project rule supersedes it.

Articles (Non‑negotiables)

I. Runtime, Tooling, and Source Control
- Node: 22.9.0 (see .nvmrc). Yarn: 4 (see packageManager in package.json).
- Source control: Git. Do not commit secrets or large build artifacts (e.g., dist, node_modules).
- Changes to published packages must include a Changeset prior to merge.

II. Code Style, Types, and Naming
- Language: TypeScript (strict). Framework: React 19 (ES modules).
- Style: Biome enforced. 2-space indentation; max line width 120; single quotes; organized imports.
- Naming: Files kebab-case; Components/Types PascalCase; hooks camelCase with use*; named exports only.

III. Monorepo Boundaries and Module Organization
- Workspaces: managed via Yarn workspaces and Turbo. Do not use cross-package relative imports.
- Respect package boundaries: prefer public exports and TS path mappings; no importing from dist.
- Keep barrels (index.ts) where useful; avoid circular dependencies.

IV. Testing and Quality Gates
- Tests: Storybook Test Runner (Playwright). Co-locate as *.test.tsx near stories/components.
- Coverage: critical interactions (forms, validation, a11y, data table/filter behavior) must be tested.
- Required gates for merge: yarn lint passes; yarn build succeeds; yarn test passes (local/CI parity).

V. Forms and Validation
- Use Zod schemas for validation and error messages.
- Use Remix Hook Form patterns: fetcher.Form, server actions, FormMessage for visible errors.
- Keep schemas/types close to components where practical; ensure typed form data end-to-end.

VI. UI, Accessibility, and Performance
- Follow Radix + Tailwind 4 + CVA patterns. Ensure accessible roles/labels/keyboard interactions.
- Prefer composition over inheritance; defer abstractions until repeated ≥3 times.
- Avoid unnecessary re-renders; memoize where it benefits interactive components.

VII. Versioning and Releases
- When changing published packages, add a Changeset (yarn changeset) before merge.
- Version bumps follow patch-first, with CI publishing on merge to main (see repo automation).
- Keep changelogs meaningful and scoped to user-visible impact.

VIII. Commits, PRs, and Review
- Commits: short imperative subject, optional scope, concise rationale (e.g., "Fix: remove deprecated dropdown select").
- PRs: clear description, linked issues/specs, screenshots or Storybook links, notes on testing.
- Verify Storybook PR previews (GitHub Pages) for visual/interactive changes.

IX. Security and Configuration
- No secrets in the repo. Use environment variables/secret managers; never echo secrets in logs.
- Conform to repo Node/Yarn versions across local and CI.
- Keep large artifacts out of VCS; verify .gitignore covers generated outputs.

X. Agent Workflows and Traceability
- Use :researcher for investigation and :spec-creation for implementation-ready specs (see .agentos/agents/).
- Every non-trivial change should link to a spec or issue capturing scope, acceptance criteria, and open questions.
- Specs and PRs must remain in sync; changes to scope require spec updates before merge.

Review and Change Process
- Propose amendments via PR updating this file and any impacted standards/specs.
- Include rationale and references to repo evidence (configs, code paths, CI checks).
- Exceptions must be explicitly documented in the PR and time-bounded where possible.

Pre-flight Checklist (before coding)
- Node matches .nvmrc (22.9.0) and Yarn is v4.
- Workspace health: yarn workspaces list succeeds; turbo graph resolves.
- Lint/typecheck baseline is clean (yarn lint).

Post-flight Checklist (before merge)
- Lint/build/tests pass: yarn lint, yarn build, yarn test.
- Changesets present for published package changes.
- Docs/stories/tests updated to reflect behavior changes.

References
- /AGENTS.md (Repository Guidelines)
- .cursor/rules/* (React TS patterns, UI component patterns, form component patterns, storybook testing, monorepo organization, versioning with npm)