# Lambda Curry Forms

Checkout our [Storybook Documentation](https://lambda-curry.github.io/forms/?path=/docs/0-1-hello-world-start-here--docs) to see the components in action and get started.

A form library for React applications.

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

#### Troubleshooting PR Previews

If you encounter a 404 error when accessing the PR preview:

1. Make sure the PR build has completed successfully by checking the GitHub Actions tab
2. Verify that the repository has GitHub Pages enabled and configured to deploy from the `gh-pages` branch
3. Check that the PR preview comment contains the correct URL
4. Try clearing your browser cache or using an incognito window

The PR preview is deployed to the `gh-pages` branch in a directory structure like:
```
/pr-preview/pr-[PR_NUMBER]/
```
