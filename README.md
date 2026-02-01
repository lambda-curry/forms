# Lambda Curry Forms

Checkout our [Storybook Documentation](https://lambda-curry.github.io/forms/?path=/docs/0-1-hello-world-start-here--docs) to see the components in action and get started.

A comprehensive form library for React applications with modern data table filtering capabilities.

## ✨ New: Bazza UI Data Table Filters

We've added a powerful, accessible filtering system inspired by Linear's interface:

- 🎛️ **Multiple Filter Types**: Text, option, date, and number filters
- 🔗 **URL State Synchronization**: Filter state persists across page refreshes  
- 📊 **Faceted Filtering**: Dynamic option counts based on current filters
- ⚡ **Client & Server-Side**: Flexible filtering strategies for any dataset size
- ♿ **Accessibility**: Full WCAG 2.1 AA compliance
- 🎨 **Modern UI**: Clean, Linear-inspired design

### Quick Example

```typescript
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter';
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';

const dtf = createColumnConfigHelper<YourDataType>();

const columnConfigs = [
  dtf.text().id('title').accessor(row => row.title).displayName('Title').build(),
  dtf.option().id('status').accessor(row => row.status).displayName('Status')
    .options([
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]).build(),
];

const MyTable = () => {
  const [filters, setFilters] = useFilterSync();
  const { columns, actions, strategy } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client',
    data: yourData,
  });

  return <DataTableFilter columns={columns} filters={filters} actions={actions} strategy={strategy} />;
};
```

📖 **[View Complete Filter Documentation](./packages/components/src/ui/data-table-filter/README.md)**

## Features

### Form Components
- Comprehensive form field components with validation
- React Hook Form integration
- Remix integration for server-side forms
- TypeScript support with excellent IntelliSense

### Data Table Filtering
- Modern Linear-inspired filter interface
- Multiple filter types (text, option, date, number)
- URL state synchronization for filter persistence
- Faceted filtering with dynamic option counts
- Client-side and server-side filtering strategies
- Full accessibility support (WCAG 2.1 AA)
- Comprehensive test coverage

## React Router v7 Integration

When using `@lambdacurry/forms` with `remix-hook-form` in a React Router v7 application, you need to configure Vite to bundle these packages together to share the router context. Without this, you may encounter the error:

```
Error: useHref() may be used only in the context of a <Router> component.
```

Add the following to your application's `vite.config.ts`:

```typescript
export default defineConfig({
  // ... your other plugins
  ssr: {
    noExternal: ['react-hook-form', 'remix-hook-form', '@lambdacurry/forms']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'react-hook-form', 'remix-hook-form'],
    dedupe: ['react', 'react-dom', 'react-router', 'react-hook-form', 'remix-hook-form']
  }
});
```

This ensures all packages share the same `react-router` instance. See the [Consumer Setup Guide](./docs/consumer-setup-guide.md) for complete details and recommended form patterns.

## Getting Started

Step 1: Install dependencies

```bash
yarn install
```

Step 2: Start Storybook

```bash
yarn storybook
```

## Development

### PR Previews

When you create a pull request, a preview of the Storybook documentation will be automatically deployed. You can find the link to the preview in the PR comments. This allows you to review changes to the documentation and components before merging.

Preview URLs follow this format:
```
https://lambda-curry.github.io/forms/pr-preview/pr-[PR_NUMBER]/
```

#### How PR Previews Work

The PR preview system:
1. Builds the Storybook documentation for each PR
2. Deploys it to a PR-specific directory on the `gh-pages` branch
3. Adds a comment to the PR with a link to the preview
4. **Automatically updates the preview when you push new changes to the PR**
5. Cleans up the preview when the PR is closed

#### GitHub Environment Setup

For PR previews to work properly, you need to set up a GitHub environment:

1. Go to your repository settings
2. Navigate to "Environments"
3. Create a new environment named `pr-preview`
4. Configure environment protection rules as needed:
   - You can require reviewers to approve deployment
   - You can limit deployment to specific branches
   - You can add wait timers before deployment

The main branch will continue to deploy to the `github-pages` environment.

#### Troubleshooting PR Previews

If you encounter a 404 error when accessing the PR preview:

1. Make sure the PR build has completed successfully by checking the GitHub Actions tab
2. Verify that the repository has GitHub Pages enabled and configured to deploy from the `gh-pages` branch
3. Check that the PR preview comment contains the correct URL
4. Ensure the PR has been approved for deployment if environment protection rules are enabled
5. Try clearing your browser cache or using an incognito window

The PR preview is deployed to the `gh-pages` branch in a directory structure like:
```
/pr-preview/pr-[PR_NUMBER]/
```

## Publishing

Releases can be published either automatically via CI/CD (using npm trusted publishers) or manually from the command line.

### Automatic Publishing (CI/CD)

When you merge changes to `main` with version updates, the GitHub Actions workflow will automatically publish to npm using [npm trusted publishers](https://docs.npmjs.com/trusted-publishers). This uses OIDC authentication and doesn't require npm tokens.

**Setup required:** Configure trusted publishers on npmjs.com for the `@lambdacurry/forms` package (see setup instructions below).

#### Setting Up Trusted Publishers

1. Go to your package on npmjs.com: https://www.npmjs.com/package/@lambdacurry/forms
2. Navigate to **Settings** → **Trusted Publisher** section
3. Click **"Select your publisher"** → **GitHub Actions**
4. Configure the following:
   - **Organization or user**: `lambda-curry` (or your GitHub username)
   - **Repository**: `forms`
   - **Workflow filename**: `release.yml` (must match exactly, including `.yml` extension)
5. Click **Save**

The workflow file must exist at `.github/workflows/release.yml` in your repository. Once configured, publishes from the `main` branch will use OIDC authentication automatically.

### Manual Publishing

You can also publish manually from the command line when needed.

### Prerequisites

1. **Ensure you're logged into npm:**
   ```bash
   npm login
   ```
   You must be logged in as a user with publish permissions for the `@lambdacurry` organization.

2. **Verify your npm credentials:**
   ```bash
   npm whoami
   ```

3. **Ensure you're on the `main` branch and up to date:**
   ```bash
   git checkout main
   git pull origin main
   ```

### Release Process

#### Step 1: Create Changesets (if needed)

If you have changes that need to be documented in the changelog, create a changeset:

```bash
yarn changeset
```

Follow the prompts to:
- Select which packages to include
- Choose the version bump type (patch, minor, major)
- Write a summary of the changes

#### Step 2: Version Packages

This updates package versions and generates the changelog:

```bash
yarn changeset version
```

This will:
- Update `packages/components/package.json` with the new version
- Update `packages/components/CHANGELOG.md` with the new entries
- Remove the consumed changeset files

#### Step 3: Build and Test

Before publishing, ensure everything builds and tests pass:

```bash
yarn build
yarn test
```

#### Step 4: Publish to npm

Publish the package to npm using changesets:

```bash
yarn release
```

This command runs `changeset publish`, which:
- Runs `yarn build` (via `prepublishOnly` hook in package.json)
- Publishes `@lambdacurry/forms` to npm (uses npm under the hood)
- Creates git tags for the release
- Requires you to be logged into npm (`npm login`)

**Note:** `changeset publish` uses npm CLI internally, so you must be authenticated with npm. The changeset system handles versioning, changelog generation, and publishing all in one workflow.

#### Step 5: Commit and Push

After successful publishing, commit the version changes and push:

```bash
git add .
git commit -m "chore(release): publish vX.Y.Z"
git push origin main
```

### Alternative: Direct npm Publish (Without Changesets)

If you need to publish without using changesets (e.g., for a hotfix), you can use npm directly:

```bash
# From the packages/components directory
cd packages/components
npm version patch -m "chore: bump version to %s"
cd ../..
yarn install  # Update yarn.lock
yarn workspace @lambdacurry/forms build
npm publish --workspace=packages/components
```

**Note:** This bypasses the changeset workflow, so you'll need to manually update the CHANGELOG.md if you want to document the release.

### Troubleshooting

- **"Not logged in" error**: Run `npm login` and verify with `npm whoami`
- **"Permission denied"**: Ensure your npm user has publish permissions for `@lambdacurry` organization
- **Build fails**: Fix build errors before publishing. The `prepublishOnly` hook will prevent publishing if the build fails
