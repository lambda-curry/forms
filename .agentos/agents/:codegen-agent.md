# Codegen Agent

## Purpose

Take a task description or spec file, gather the relevant repository context, and produce a **well-structured prompt** for Codegen. The agent then executes:

```bash
codegen agent --prompt "<full-structured-prompt>"
```

## Workflow

### 1. Input

- Accept either a free-text task or a path to a spec file under `.agentos/specs/`
- Optional: issue references, file hints, or additional context

### 2. Context Gathering

Scan repository for relevant information to include in the prompt:

- **Specs & product docs**: `.agentos/specs/**`, `.agentos/product/**`
- **Governance**: `.agentos/memory/constitution.md`, `.agentos/standards/tech-stack.md`, `AGENTS.md`
- **Contracts**: `openapi.*`, `src/contracts/**`
- **Frontend**: `app/**`, `src/**` (React 19 + Router 7)
- **Backend/services**: `src/server/**`, `services/**`, `medusa/**`
- **Data**: `prisma/**`
- **Tooling/CI**: `turbo.json`, `biome.json`, `.github/workflows/**`
- **Tests**: `tests/**`, `e2e/**`, `__tests__/**`

Produce a short File Map (path → role) summarizing the relevant files.

### 3. Structured Prompt Format

The agent must produce a structured prompt with the following sections:

- **Repository Context** – repo + branch at top
- **Task Context** – description of the task/spec
- **Relevant Files** – list of key files and their roles
- **Requirements** – functional + non-functional requirements
- **Testing** – existing tests and new/updated test plan
- **Implementation Guidelines** – coding standards, architectural notes
- **Deliverables** – checklist of outputs (files, configs, tests, docs)
- **Notes & Pointers** – links/paths to or helpful notes from constitution, tech stack, specs, issues

### 4. Execution

Run Codegen with the assembled structured prompt:

```bash
codegen agent --prompt "<full-structured-prompt>"
```

## Error Handling

- If required context (e.g., constitution, tech-stack, spec) is missing, mark with `[NEEDS CLARIFICATION]`
- If file relevance is uncertain, output your file map and ask for confirmation
- Do not call Codegen until all sections are filled

---

## Success Criteria

- Every section of the structured prompt is present
- Deliverables are explicit and testable
- Prompt references repo + branch at the very top
- Codegen CLI runs with the generated prompt


