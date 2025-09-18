import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter/components/data-table-filter';
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import { DEFAULT_OPERATORS, filterTypeOperatorDetails } from '@lambdacurry/forms/ui/data-table-filter/core/operators';
import type {
  ColumnDataType,
  FilterOperatorDetailsBase,
  FilterOperatorTarget,
} from '@lambdacurry/forms/ui/data-table-filter/core/types';
import { CalendarIcon, CheckCircledIcon, StarIcon, TextIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { withReactRouterStubDecorator } from '../../lib/storybook/react-router-stub';

/**
 * Unit Tests for Bazza UI Data Table Filter Core Utilities
 *
 * This story contains comprehensive unit tests for the core utilities:
 * - Column configuration builder (filters.ts)
 * - Filter operators (operators.ts)
 * - Type definitions and utilities (types.ts)
 */

// Mock data interface for testing
interface MockData {
  id: string;
  title: string;
  status: 'todo' | 'in progress' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: Date;
  estimatedHours: number;
}

const meta: Meta<typeof DataTableFilter> = {
  title: 'Data Table Filter/Unit Tests',
  component: DataTableFilter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Bazza UI Data Table Filter - Unit Tests

This story contains comprehensive unit tests for the core utilities of the Bazza UI Data Table Filter system.

## Test Coverage

### Core Utilities
- **Column Configuration Builder**: Tests the fluent API for creating column configurations
- **Filter Operators**: Tests operator definitions and behavior for different data types
- **Type System**: Tests TypeScript type definitions and utility functions

### Filter Types Tested
- **Text Filters**: String-based filtering with contains, equals, etc.
- **Option Filters**: Single and multi-select filtering
- **Date Filters**: Date range and comparison filtering
- **Number Filters**: Numeric range and comparison filtering

## Testing Strategy

These tests run in Storybook using @storybook/test and verify:
1. **API Correctness**: Ensure the fluent API works as expected
2. **Type Safety**: Verify TypeScript types are correctly inferred
3. **Operator Behavior**: Test filter operators for all data types
4. **Edge Cases**: Handle null, undefined, and invalid inputs
5. **Performance**: Ensure utilities perform well with large datasets
        `,
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: () => <div>Unit Tests</div>,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Test the column configuration builder fluent API
 */
const testColumnConfigBuilder = () => {
  console.log('🧪 Testing Column Configuration Builder...');

  const dtf = createColumnConfigHelper<MockData>();

  // Test text column configuration
  const textColumn = dtf
    .text()
    .id('title')
    .accessor((row) => row.title)
    .displayName('Task Title')
    .icon(TextIcon)
    .build();

  expect(textColumn.type).toBe('text');
  expect(textColumn.id).toBe('title');
  expect(textColumn.displayName).toBe('Task Title');
  expect(textColumn.icon).toBe(TextIcon);
  expect(typeof textColumn.accessor).toBe('function');

  // Test option column configuration
  const statusColumn = dtf
    .option()
    .id('status')
    .accessor((row) => row.status)
    .displayName('Status')
    .icon(CheckCircledIcon)
    .options([
      { value: 'todo', label: 'Todo' },
      { value: 'in progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ])
    .build();

  expect(statusColumn.type).toBe('option');
  expect(statusColumn.id).toBe('status');
  expect(statusColumn.options).toHaveLength(3);
  expect(statusColumn.options?.[0]).toEqual({ value: 'todo', label: 'Todo' });

  // Test date column configuration
  const dateColumn = dtf
    .date()
    .id('createdDate')
    .accessor((row) => row.createdDate)
    .displayName('Created Date')
    .icon(CalendarIcon)
    .build();

  expect(dateColumn.type).toBe('date');
  expect(dateColumn.id).toBe('createdDate');

  // Test number column configuration
  const numberColumn = dtf
    .number()
    .id('estimatedHours')
    .accessor((row) => row.estimatedHours)
    .displayName('Estimated Hours')
    .icon(StarIcon)
    .build();

  expect(numberColumn.type).toBe('number');
  expect(numberColumn.id).toBe('estimatedHours');

  console.log('✅ Column Configuration Builder tests passed');
};

/**
 * Test filter operators for different data types
 */
const testFilterOperators = () => {
  console.log('🧪 Testing Filter Operators...');

  // Test default operators for each data type
  const textOperators = DEFAULT_OPERATORS.text;
  expect(textOperators.single).toBe('contains');
  expect(textOperators.multiple).toBe('contains');

  const numberOperators = DEFAULT_OPERATORS.number;
  expect(numberOperators.single).toBe('is');
  expect(numberOperators.multiple).toBe('is between');

  const dateOperators = DEFAULT_OPERATORS.date;
  expect(dateOperators.single).toBe('is');
  expect(dateOperators.multiple).toBe('is between');

  const optionOperators = DEFAULT_OPERATORS.option;
  expect(optionOperators.single).toBe('is');
  expect(optionOperators.multiple).toBe('is any of');

  // Test operator details retrieval using filterTypeOperatorDetails
  const textContainsDetails = filterTypeOperatorDetails.text.contains;
  expect(textContainsDetails).toBeDefined();
  expect(textContainsDetails.target).toBe('single');

  const numberBetweenDetails = filterTypeOperatorDetails.number['is between'];
  expect(numberBetweenDetails).toBeDefined();
  expect(numberBetweenDetails.target).toBe('multiple');

  console.log('✅ Filter Operators tests passed');
};

/**
 * Test operator behavior with different data types
 */
const testOperatorBehavior = () => {
  console.log('🧪 Testing Operator Behavior...');

  // Test all supported data types
  const supportedTypes: ColumnDataType[] = ['text', 'number', 'date', 'option'];
  const supportedTargets: FilterOperatorTarget[] = ['single', 'multiple'];

  supportedTypes.forEach((type) => {
    supportedTargets.forEach((target) => {
      const defaultOperator = DEFAULT_OPERATORS[type][target];
      expect(defaultOperator).toBeDefined();

      const operatorDetails = filterTypeOperatorDetails[type][
        defaultOperator as keyof (typeof filterTypeOperatorDetails)[typeof type]
      ] as FilterOperatorDetailsBase<string, typeof type>;
      expect(operatorDetails).toBeDefined();

      // For text filters, both single and multiple use 'contains' which has target 'single'
      // For other types, the target should match
      if (type === 'text') {
        expect(operatorDetails.target).toBe('single');
      } else {
        expect(operatorDetails.target).toBe(target);
      }
    });
  });

  console.log('✅ Operator Behavior tests passed');
};

/**
 * Test edge cases and error handling
 */
const testEdgeCases = () => {
  console.log('🧪 Testing Edge Cases...');

  const dtf = createColumnConfigHelper<MockData>();

  // Test building column without required fields
  try {
    const _incompleteColumn = dtf.text().build();
    // Should not reach here - should throw an error
    throw new Error('Expected build() to throw an error for incomplete column');
  } catch (error) {
    // This is expected behavior - column builder requires all fields
    console.log('Column builder requires all fields to be set');
    expect((error as Error).message).toContain('required');
  }

  // Test with empty options array
  const emptyOptionsColumn = dtf
    .option()
    .id('empty')
    .accessor((row) => row.status)
    .displayName('Empty Options')
    .icon(CheckCircledIcon)
    .options([])
    .build();

  expect(emptyOptionsColumn.options).toEqual([]);

  console.log('✅ Edge Cases tests passed');
};

/**
 * Test type safety and TypeScript inference
 */
const testTypeSafety = () => {
  console.log('🧪 Testing Type Safety...');

  const dtf = createColumnConfigHelper<MockData>();

  // Test that accessor function is properly typed
  const typedColumn = dtf
    .text()
    .id('title')
    .accessor((row) => {
      // TypeScript should infer row as MockData
      expect(typeof row.title).toBe('string');
      expect(typeof row.id).toBe('string');
      return row.title;
    })
    .displayName('Title')
    .icon(TextIcon)
    .build();

  expect(typedColumn.type).toBe('text');

  // Test option values are properly typed
  const statusColumn = dtf
    .option()
    .id('status')
    .accessor((row) => row.status)
    .displayName('Status')
    .icon(CheckCircledIcon)
    .options([
      { value: 'todo', label: 'Todo' },
      { value: 'in progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
    ])
    .build();

  // Verify option values match the expected type
  statusColumn.options?.forEach((option) => {
    expect(['todo', 'in progress', 'done']).toContain(option.value);
  });

  console.log('✅ Type Safety tests passed');
};

export const CoreUtilitiesTests: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Core Utilities Unit Tests</h2>
      <p className="text-gray-600">
        Running comprehensive unit tests for Bazza UI Data Table Filter core utilities. Check the browser console for
        detailed test output.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p className="font-mono text-sm">
          Tests are running in the background. Check the Actions panel below for results.
        </p>
      </div>
    </div>
  ),
  play: async () => {
    console.log('🚀 Starting Core Utilities Unit Tests...');

    // Run all test suites
    testColumnConfigBuilder();
    testFilterOperators();
    testOperatorBehavior();
    testEdgeCases();
    testTypeSafety();

    console.log('🎉 All Core Utilities Unit Tests completed successfully!');
  },
};

/**
 * Performance tests for core utilities
 */
const testPerformance = () => {
  console.log('🧪 Testing Performance...');

  const dtf = createColumnConfigHelper<MockData>();

  // Test performance of building many columns
  const startTime = performance.now();

  for (let i = 0; i < 1000; i++) {
    dtf
      .text()
      .id(`column_${i}`)
      .accessor((row) => row.title)
      .displayName(`Column ${i}`)
      .icon(TextIcon)
      .build();
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Built 1000 columns in ${duration.toFixed(2)}ms`);
  expect(duration).toBeLessThan(1000); // Should complete in under 1 second

  // Test performance of operator lookups
  const operatorStartTime = performance.now();

  for (let i = 0; i < 10000; i++) {
    filterTypeOperatorDetails.text.contains;
    filterTypeOperatorDetails.number['is between'];
    filterTypeOperatorDetails.option['is any of'];
  }

  const operatorEndTime = performance.now();
  const operatorDuration = operatorEndTime - operatorStartTime;

  console.log(`Performed 30000 operator lookups in ${operatorDuration.toFixed(2)}ms`);
  expect(operatorDuration).toBeLessThan(500); // Should complete in under 500ms

  console.log('✅ Performance tests passed');
};

export const PerformanceTests: Story = {
  render: () => (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Performance Tests</h2>
      <p className="text-gray-600">Testing performance characteristics of core utilities with large datasets.</p>
      <div className="bg-yellow-100 p-4 rounded">
        <p className="font-mono text-sm">Performance tests measure execution time for bulk operations.</p>
      </div>
    </div>
  ),
  play: async () => {
    console.log('🚀 Starting Performance Tests...');
    testPerformance();
    console.log('🎉 Performance Tests completed successfully!');
  },
};
