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
