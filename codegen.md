# Storybook Playwright Testing Guide for Codegen

This guide explains how to write and run Storybook Playwright tests in the lambda-curry/forms repository. These tests combine Storybook's component isolation with Playwright's browser automation to create comprehensive, real-world testing scenarios.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Project Structure](#project-structure)
4. [Writing Story Tests](#writing-story-tests)
5. [Best Practices](#best-practices)
6. [Running Tests](#running-tests)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)
9. [CI/CD Integration](#cicd-integration)

## Overview

The lambda-curry/forms repository uses a sophisticated testing setup that combines:

- **Storybook 8.6.7** for component isolation and documentation
- **@storybook/test-runner** for Playwright-powered browser automation
- **@storybook/test** for testing utilities (userEvent, expect, canvas)
- **React Router stub decorator** for form handling and navigation
- **Remix Hook Form + Zod** for form validation testing

### Key Benefits

- **Dual-purpose stories**: Serve as both documentation and automated tests
- **Real browser testing**: Tests run in actual Chromium browser
- **Integration testing**: Test complete user workflows, not just isolated units
- **Visual regression**: Catch UI changes and interaction issues
- **Developer experience**: Write tests alongside component documentation

## Environment Setup

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn 4.7.0 (managed via corepack)
- Chromium browser (installed via Playwright)

### Initial Setup

1. **Enable Yarn Corepack**:
   ```bash
   corepack enable
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```

3. **Install Playwright Browsers**:
   ```bash
   cd apps/docs
   npx playwright install chromium
   npx playwright install-deps  # Install system dependencies
   ```

4. **Verify Setup**:
   ```bash
   # Build Storybook
   yarn build-storybook
   
   # Run a quick test
   yarn test:local
   ```

### Development Dependencies

The key testing dependencies in `apps/docs/package.json`:

```json
{
  "devDependencies": {
    "@storybook/test-runner": "^0.22.0",
    "@storybook/testing-library": "^0.2.2",
    "start-server-and-test": "^2.0.11",
    "http-server": "^14.1.1"
  },
  "dependencies": {
    "@storybook/test": "^8.6.7"
  }
}
```

## Project Structure

```
lambda-curry/forms/
├── apps/
│   └── docs/                          # Storybook app
│       ├── .storybook/                # Storybook configuration
│       │   ├── main.ts               # Main config
│       │   └── preview.ts            # Preview config
│       ├── src/
│       │   ├── remix-hook-form/      # Story files
│       │   │   ├── text-field.stories.tsx
│       │   │   ├── checkbox.stories.tsx
│       │   │   └── ...
│       │   └── lib/
│       │       └── storybook/
│       │           └── react-router-stub.tsx  # Router decorator
│       ├── package.json              # Test scripts and dependencies
│       └── storybook-static/         # Built Storybook (after build)
└── packages/
    └── components/                    # Component library
        └── src/
            ├── remix-hook-form/      # Form components
            └── ui/                   # UI components
```

## Writing Story Tests

### Basic Story Structure

Every story file follows this pattern:

```typescript
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent } from '@storybook/test';
import { YourComponent } from '@lambdacurry/forms/path/to/component';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Component setup with form schema
const formSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
});

type FormData = z.infer<typeof formSchema>;

// Component wrapper with form logic
const ControlledComponentExample = () => {
  const fetcher = useFetcher<{ message: string }>();
  const methods = useRemixForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { fieldName: '' },
    fetcher,
    submitConfig: { action: '/', method: 'post' },
  });

  return (
    <RemixFormProvider {...methods}>
      <fetcher.Form onSubmit={methods.handleSubmit}>
        <YourComponent name="fieldName" label="Field Label" />
        <Button type="submit">Submit</Button>
        {fetcher.data?.message && (
          <p className="text-green-600">{fetcher.data.message}</p>
        )}
      </fetcher.Form>
    </RemixFormProvider>
  );
};

// Form submission handler
const handleFormSubmission = async (request: Request) => {
  const { data, errors } = await getValidatedFormData<FormData>(
    request, 
    zodResolver(formSchema)
  );

  if (errors) return { errors };
  return { message: 'Form submitted successfully' };
};

// Story metadata
const meta: Meta<typeof YourComponent> = {
  title: 'Category/ComponentName',
  component: YourComponent,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Test functions
const testDefaultValues = ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Field Label');
  expect(input).toHaveValue('');
};

const testInvalidSubmission = async ({ canvas }: StoryContext) => {
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(submitButton);
  
  const errorMessage = await canvas.findByText('Field is required');
  expect(errorMessage).toBeInTheDocument();
};

const testValidSubmission = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Field Label');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  
  await userEvent.type(input, 'Valid input');
  await userEvent.click(submitButton);
  
  const successMessage = await canvas.findByText('Form submitted successfully');
  expect(successMessage).toBeInTheDocument();
};

// Story with tests
export const Default: Story = {
  play: async (storyContext) => {
    testDefaultValues(storyContext);
    await testInvalidSubmission(storyContext);
    await testValidSubmission(storyContext);
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [{
        path: '/',
        Component: ControlledComponentExample,
        action: async ({ request }) => handleFormSubmission(request),
      }],
    }),
  ],
};
```

### Key Components Explained

#### 1. Story Context and Canvas

```typescript
const testFunction = ({ canvas }: StoryContext) => {
  // canvas provides access to testing-library queries
  const element = canvas.getByLabelText('Label Text');
  const button = canvas.getByRole('button', { name: 'Submit' });
};
```

#### 2. User Interactions

```typescript
// Always click before clearing inputs
await userEvent.click(input);
await userEvent.clear(input);
await userEvent.type(input, 'New value');

// Click buttons
await userEvent.click(submitButton);

// Select options
await userEvent.selectOptions(select, 'option-value');
```

#### 3. Async Assertions

```typescript
// Use findBy* for elements that appear after async operations
const errorMessage = await canvas.findByText('Error message');
expect(errorMessage).toBeInTheDocument();

// Add delays for complex async operations
await new Promise(resolve => setTimeout(resolve, 1000));
```

#### 4. React Router Stub Decorator

```typescript
withReactRouterStubDecorator({
  routes: [{
    path: '/',
    Component: YourComponentWrapper,
    action: async ({ request }) => {
      // Handle form submission
      const formData = await request.formData();
      // Process and return response
      return { message: 'Success' };
    },
  }],
  initialPath: '/', // Optional: default path
})
```

## Best Practices

### 1. Test Structure Pattern

Follow the three-phase testing pattern:

```typescript
export const ComponentStory: Story = {
  play: async (storyContext) => {
    // Phase 1: Test initial state
    testDefaultValues(storyContext);
    
    // Phase 2: Test validation/error states
    await testInvalidSubmission(storyContext);
    
    // Phase 3: Test success scenarios
    await testValidSubmission(storyContext);
  },
};
```

### 2. User Interaction Best Practices

```typescript
// ✅ Good: Click before clearing
await userEvent.click(input);
await userEvent.clear(input);
await userEvent.type(input, 'new value');

// ❌ Bad: Clear without clicking first
await userEvent.clear(input); // May not work reliably
```

### 3. Async Testing

```typescript
// ✅ Good: Use findBy* for async elements
const message = await canvas.findByText('Success message');
expect(message).toBeInTheDocument();

// ❌ Bad: Use getBy* for async elements
const message = canvas.getByText('Success message'); // May fail
```

### 4. Error Handling

```typescript
// Test both client-side and server-side validation
const testValidation = async ({ canvas }: StoryContext) => {
  // Test client-side validation
  await userEvent.click(submitButton);
  expect(await canvas.findByText('Required field')).toBeInTheDocument();
  
  // Test server-side validation
  await userEvent.type(input, 'invalid-value');
  await userEvent.click(submitButton);
  expect(await canvas.findByText('Server error')).toBeInTheDocument();
};
```

### 5. Component Isolation

```typescript
// ✅ Good: Each story tests one component scenario
export const DefaultState: Story = { /* ... */ };
export const ErrorState: Story = { /* ... */ };
export const LoadingState: Story = { /* ... */ };

// ❌ Bad: One story testing multiple unrelated scenarios
export const AllScenarios: Story = { /* ... */ };
```

## Running Tests

### Local Development

```bash
# Navigate to docs app
cd apps/docs

# Run tests with server startup (recommended)
yarn test

# Run tests against already running Storybook
yarn test:local

# Build and serve Storybook manually
yarn build-storybook
yarn serve  # Serves on http://localhost:6006
```

### Test Scripts Explained

From `apps/docs/package.json`:

```json
{
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "serve": "http-server ./storybook-static -p 6006 -s",
    "test": "start-server-and-test serve http://127.0.0.1:6006 'test-storybook --url http://127.0.0.1:6006'",
    "test:local": "test-storybook"
  }
}
```

- `test`: Builds Storybook, starts server, runs tests, then stops server
- `test:local`: Runs tests against already running Storybook (faster for development)

### Development Workflow

1. **Start Storybook in development mode**:
   ```bash
   yarn dev
   ```

2. **Write/modify stories** in `src/remix-hook-form/`

3. **Run tests in another terminal**:
   ```bash
   yarn test:local
   ```

4. **Debug failing tests** by viewing Storybook UI at http://localhost:6006

## Common Patterns

### 1. Form Component Testing

```typescript
// Standard form testing pattern
const testFormComponent = async ({ canvas }: StoryContext) => {
  const input = canvas.getByLabelText('Field Label');
  const submitButton = canvas.getByRole('button', { name: 'Submit' });
  
  // Test empty submission
  await userEvent.click(submitButton);
  expect(await canvas.findByText('Field is required')).toBeInTheDocument();
  
  // Test valid submission
  await userEvent.click(input);
  await userEvent.type(input, 'valid input');
  await userEvent.click(submitButton);
  expect(await canvas.findByText('Success')).toBeInTheDocument();
};
```

### 2. Multi-Step Form Testing

```typescript
const testMultiStepForm = async ({ canvas }: StoryContext) => {
  // Step 1
  await userEvent.type(canvas.getByLabelText('First Name'), 'John');
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
  
  // Step 2
  await userEvent.type(canvas.getByLabelText('Email'), 'john@example.com');
  await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  
  // Verify completion
  expect(await canvas.findByText('Form completed')).toBeInTheDocument();
};
```

### 3. Conditional Field Testing

```typescript
const testConditionalFields = async ({ canvas }: StoryContext) => {
  const trigger = canvas.getByLabelText('Show advanced options');
  
  // Initially hidden
  expect(canvas.queryByLabelText('Advanced Field')).not.toBeInTheDocument();
  
  // Show conditional field
  await userEvent.click(trigger);
  expect(canvas.getByLabelText('Advanced Field')).toBeInTheDocument();
};
```

### 4. Data Table Testing

```typescript
const testDataTable = async ({ canvas }: StoryContext) => {
  // Test sorting
  const nameHeader = canvas.getByRole('button', { name: 'Name' });
  await userEvent.click(nameHeader);
  
  // Test filtering
  const filterInput = canvas.getByPlaceholderText('Filter names...');
  await userEvent.type(filterInput, 'John');
  
  // Test pagination
  const nextButton = canvas.getByRole('button', { name: 'Next page' });
  await userEvent.click(nextButton);
};
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

```bash
# Error: EADDRINUSE: address already in use 0.0.0.0:6006
# Solution: Kill existing processes
pkill -f "6006"
# Or use a different port
yarn serve --port 6007
```

#### 2. Playwright Browser Issues

```bash
# Error: Host system is missing dependencies
# Solution: Install system dependencies
npx playwright install-deps

# Error: Browser not found
# Solution: Reinstall browsers
npx playwright install chromium
```

#### 3. Test Timeouts

```typescript
// Increase timeout for slow operations
await new Promise(resolve => setTimeout(resolve, 2000));

// Use waitFor for complex conditions
await waitFor(async () => {
  expect(canvas.getByText('Expected text')).toBeInTheDocument();
}, { timeout: 10000 });
```

#### 4. Element Not Found

```typescript
// ✅ Use findBy* for async elements
const element = await canvas.findByText('Async text');

// ✅ Use queryBy* to check non-existence
expect(canvas.queryByText('Should not exist')).not.toBeInTheDocument();

// ✅ Wait for element to be ready
await userEvent.click(input);
await userEvent.clear(input);
await userEvent.type(input, 'text');
```

#### 5. Form Submission Issues

```typescript
// Ensure form is properly set up with fetcher
const fetcher = useFetcher<ResponseType>();
const methods = useRemixForm({
  // ... config
  fetcher, // Important: pass fetcher
  submitConfig: {
    action: '/',
    method: 'post',
  },
});

// Use fetcher.Form, not regular form
<fetcher.Form onSubmit={methods.handleSubmit}>
  {/* form content */}
</fetcher.Form>
```

### Debugging Tips

1. **Use Storybook UI**: View stories at http://localhost:6006 to see visual state
2. **Add console.logs**: Debug test execution flow
3. **Use browser dev tools**: Inspect elements during test execution
4. **Check network tab**: Verify form submissions and responses
5. **Use Playwright debug mode**: Add `--debug` flag to test command

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Storybook Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          
      - name: Enable Corepack
        run: corepack enable
        
      - name: Install dependencies
        run: yarn install --immutable
        
      - name: Install Playwright
        run: |
          cd apps/docs
          npx playwright install chromium
          npx playwright install-deps
          
      - name: Build Storybook
        run: yarn build-storybook
        
      - name: Run Storybook tests
        run: |
          cd apps/docs
          yarn test
```

### Test Configuration

The test runner uses default configuration but can be customized with a `.test-runner.js` file:

```javascript
// apps/docs/.test-runner.js (optional)
module.exports = {
  // Customize test runner behavior
  browsers: ['chromium'],
  testTimeout: 30000,
  // Add custom test configuration
};
```

## Advanced Patterns

### 1. Custom Test Utilities

Create reusable test utilities:

```typescript
// apps/docs/src/lib/test-utils.ts
export const fillForm = async (canvas: any, fields: Record<string, string>) => {
  for (const [label, value] of Object.entries(fields)) {
    const input = canvas.getByLabelText(label);
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, value);
  }
};

export const submitForm = async (canvas: any) => {
  const submitButton = canvas.getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);
};
```

### 2. Story Composition

Reuse story components across different scenarios:

```typescript
// Base story setup
const BaseStory = {
  decorators: [withReactRouterStubDecorator(/* config */)],
};

// Extend for different scenarios
export const DefaultState: Story = {
  ...BaseStory,
  play: testDefaultBehavior,
};

export const ErrorState: Story = {
  ...BaseStory,
  play: testErrorHandling,
};
```

### 3. Mock Data Management

```typescript
// Create mock data factories
const createMockUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
});

// Use in stories
const users = Array.from({ length: 10 }, (_, i) => 
  createMockUser({ id: `user-${i}`, name: `User ${i}` })
);
```

## Conclusion

This testing setup provides a powerful foundation for ensuring component quality and preventing regressions. The combination of Storybook's component isolation with Playwright's browser automation creates comprehensive tests that closely mirror real user interactions.

### Key Takeaways

1. **Write tests as you write stories** - they serve dual purposes
2. **Follow the established patterns** - consistency makes maintenance easier
3. **Test user workflows, not implementation details** - focus on behavior
4. **Use async assertions** - forms and interactions are often asynchronous
5. **Keep tests focused** - one story should test one scenario well

### Next Steps

1. Start with simple form components using the patterns shown
2. Gradually add more complex scenarios (multi-step forms, data tables)
3. Create reusable test utilities for common patterns
4. Set up CI/CD integration for automated testing
5. Expand testing to cover edge cases and accessibility

For questions or issues, refer to the troubleshooting section or check the existing story files for examples.

