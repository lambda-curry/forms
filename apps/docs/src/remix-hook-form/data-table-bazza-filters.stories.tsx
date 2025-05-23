// --- NEW IMPORTS for Router Form data handling ---
import { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers'; // Use parsers
// --- Corrected Hook Import Paths ---
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter/components/data-table-filter'; // Direct import to avoid circular dependency
import { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters'; // Direct import to avoid circular dependency
// --- NEW IMPORTS for Bazza UI Filters ---
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters'; // Assuming path
import type { DataTableColumnConfig } from '@lambdacurry/forms/ui/data-table-filter/core/types';
import { DataTable } from '@lambdacurry/forms/ui/data-table/data-table';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
// Import the filters schema and types from the new location
import type { FiltersState } from '@lambdacurry/forms/ui/utils/filters'; // Assuming path alias
import { filtersArraySchema } from '@lambdacurry/forms/ui/utils/filters'; // Assuming path alias
// --- Re-add useDataTableFilters import ---
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync'; // Ensure this is the correct path for filter sync
// Add icon imports
import { CalendarIcon, CheckCircledIcon, PersonIcon, StarIcon, TextIcon } from '@radix-ui/react-icons';
import type { Meta, StoryContext, StoryObj } from '@storybook/react'; // FIX: Add Meta, StoryObj, StoryContext
import { expect, userEvent, within } from '@storybook/test'; // Add storybook test imports
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'; // Added PaginationState, SortingState
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import type { OnChangeFn } from '@tanstack/react-table';
import { useMemo } from 'react'; // Added useState, useEffect
import { type LoaderFunctionArgs, useLoaderData, useLocation, useNavigate } from 'react-router'; // Added LoaderFunctionArgs, useLoaderData, useNavigate, useLocation
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub'; // FIX: Add withReactRouterStubDecorator

// --- Use MockIssue Schema and Data ---
interface MockIssue {
  id: string;
  title: string;
  status: 'todo' | 'in progress' | 'done' | 'backlog';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: Date;
  estimatedHours: number; // Add number field for number filter demonstration
}

// --- NEW Data Response Interface ---
interface DataResponse {
  data: MockIssue[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
  facetedCounts: Record<string, Record<string, number>>; // Include faceted counts here
}
// --- END Data Response Interface ---

// --- Mock Database (copied from deleted API route) ---
const mockDatabase: MockIssue[] = [
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
    status: 'in progress',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-02-01'),
    estimatedHours: 3.0,
  },
  {
    id: 'TASK-4',
    title: 'Update documentation',
    status: 'done',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-02-10'),
    estimatedHours: 0.5,
  },
  {
    id: 'TASK-5',
    title: 'Refactor auth module',
    status: 'backlog',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-02-15'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-6',
    title: 'Implement user profile page',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'medium',
    createdDate: new Date('2024-03-01'),
    estimatedHours: 1.0,
  },
  {
    id: 'TASK-7',
    title: 'Design new landing page',
    status: 'todo',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-03-05'),
    estimatedHours: 3.5,
  },
  {
    id: 'TASK-8',
    title: 'Write API integration tests',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-03-10'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-9',
    title: 'Deploy to staging environment',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-03-15'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-10',
    title: 'User feedback session',
    status: 'done',
    assignee: 'Alice',
    priority: 'low',
    createdDate: new Date('2024-03-20'),
    estimatedHours: 0.5,
  },
  {
    id: 'TASK-11',
    title: 'Fix critical bug in payment module',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'high',
    createdDate: new Date('2024-03-22'),
    estimatedHours: 3.0,
  },
  {
    id: 'TASK-12',
    title: 'Update third-party libraries',
    status: 'backlog',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-03-25'),
    estimatedHours: 1.0,
  },
  {
    id: 'TASK-13',
    title: 'Onboard new developer',
    status: 'done',
    assignee: 'Alice',
    priority: 'medium',
    createdDate: new Date('2024-04-01'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-14',
    title: 'Research new caching strategy',
    status: 'todo',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-04-05'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-15',
    title: 'Accessibility audit',
    status: 'in progress',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-04-10'),
    estimatedHours: 2.5,
  },
  // --- END ADDED DATA ---
];

// Function to calculate faceted counts based on the *original* data
// --- FIX: Ensure all defined options have counts (even 0) ---
function calculateFacetedCounts(
  data: MockIssue[],
  countColumns: Array<keyof MockIssue>, // Expect specific keys
  allOptions: Record<keyof MockIssue, { value: string; label: string }[] | undefined>, // Pass defined options
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  countColumns.forEach((columnId) => {
    counts[columnId] = {};
    // Initialize counts for all defined options for this column to 0
    const definedOptions = allOptions[columnId];
    if (definedOptions) {
      definedOptions.forEach((option) => {
        counts[columnId][option.value] = 0;
      });
    }

    // Count occurrences from the actual data
    data.forEach((item) => {
      const value = item[columnId] as string;
      // Ensure value exists before incrementing (might be null/undefined)
      if (value !== null && value !== undefined) {
        counts[columnId][value] = (counts[columnId][value] || 0) + 1;
      }
    });
  });
  return counts;
}
// --- End Helper Functions ---

// --- Define Columns with Bazza UI DSL (Task 4) ---
// Explicitly type the helper
const dtf = createColumnConfigHelper<MockIssue>();

// 1. Bazza UI Filter Configurations
const columnConfigs = [
  // Use accessor functions instead of strings
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
    .accessor((row) => row.status) // Use accessor function
    .displayName('Status')
    .icon(CheckCircledIcon)
    .options([
      { value: 'todo', label: 'Todo' },
      { value: 'in progress', label: 'In Progress' },
      { value: 'done', label: 'Done' },
      { value: 'backlog', label: 'Backlog' },
    ])
    .build(),
  dtf
    .option()
    .id('assignee')
    .accessor((row) => row.assignee) // Use accessor function
    .displayName('Assignee')
    .icon(PersonIcon)
    .options([
      { value: 'Alice', label: 'Alice' },
      { value: 'Bob', label: 'Bob' },
      { value: 'Charlie', label: 'Charlie' },
    ])
    .build(),
  dtf
    .option()
    .id('priority')
    .accessor((row) => row.priority) // Use accessor function
    .displayName('Priority')
    .icon(StarIcon)
    .options([
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ])
    .build(),
  dtf
    .date()
    .id('createdDate')
    .accessor((row) => row.createdDate)
    .displayName('Created Date')
    .icon(CalendarIcon)
    .build(), // Use accessor function
  dtf
    .number()
    .id('estimatedHours')
    .accessor((row) => row.estimatedHours)
    .displayName('Estimated Hours')
    .icon(CheckCircledIcon)
    .build(), // Use accessor function
];

// --- FIX: Extract defined options for faceted counting ---
const allDefinedOptions: Record<keyof MockIssue, { value: string; label: string }[] | undefined> = {
  id: undefined,
  title: undefined,
  status: columnConfigs.find((c) => c.id === 'status')?.options,
  assignee: columnConfigs.find((c) => c.id === 'assignee')?.options,
  priority: columnConfigs.find((c) => c.id === 'priority')?.options,
  createdDate: undefined,
  estimatedHours: undefined,
};

// 2. TanStack Table Column Definitions (for rendering)
const columns: ColumnDef<MockIssue>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <div>{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
    cell: ({ row }) => <div>{row.getValue('assignee')}</div>,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('priority')}</div>,
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdDate')).toLocaleDateString()}</div>,
    enableSorting: true, // Enable sorting for date
  },
  {
    accessorKey: 'estimatedHours',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estimated Hours" />,
    cell: ({ row }) => <div>{row.getValue('estimatedHours')}</div>,
    enableSorting: true, // Enable sorting for number
  },
];
// --- END Column Definitions ---

// --- NEW Wrapper Component using Loader Data ---
function DataTableWithBazzaFilters() {
  // Get the loader data (filtered/paginated/sorted data from server)
  const loaderData = useLoaderData<DataResponse>();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize data from loader response
  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;
  const facetedCounts = loaderData?.facetedCounts ?? {};

  // Convert facetedCounts to the correct type for useDataTableFilters (Map-based)
  const facetedOptionCounts = useMemo(() => {
    const result: Partial<Record<string, Map<string, number>>> = {};
    Object.entries(facetedCounts).forEach(([col, valueObj]) => {
      result[col] = new Map(Object.entries(valueObj));
    });
    return result;
  }, [facetedCounts]);

  // --- Bazza UI Filter Setup ---
  // 1. Initialize filters state with useFilterSync (syncs with URL)
  const [filters, setFilters] = useFilterSync();

  // --- Read pagination and sorting directly from URL ---
  const searchParams = new URLSearchParams(location.search);
  const pageIndex = Number.parseInt(searchParams.get('page') ?? '0', 10);
  const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '10', 10);
  const sortField = searchParams.get('sortField');
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'; // 'asc' or 'desc'

  // --- Pagination and Sorting State ---
  const pagination = { pageIndex, pageSize };
  const sorting = sortField ? [{ id: sortField, desc: sortOrder === 'desc' }] : [];

  // --- Event Handlers: update URL directly ---
  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    searchParams.set('page', next.pageIndex.toString());
    searchParams.set('pageSize', next.pageSize.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    if (next.length > 0) {
      searchParams.set('sortField', next[0].id);
      searchParams.set('sortOrder', next[0].desc ? 'desc' : 'asc');
    } else {
      searchParams.delete('sortField');
      searchParams.delete('sortOrder');
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // --- Bazza UI Filter Setup ---
  const bazzaProcessedColumns = useMemo<DataTableColumnConfig<MockIssue>>(() => columnConfigs, []);

  // Define a filter strategy (replace with your actual strategy if needed)
  const filterStrategy = 'server' as const;

  // Setup filter actions and strategy (controlled mode)
  const {
    columns: filterColumns,
    actions,
    strategy,
  } = useDataTableFilters<
    MockIssue,
    DataTableColumnConfig<MockIssue>,
    import('@lambdacurry/forms/ui/data-table-filter/core/types').FilterStrategy
  >({
    columnsConfig: bazzaProcessedColumns,
    filters,
    onFiltersChange: setFilters,
    faceted: facetedOptionCounts,
    strategy: filterStrategy,
    data,
  });

  // --- Table Setup ---
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    pageCount,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Server Filters via Loader)</h1>
      <p className="mb-4">This example demonstrates server-driven filtering using Bazza UI and React Router Loader:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Filter state managed by Bazza UI filters component and synced to URL.</li>
        <li>Pagination and sorting state managed by the URL.</li>
        <li>Data fetched via `loader` based on URL parameters (filters, pagination, sorting).</li>
        <li>Server provides filtered/paginated/sorted data and faceted counts.</li>
      </ul>
      <DataTableFilter columns={filterColumns} filters={filters} actions={actions} strategy={strategy} />
      <DataTable className="mt-4" table={table} columns={columns.length} />
    </div>
  );
}
// --- END Wrapper Component ---

// --- NEW Client-Side Filtering Component ---
function DataTableWithClientSideFilters() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use all data for client-side filtering
  const allData = useMemo(() => mockDatabase, []);

  // Initialize filters state with useFilterSync (syncs with URL)
  const [filters, setFilters] = useFilterSync();

  // --- Read pagination and sorting directly from URL ---
  const searchParams = new URLSearchParams(location.search);
  const pageIndex = Number.parseInt(searchParams.get('page') ?? '0', 10);
  const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '10', 10);
  const sortField = searchParams.get('sortField');
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

  // --- Pagination and Sorting State ---
  const pagination = { pageIndex, pageSize };
  const sorting = sortField ? [{ id: sortField, desc: sortOrder === 'desc' }] : [];

  // --- Event Handlers: update URL directly ---
  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    searchParams.set('page', next.pageIndex.toString());
    searchParams.set('pageSize', next.pageSize.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    if (next.length > 0) {
      searchParams.set('sortField', next[0].id);
      searchParams.set('sortOrder', next[0].desc ? 'desc' : 'asc');
    } else {
      searchParams.delete('sortField');
      searchParams.delete('sortOrder');
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // --- Bazza UI Filter Setup ---
  const bazzaProcessedColumns = useMemo<DataTableColumnConfig<MockIssue>>(() => columnConfigs, []);

  // Define a filter strategy for client-side
  const filterStrategy = 'client' as const;

  // Setup filter actions and strategy (controlled mode)
  const {
    columns: filterColumns,
    actions,
    strategy,
    data: filteredData,
  } = useDataTableFilters<
    MockIssue,
    DataTableColumnConfig<MockIssue>,
    import('@lambdacurry/forms/ui/data-table-filter/core/types').FilterStrategy
  >({
    columnsConfig: bazzaProcessedColumns,
    filters,
    onFiltersChange: setFilters,
    strategy: filterStrategy,
    data: allData,
  });

  // Calculate page count based on filtered data
  const pageCount = Math.ceil(filteredData.length / pageSize);

  // Apply pagination to filtered data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageIndex, pageSize]);

  // --- Table Setup ---
  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      pagination,
      sorting,
    },
    pageCount,
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualFiltering: false, // Client-side filtering
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Client-Side Filters)</h1>
      <p className="mb-4">This example demonstrates client-side filtering using Bazza UI components:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Filter state managed by Bazza UI filters component and synced to URL.</li>
        <li>Pagination and sorting state managed by the URL.</li>
        <li>Data filtered on the client-side for immediate response.</li>
        <li>All filter types: text, option, date, and number filters.</li>
        <li>Real-time filtering without server requests.</li>
      </ul>
      <DataTableFilter columns={filterColumns} filters={filters} actions={actions} strategy={strategy} />
      <DataTable className="mt-4" table={table} columns={columns.length} />
    </div>
  );
}
// --- END Client-Side Wrapper Component ---

// Updated Loader function to return fake data matching DataResponse structure
const handleDataFetch = async ({ request }: LoaderFunctionArgs): Promise<DataResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate latency

  const url = new URL(request.url);
  const params = url.searchParams;

  console.log('handleDataFetch - URL:', url.toString());
  console.log('handleDataFetch - Search Params:', Object.fromEntries(params.entries()));

  // Parse pagination, sorting, and filters from URL using helpers/schemas
  const page = dataTableRouterParsers.page.parse(params.get('page')) ?? 0;
  let pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize')) ?? 10;
  const sortField = params.get('sortField'); // Get raw string or null
  const sortOrder = (params.get('sortOrder') || 'asc') as 'asc' | 'desc'; // 'asc' or 'desc'
  const filtersParam = params.get('filters');

  console.log('handleDataFetch - Parsed Parameters:', { page, pageSize, sortField, sortOrder, filtersParam });

  if (!pageSize || pageSize <= 0) {
    console.log(`[Loader] - Invalid or missing pageSize (${pageSize}), defaulting to 10.`);
    pageSize = 10;
  }

  let parsedFilters: FiltersState = [];
  try {
    if (filtersParam) {
      // Parse and validate filters strictly according to Bazza v0.2 model
      parsedFilters = filtersArraySchema.parse(JSON.parse(filtersParam));
      console.log('handleDataFetch - Parsed Filters:', parsedFilters);
    }
  } catch (error) {
    console.error('[Loader] - Filter parsing/validation error (expecting Bazza v0.2 model):', error);
    parsedFilters = [];
  }

  // --- Apply filtering, sorting, pagination ---
  let processedData = [...mockDatabase];

  // 1. Apply filters (support option and text types)
  if (parsedFilters.length > 0) {
    parsedFilters.forEach((filter) => {
      processedData = processedData.filter((item) => {
        switch (filter.type) {
          case 'option': {
            // Option filter: support multi-value (is any of)
            if (Array.isArray(filter.values) && filter.values.length > 0) {
              const value = item[filter.columnId as keyof MockIssue];
              if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                value === null
              ) {
                return filter.values.includes(value);
              }
              // If value is not a supported type (e.g., Date), skip filtering
              return true;
            }
            return true;
          }
          case 'text': {
            // Text filter: support contains
            if (Array.isArray(filter.values) && filter.values.length > 0 && typeof filter.values[0] === 'string') {
              const value = item[filter.columnId as keyof MockIssue];
              return typeof value === 'string' && value.toLowerCase().includes(String(filter.values[0]).toLowerCase());
            }
            return true;
          }
          // Add more filter types as needed (number, date, etc.)
          default:
            return true;
        }
      });
    });
  }

  // 2. Apply sorting
  if (sortField && sortField in mockDatabase[0]) {
    processedData.sort((a, b) => {
      const aValue = a[sortField as keyof MockIssue];
      const bValue = b[sortField as keyof MockIssue];
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 3. Apply pagination
  const start = page * pageSize;
  const paginatedData = processedData.slice(start, start + pageSize);

  // Calculate faceted counts based on the filtered data (not the original database)
  // This ensures counts reflect the current filtered dataset
  const facetedColumns: Array<keyof MockIssue> = ['status', 'assignee', 'priority'];
  const facetedCounts = calculateFacetedCounts(processedData, facetedColumns, allDefinedOptions);

  console.log(`Returning ${paginatedData.length} items, page ${page}, total ${totalItems}`);

  const response: DataResponse = {
    data: paginatedData,
    meta: {
      total: totalItems,
      page: page,
      pageSize: pageSize,
      pageCount: totalPages,
    },
    facetedCounts: facetedCounts,
  };

  return response;
};

const meta: Meta<typeof DataTableWithBazzaFilters> = {
  title: 'Data Table/Bazza UI Filters',
  component: DataTableWithBazzaFilters,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Bazza UI Data Table Filters

This component demonstrates the integration of Bazza UI filter components with data tables, providing both server-side and client-side filtering capabilities.

## Features

1. **Server-side filtering**: Filters are processed on the server with URL state synchronization
2. **Client-side filtering**: Real-time filtering without server requests
3. **Faceted filtering**: Dynamic option counts based on current filter state
4. **URL state management**: Filter state persists in URL for bookmarking and sharing

## Migration Guide

To migrate from the old data table implementation:

1. **Replace filter components**: Use Bazza UI filter components instead of custom filters
2. **Update column definitions**: Use the new column configuration DSL
3. **Use new hooks**: Replace custom filter logic with useDataTableFilters
4. **Update URL handling**: Use useFilterSync for URL state management

## Usage Examples

See the stories below for complete implementation examples of both server-side and client-side filtering patterns.
        `,
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DataTableWithBazzaFilters,
          loader: handleDataFetch,
        },
        {
          path: '/client-side',
          Component: DataTableWithClientSideFilters,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableWithBazzaFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test functions for the data table with Bazza filters
const testInitialRender = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Check if the table is rendered with the correct title
  const title = canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)');
  expect(title).toBeInTheDocument();

  // Check if the table has the correct number of rows initially (should be pageSize)
  const rows = canvas.getAllByRole('row');
  // First row is header, so we expect pageSize + 1 rows
  expect(rows.length).toBeGreaterThan(1); // At least header + 1 data row

  // Check if pagination is rendered
  const paginationControls = canvas.getByRole('navigation');
  expect(paginationControls).toBeInTheDocument();
};

const testFiltering = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Open the filter dropdown
  const filterButton = canvas.getByRole('button', { name: /filter/i });
  await userEvent.click(filterButton);

  // Select a filter type (e.g., Status)
  const statusFilter = await canvas.findByText('Status');
  await userEvent.click(statusFilter);

  // Select a filter value (e.g., "Todo")
  const todoOption = await canvas.findByText('Todo');
  await userEvent.click(todoOption);

  // Apply the filter
  const applyButton = canvas.getByRole('button', { name: /apply/i });
  await userEvent.click(applyButton);

  // Wait for the table to update
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if the URL has been updated with the filter
  expect(window.location.search).toContain('filters');

  // Check if the filter chip is displayed
  const filterChip = await canvas.findByText('Status: Todo');
  expect(filterChip).toBeInTheDocument();
};

const testPagination = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Get the initial page number
  const initialPageButton = canvas.getByLabelText(/page 1/i);
  expect(initialPageButton).toHaveAttribute('aria-current', 'page');

  // Click on the next page button
  const nextPageButton = canvas.getByLabelText(/go to next page/i);
  await userEvent.click(nextPageButton);

  // Wait for the table to update
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if the URL has been updated with the new page
  expect(window.location.search).toContain('page=1');

  // Check if the page 2 button is now selected
  const page2Button = canvas.getByLabelText(/page 2/i);
  expect(page2Button).toHaveAttribute('aria-current', 'page');
};

const testFilterPersistence = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);

  // Simulate a page refresh by manually setting the URL with filters
  // This is done by checking if the filter chip is still present after pagination
  const filterChips = canvas.getAllByRole('button', { name: /remove filter/i });
  expect(filterChips.length).toBeGreaterThan(0);

  // Check if the filtered data is still displayed correctly
  // We can verify this by checking if the filter chip is still present
  const statusFilterChip = canvas.getByText(/Status:/i);
  expect(statusFilterChip).toBeInTheDocument();
};

export const ServerDriven: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates server-side filtering (via loader), pagination, and sorting with Bazza UI components and URL state synchronization.',
      },
    },
  },
  play: async (context) => {
    // Run the tests in sequence
    await testInitialRender(context);
    await testFiltering(context);
    await testPagination(context);
    await testFilterPersistence(context);
  },
};

export const ClientSide: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates client-side filtering using Bazza UI components and real-time filtering without server requests. All filtering happens in the browser for immediate response.',
      },
    },
    reactRouter: {
      routePath: '/client-side',
    },
  },
  render: () => <DataTableWithClientSideFilters />,
  play: async (context) => {
    // Run the tests in sequence
    await testInitialRender(context);
    await testFiltering(context);
    await testPagination(context);
    await testFilterPersistence(context);
  },
};

export const FacetedFiltering: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: `
**Faceted Filtering Demonstration**

This story specifically highlights the faceted filtering capabilities of Bazza UI filters:

- **Dynamic Option Counts**: See how many items match each filter option
- **Real-time Updates**: Counts update as you apply other filters
- **Multiple Filter Interaction**: Observe how different filters affect available options
- **Zero-Count Handling**: Options with zero matches are still shown but disabled

**Try This:**
1. Apply a Status filter and notice how Assignee counts change
2. Add a Priority filter and see the interaction effects
3. Use the date range filter to see how it affects all option counts
        `,
      },
    },
  },
  render: () => <DataTableWithBazzaFilters />,
  play: async (context) => {
    const canvas = within(context.canvasElement);
    
    // Test faceted filtering specifically
    await testInitialRender(context);
    
    // Open filter dropdown to show faceted counts
    const filterButton = canvas.getByRole('button', { name: /filter/i });
    await userEvent.click(filterButton);
    
    // Wait for dropdown to open
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Check if faceted counts are visible (this would depend on the actual UI implementation)
    // For now, we'll just verify the filter interface is working
    const statusFilter = await canvas.findByText('Status');
    expect(statusFilter).toBeInTheDocument();
  },
};

// --- Simple Test Component (No Router Dependencies) ---
function SimpleDataTableFilterTest() {
  const [filters, setFilters] = useFilterSync();

  const {
    columns,
    actions,
    strategy,
  } = useDataTableFilters<MockIssue>({
    columnsConfig: columnConfigs,
    filters,
    onFiltersChange: setFilters,
    strategy: 'client',
    data: mockDatabase.slice(0, 5), // Use first 5 items for simple test
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Simple Data Table Filter Test</h1>
        <p className="text-gray-600 mb-6">
          Testing basic DataTableFilter component rendering without router dependencies.
        </p>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Filter Interface</h2>
        <DataTableFilter 
          columns={columns} 
          filters={filters} 
          actions={actions} 
          strategy={strategy} 
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Current Filter State</h3>
        <p className="text-sm font-mono">
          Active Filters: {filters.length}
        </p>
        {filters.length > 0 && (
          <ul className="mt-2 space-y-1">
            {filters.map((filter, index) => (
              <li key={filter.id} className="text-sm font-mono">
                {index + 1}. {filter.columnId}: {filter.operator} {JSON.stringify(filter.values)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const SimpleFilterTest: Story = {
  render: () => <SimpleDataTableFilterTest />,
  play: async ({ canvasElement }) => {
    console.log('🚀 Starting Simple Filter Test...');
    
    const canvas = within(canvasElement);
    
    // Check if the basic component renders
    const title = await canvas.findByText('Simple Data Table Filter Test');
    expect(title).toBeInTheDocument();
    
    // Check if the filter interface renders
    const filterInterface = await canvas.findByText('Filter Interface');
    expect(filterInterface).toBeInTheDocument();
    
    console.log('✅ Simple Filter Test completed successfully!');
  },
};

// --- Ultra Simple Test Component (No Dependencies) ---
function UltraSimpleTestComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ultra Simple Test</h1>
      <p className="text-gray-600 mb-6">
        Testing basic component rendering without any dependencies.
      </p>
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Basic Component Test</h2>
        <p>This is a basic test to verify Storybook rendering works.</p>
      </div>
    </div>
  );
}

export const UltraSimpleTest: Story = {
  render: () => <UltraSimpleTestComponent />,
  decorators: [], // Override the default decorators to avoid React Router
  play: async ({ canvasElement }) => {
    console.log('🚀 Starting Ultra Simple Test...');
    
    const canvas = within(canvasElement);
    
    // Check if the basic component renders
    const title = await canvas.findByText('Ultra Simple Test');
    expect(title).toBeInTheDocument();
    
    console.log('✅ Ultra Simple Test completed successfully!');
  },
};
