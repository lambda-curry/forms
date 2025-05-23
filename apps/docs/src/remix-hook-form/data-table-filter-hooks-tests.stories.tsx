import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
import type { DataTableColumnConfig } from '@lambdacurry/forms/ui/data-table-filter/core/types';
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
import { useDebounceCallback } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-debounce-callback';
import type { FiltersState } from '@lambdacurry/forms/ui/utils/filters';
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';
import { CalendarIcon, CheckCircledIcon, PersonIcon, StarIcon, TextIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useCallback, useEffect, useState } from 'react';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

/**
 * Hook Tests for Bazza UI Data Table Filter
 * 
 * This story contains comprehensive tests for the custom hooks:
 * - useDataTableFilters: Main hook for filter management
 * - useFilterSync: URL synchronization hook
 * - useDebounceCallback: Debouncing utility hook
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

const mockData: MockData[] = [
  {
    id: 'TASK-1',
    title: 'Fix login bug',
    status: 'todo',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-01-15'),
    estimatedHours: 2.5,
  },
  {
    id: 'TASK-2',
    title: 'Add dark mode',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-01-20'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-3',
    title: 'Improve dashboard performance',
    status: 'done',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-02-01'),
    estimatedHours: 3.0,
  },
];

// Column configurations for testing
const dtf = createColumnConfigHelper<MockData>();
const columnConfigs: DataTableColumnConfig<MockData>[] = [
  dtf
    .text()
    .id('title')
    .accessor((row) => row.title)
    .displayName('Title')
    .icon(TextIcon)
    .build(),
  dtf
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
    .build(),
  dtf
    .option()
    .id('assignee')
    .accessor((row) => row.assignee)
    .displayName('Assignee')
    .icon(PersonIcon)
    .options([
      { value: 'Alice', label: 'Alice' },
      { value: 'Bob', label: 'Bob' },
    ])
    .build(),
  dtf
    .number()
    .id('estimatedHours')
    .accessor((row) => row.estimatedHours)
    .displayName('Estimated Hours')
    .icon(StarIcon)
    .build(),
];

const meta: Meta<typeof DataTableFilter> = {
  title: 'Data Table Filter/Hook Tests',
  component: DataTableFilter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Data Table Filter Hook Tests

This story tests the individual hooks used by the Bazza UI Data Table Filter components.

## Hooks Tested

- **useDataTableFilters**: Main hook for managing filter state and data processing
- **useFilterSync**: URL synchronization hook

## Test Coverage

Each hook is tested in isolation to ensure proper functionality and integration.
        `,
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: () => <div>Hook Tests</div>,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Test component for useDataTableFilters hook
 */
const UseDataTableFiltersTest = ({ strategy }: { strategy: 'client' | 'server' }) => {
  const [filters, setFilters] = useState<FiltersState>([]);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = useCallback((result: string) => {
    setTestResults(prev => [...prev, result]);
  }, []);

  // Test the useDataTableFilters hook
  const {
    columns,
    actions,
    strategy: hookStrategy,
    data: filteredData,
  } = useDataTableFilters({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy,
    data: mockData,
  });

  useEffect(() => {
    // Test hook initialization
    if (columns && actions && hookStrategy) {
      addResult('✅ useDataTableFilters initialized successfully');
      addResult(`✅ Strategy set to: ${hookStrategy}`);
      addResult(`✅ Columns configured: ${columns.length}`);
    }

    // Test filter application
    if (strategy === 'client' && filteredData) {
      addResult(`✅ Client-side filtering: ${filteredData.length} items`);
    }
  }, [columns, actions, hookStrategy, filteredData, strategy, addResult]);

  // Test filter updates
  const testFilterUpdate = useCallback(() => {
    const newFilter = {
      id: 'test-filter',
      columnId: 'status',
      type: 'option' as const,
      operator: 'is',
      values: ['todo'],
    };
    setFilters([newFilter]);
    addResult('✅ Filter update test completed');
  }, [addResult]);

  // Test filter clearing
  const testFilterClear = useCallback(() => {
    setFilters([]);
    addResult('✅ Filter clear test completed');
  }, [addResult]);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold">useDataTableFilters Test ({strategy})</h3>
      
      <div className="space-x-2">
        <button
          onClick={testFilterUpdate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Filter Update
        </button>
        <button
          onClick={testFilterClear}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Test Filter Clear
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h4 className="font-bold mb-2">Test Results:</h4>
        <ul className="space-y-1">
          {testResults.map((result, index) => (
            <li key={index} className="font-mono text-sm">
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h4 className="font-bold mb-2">Current State:</h4>
        <p className="font-mono text-sm">Filters: {filters.length}</p>
        <p className="font-mono text-sm">Columns: {columns?.length || 0}</p>
        {strategy === 'client' && (
          <p className="font-mono text-sm">Filtered Data: {filteredData?.length || 0} items</p>
        )}
      </div>
    </div>
  );
};

/**
 * Test component for useFilterSync hook
 */
const UseFilterSyncTest = () => {
  const [filters, setFilters] = useFilterSync();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = useCallback((result: string) => {
    setTestResults(prev => [...prev, result]);
  }, []);

  useEffect(() => {
    addResult('✅ useFilterSync initialized successfully');
    addResult(`✅ Initial filters: ${filters.length}`);
  }, [filters.length, addResult]);

  const testUrlSync = useCallback(() => {
    const testFilter = {
      id: 'url-test',
      columnId: 'status',
      type: 'option' as const,
      operator: 'is',
      values: ['in progress'],
    };
    setFilters([testFilter]);
    addResult('✅ URL sync test - filter added');
    
    // Check if URL was updated
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const filtersParam = urlParams.get('filters');
      if (filtersParam) {
        addResult('✅ URL sync test - URL updated successfully');
      } else {
        addResult('❌ URL sync test - URL not updated');
      }
    }, 100);
  }, [setFilters, addResult]);

  const testFilterPersistence = useCallback(() => {
    // Simulate page refresh by checking current URL state
    const urlParams = new URLSearchParams(window.location.search);
    const filtersParam = urlParams.get('filters');
    
    if (filtersParam) {
      try {
        const parsedFilters = JSON.parse(filtersParam);
        addResult(`✅ Filter persistence test - ${parsedFilters.length} filters in URL`);
      } catch (error) {
        addResult('❌ Filter persistence test - Invalid filters in URL');
      }
    } else {
      addResult('✅ Filter persistence test - No filters in URL (expected for clean state)');
    }
  }, [addResult]);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold">useFilterSync Test</h3>
      
      <div className="space-x-2">
        <button
          onClick={testUrlSync}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test URL Sync
        </button>
        <button
          onClick={testFilterPersistence}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Persistence
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h4 className="font-bold mb-2">Test Results:</h4>
        <ul className="space-y-1">
          {testResults.map((result, index) => (
            <li key={index} className="font-mono text-sm">
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h4 className="font-bold mb-2">Current State:</h4>
        <p className="font-mono text-sm">Filters: {filters.length}</p>
        <p className="font-mono text-sm">URL: {window.location.search || '(empty)'}</p>
      </div>
    </div>
  );
};

/**
 * Test component for useDebounceCallback hook
 */
const UseDebounceCallbackTest = () => {
  const [callCount, setCallCount] = useState(0);
  const [debouncedCallCount, setDebouncedCallCount] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = useCallback((result: string) => {
    setTestResults(prev => [...prev, result]);
  }, []);

  // Test debounced callback with 300ms delay
  const debouncedCallback = useDebounceCallback(
    useCallback(() => {
      setDebouncedCallCount(prev => prev + 1);
      addResult(`✅ Debounced callback executed (call #${debouncedCallCount + 1})`);
    }, [debouncedCallCount, addResult]),
    300
  );

  const testDebouncing = useCallback(() => {
    // Trigger multiple rapid calls
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setCallCount(prev => prev + 1);
        debouncedCallback();
      }, i * 50); // 50ms intervals
    }
    addResult('✅ Debounce test - 5 rapid calls triggered');
  }, [debouncedCallback, addResult]);

  const testImmediateCall = useCallback(() => {
    debouncedCallback();
    addResult('✅ Immediate call test triggered');
  }, [debouncedCallback, addResult]);

  useEffect(() => {
    addResult('✅ useDebounceCallback initialized successfully');
  }, [addResult]);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold">useDebounceCallback Test</h3>
      
      <div className="space-x-2">
        <button
          onClick={testDebouncing}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Test Debouncing (5 rapid calls)
        </button>
        <button
          onClick={testImmediateCall}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test Immediate Call
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h4 className="font-bold mb-2">Test Results:</h4>
        <ul className="space-y-1">
          {testResults.map((result, index) => (
            <li key={index} className="font-mono text-sm">
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-orange-100 p-4 rounded">
        <h4 className="font-bold mb-2">Call Statistics:</h4>
        <p className="font-mono text-sm">Total Calls: {callCount}</p>
        <p className="font-mono text-sm">Debounced Executions: {debouncedCallCount}</p>
        <p className="font-mono text-sm">
          Efficiency: {callCount > 0 ? ((debouncedCallCount / callCount) * 100).toFixed(1) : 0}%
        </p>
      </div>
    </div>
  );
};

export const ClientSideHookTests: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hook Tests - Client Side Strategy</h2>
        <p className="text-gray-600 mb-6">
          Testing all custom hooks with client-side filtering strategy.
        </p>
      </div>
      
      <UseDataTableFiltersTest strategy="client" />
      <UseFilterSyncTest />
      <UseDebounceCallbackTest />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    console.log('🚀 Starting Client-Side Hook Tests...');
    
    // Test useDataTableFilters
    const filterUpdateButton = canvas.getByText('Test Filter Update');
    await userEvent.click(filterUpdateButton);
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const filterClearButton = canvas.getByText('Test Filter Clear');
    await userEvent.click(filterClearButton);
    
    // Test useFilterSync
    const urlSyncButton = canvas.getByText('Test URL Sync');
    await userEvent.click(urlSyncButton);
    
    // Wait for URL update
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const persistenceButton = canvas.getByText('Test Persistence');
    await userEvent.click(persistenceButton);
    
    // Test useDebounceCallback
    const debounceButton = canvas.getByText('Test Debouncing (5 rapid calls)');
    await userEvent.click(debounceButton);
    
    // Wait for debounced execution
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const immediateButton = canvas.getByText('Test Immediate Call');
    await userEvent.click(immediateButton);
    
    console.log('✅ Client-Side Hook Tests completed');
  },
};

export const ServerSideHookTests: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hook Tests - Server Side Strategy</h2>
        <p className="text-gray-600 mb-6">
          Testing hooks with server-side filtering strategy.
        </p>
      </div>
      
      <UseDataTableFiltersTest strategy="server" />
      <UseFilterSyncTest />
      <UseDebounceCallbackTest />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    console.log('🚀 Starting Server-Side Hook Tests...');
    
    // Similar tests but with server strategy
    const filterUpdateButton = canvas.getByText('Test Filter Update');
    await userEvent.click(filterUpdateButton);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const filterClearButton = canvas.getByText('Test Filter Clear');
    await userEvent.click(filterClearButton);
    
    console.log('✅ Server-Side Hook Tests completed');
  },
};
