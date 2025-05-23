# Playwright Storybook Testing Guide

This document explains the comprehensive testing setup for filter components using Playwright and Storybook.

## Overview

The project uses `@storybook/test-runner` with Playwright under the hood to provide comprehensive component testing. This setup allows us to test complex user interactions, state management, and URL synchronization in a realistic browser environment.

## Test Architecture

### Framework Stack
- **Test Runner**: `@storybook/test-runner` (Playwright-based)
- **Test Library**: `@storybook/test` (includes userEvent, expect, within)
- **Execution**: `start-server-and-test` for CI/CD integration
- **Browser**: Chromium (via Playwright)

### Test File Structure

```
apps/docs/src/remix-hook-form/
├── data-table-filter.test.stories.tsx          # Core filter component tests
├── data-table-router-form.test.stories.tsx     # Router integration tests
├── filter-components.test.stories.tsx          # Edge cases and error states
└── filter-integration.test.stories.tsx         # Complete workflow tests
```

## Test Categories

### 1. Core Filter Component Tests (`data-table-filter.test.stories.tsx`)

Tests the `DataTableFacetedFilter` component in isolation:

- **Initial State**: Verify default state and no selections
- **Single Selection**: Test selecting one filter option
- **Multiple Selection**: Test selecting multiple options
- **Search Functionality**: Test filtering options via search
- **Clear Operations**: Test clearing individual and all filters
- **Badge Display**: Test how multiple selections are displayed
- **No Results State**: Test empty search results

**Key Test Functions:**
```typescript
testInitialState()           // Verify default state
testSingleFilterSelection()  // Test basic selection
testMultipleFilterSelection() // Test multiple selections
testFilterSearch()           // Test search functionality
testClearIndividualFilter()  // Test clearing filters
testNoResultsState()         // Test empty states
```

### 2. Router Integration Tests (`data-table-router-form.test.stories.tsx`)

Tests the complete `DataTableRouterForm` with URL synchronization:

- **Initial Table State**: Verify table loads with correct headers and data
- **Filter Application**: Test applying status and priority filters
- **Multiple Filters**: Test combining different filter types
- **Search Integration**: Test search functionality with filters
- **Pagination**: Test pagination controls with filters
- **Sorting**: Test sorting functionality with filters
- **URL Persistence**: Test filter state persistence in URL

**Key Test Functions:**
```typescript
testInitialTableState()      // Verify table initialization
testStatusFilterApplication() // Test filter application
testMultipleFiltersApplication() // Test filter combinations
testSearchFunctionality()    // Test search integration
testPaginationControls()     // Test pagination
testSortingFunctionality()   // Test sorting
testURLStatePersistence()    // Test URL synchronization
```

### 3. Edge Cases and Error States (`filter-components.test.stories.tsx`)

Tests edge cases and error conditions:

- **Empty Options**: Test filters with no available options
- **Single Option**: Test filters with only one option
- **Many Options**: Test performance with 20+ options
- **Special Characters**: Test options with quotes, HTML, emojis
- **Pre-selected Values**: Test filters with initial selections
- **Long Option Names**: Test UI handling of very long text
- **Search Edge Cases**: Test search with various inputs

**Key Test Functions:**
```typescript
testEmptyOptionsFilter()     // Test empty option sets
testSingleOptionFilter()     // Test single option scenarios
testManyOptionsFilter()      // Test performance scenarios
testSpecialCharactersFilter() // Test special character handling
testPreselectedValues()      // Test initial state scenarios
testLongOptionNameHandling() // Test UI overflow scenarios
```

### 4. Integration Workflow Tests (`filter-integration.test.stories.tsx`)

Tests complete user workflows and complex interactions:

- **Complete Workflow**: Test full filter application sequence
- **Filter Combinations**: Test multiple filter types together
- **Filter with Sorting**: Test filters persisting through sorting
- **Filter with Pagination**: Test filters persisting through pagination
- **State Recovery**: Test filter state maintenance
- **Search with Filters**: Test search combined with filters
- **Complete Reset**: Test clearing all filters and state

**Key Test Functions:**
```typescript
testCompleteFilterWorkflow() // Test end-to-end workflow
testFilterCombinations()     // Test complex filter combinations
testFilterWithSorting()      // Test filter + sort interactions
testFilterWithPagination()   // Test filter + pagination
testFilterStateRecovery()    // Test state persistence
testSearchWithFilters()      // Test search + filter combinations
```

## Running Tests

### Prerequisites

```bash
# 1. Setup Yarn Corepack
corepack enable

# 2. Install dependencies
yarn install

# 3. Install Playwright Chromium
npx playwright install chromium
```

### Test Commands

```bash
# Run all Storybook tests
yarn test

# Run Storybook in development mode (for manual testing)
yarn storybook

# Build Storybook for testing
yarn build-storybook

# Run specific test pattern
yarn test --grep "data-table"

# Run tests locally (assumes Storybook is already running)
yarn test:local
```

### GitHub Actions Integration

The tests are configured to run in CI/CD with the following workflow:

```yaml
- name: Setup Yarn Corepack
  run: corepack enable

- name: Install dependencies
  run: yarn install

- name: Install Playwright Chromium
  run: npx playwright install chromium

- name: Run tests
  run: yarn test
```

## Test Patterns and Best Practices

### Story Structure

Each test story follows this pattern:

```typescript
const meta: Meta<typeof Component> = {
  title: 'Category/Test Name',
  component: Component,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

// Individual test functions
const testSpecificScenario = async ({ canvas }: StoryContext) => {
  // Test implementation
};

// Comprehensive test story
export const ComprehensiveTests: Story = {
  render: () => <TestComponent />,
  play: async (storyContext) => {
    await testScenario1(storyContext);
    await testScenario2(storyContext);
    // ... more tests
  },
};

// Individual test stories for focused testing
export const SpecificScenario: Story = {
  render: () => <TestComponent />,
  play: testSpecificScenario,
};
```

### Test Implementation Guidelines

1. **Use Proper Meta Typing**: Always use `Meta<typeof Component>` with `satisfies`
2. **Component Isolation**: Point `meta.component` to the actual component being tested
3. **Async Operations**: Use `await` for user interactions and state changes
4. **Wait for Updates**: Add delays for data loading and state updates
5. **Descriptive Assertions**: Use clear, descriptive expect statements
6. **Test Data**: Use realistic test data that matches production scenarios

### Common Test Utilities

```typescript
// Wait for elements to appear
await expect(canvas.findByText('Expected Text')).resolves.toBeInTheDocument();

// User interactions
await userEvent.click(button);
await userEvent.type(input, 'text');
await userEvent.clear(input);

// Working with popovers/dialogs
const popover = await canvas.findByRole('dialog');
const option = within(popover).getByText('Option');

// Testing state changes
expect(element).toHaveTextContent('Expected Content');
expect(element).not.toHaveTextContent('Unexpected Content');

// Data loading delays
await new Promise(resolve => setTimeout(resolve, 300));
```

## Debugging Tests

### Local Development

1. Start Storybook: `yarn storybook`
2. Navigate to test stories in the browser
3. Use browser dev tools to inspect component state
4. Check console for errors and logs

### Test Failures

1. **Component-Test Misalignment**: Ensure tests expect what components actually render
2. **Timing Issues**: Add appropriate delays for async operations
3. **Element Selection**: Use proper selectors and wait for elements
4. **State Management**: Verify component state updates correctly

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Element not found | Use `findBy*` queries and await them |
| Test timing out | Add delays for async operations |
| Popover not opening | Ensure proper click targets and timing |
| State not updating | Check component re-render triggers |
| URL not updating | Verify router integration and delays |

## Test Coverage

The test suite covers:

- ✅ **Component Rendering**: All filter components render correctly
- ✅ **User Interactions**: Click, type, select, clear operations
- ✅ **State Management**: Filter selections and updates
- ✅ **URL Synchronization**: Filter state in URL parameters
- ✅ **Search Integration**: Search combined with filters
- ✅ **Pagination**: Filter persistence across pages
- ✅ **Sorting**: Filter persistence with sorting
- ✅ **Edge Cases**: Empty states, special characters, performance
- ✅ **Error Handling**: Invalid inputs and error states
- ✅ **Accessibility**: Basic accessibility compliance

## Future Enhancements

Potential areas for test expansion:

1. **Performance Testing**: Large dataset handling
2. **Accessibility Testing**: Screen reader compatibility
3. **Mobile Testing**: Touch interactions and responsive design
4. **Network Testing**: Offline scenarios and error states
5. **Browser Testing**: Cross-browser compatibility
6. **Visual Testing**: Screenshot comparison testing

## Contributing

When adding new filter components or features:

1. Create corresponding test stories following the established patterns
2. Include edge cases and error scenarios
3. Test URL synchronization if applicable
4. Add integration tests for complex workflows
5. Update this documentation with new test categories
6. Ensure all tests pass before submitting PRs

## Resources

- [Storybook Test Runner Documentation](https://storybook.js.org/docs/writing-tests/test-runner)
- [Playwright Testing Documentation](https://playwright.dev/docs/intro)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [React Router Testing](https://reactrouter.com/en/main/start/testing)

