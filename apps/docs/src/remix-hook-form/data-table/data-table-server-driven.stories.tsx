import type { Meta, StoryObj } from '@storybook/react';
import { useMemo } from 'react';
import { type LoaderFunctionArgs, useLoaderData, useSearchParams } from 'react-router';
import { columnConfigs, columns } from './data-table-stories.components';
import {
  calculateFacetedCounts,
  type DataResponse,
  DataTable,
  DataTableFilter,
  dataTableRouterParsers,
  filtersArraySchema,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type MockIssue,
  mockDatabase,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useDataTableFilters,
  useFilterSync,
  useReactTable,
  withReactRouterStubDecorator,
} from './data-table-stories.helpers';
import { testFiltering, testInitialRender, testPagination } from './data-table-stories.test-utils';

// --- Data Fetch Handler ---
const handleDataFetch = async ({ request }: LoaderFunctionArgs): Promise<DataResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate latency

  const url = new URL(request.url);
  const params = url.searchParams;

  // Parse pagination, sorting, and filters from URL using helpers/schemas
  const page = dataTableRouterParsers.page.parse(params.get('page')) ?? 0;
  let pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize')) ?? 10;
  const sortField = params.get('sortField'); // Get raw string or null
  const sortOrder = (params.get('sortOrder') || 'asc') as 'asc' | 'desc'; // 'asc' or 'desc'
  const filtersParam = params.get('filters');

  if (!pageSize || pageSize <= 0) {
    pageSize = 10;
  }

  let parsedFilters: Array<{ type: string; columnId: string; values: unknown[] }> = [];
  try {
    if (filtersParam) {
      // Parse and validate filters strictly according to Bazza v0.2 model
      parsedFilters = filtersArraySchema.parse(JSON.parse(filtersParam));
    }
  } catch (error) {
    console.error('[Loader] - Filter parsing/validation error:', error);
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

  // Calculate faceted counts based on the filtered data
  const allDefinedOptions: Record<keyof MockIssue, { value: string; label: string }[] | undefined> = {
    id: undefined,
    title: undefined,
    status: columnConfigs.find((c) => c.id === 'status')?.options,
    assignee: columnConfigs.find((c) => c.id === 'assignee')?.options,
    priority: columnConfigs.find((c) => c.id === 'priority')?.options,
    createdDate: undefined,
    estimatedHours: undefined,
  };

  const facetedColumns: Array<keyof MockIssue> = ['status', 'assignee', 'priority'];
  const facetedCounts = calculateFacetedCounts(processedData, facetedColumns, allDefinedOptions);

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

// --- Main Component ---
function DataTableWithBazzaFilters() {
  // Get the loader data (filtered/paginated/sorted data from server)
  const loaderData = useLoaderData<DataResponse>();
  const [searchParams, setSearchParams] = useSearchParams();

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
    setSearchParams(searchParams);
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
    setSearchParams(searchParams);
  };

  // --- Bazza UI Filter Setup ---
  const bazzaProcessedColumns = useMemo(() => columnConfigs, []);

  // Define a filter strategy (replace with your actual strategy if needed)
  const filterStrategy = 'server' as const;

  // Setup filter actions and strategy (controlled mode)
  const {
    columns: filterColumns,
    actions,
    strategy,
  } = useDataTableFilters({
    columnsConfig: bazzaProcessedColumns,
    filters,
    onFiltersChange: setFilters,
    faceted: facetedOptionCounts,
    strategy: filterStrategy,
    data,
  });

  // --- TanStack Table Setup ---
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Server Filters via Loader)</h1>
        <p className="text-gray-600 mb-6">
          This demonstrates server-side filtering, pagination, and sorting with Bazza UI components and URL state
          synchronization.
        </p>
      </div>

      {/* Bazza UI Filter Interface */}
      <DataTableFilter columns={filterColumns} filters={filters} actions={actions} strategy={strategy} />

      {/* Data Table */}
      <DataTable table={table} columns={columns.length} pageCount={pageCount} />
    </div>
  );
}

// --- Test Functions ---
const testInitialRenderServerSide = testInitialRender('Issues Table (Bazza UI Server Filters via Loader)');
const testPaginationServerSide = testPagination({ serverSide: true });

// --- Story Configuration ---
const meta: Meta<typeof DataTableWithBazzaFilters> = {
  title: 'Data Table/Server Driven Filters',
  component: DataTableWithBazzaFilters,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Server-side filtering with Bazza UI components and URL state synchronization.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ServerDriven: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates server-side filtering (via loader), pagination, and sorting with Bazza UI components and URL state synchronization.',
      },
      source: {
        code: `
import { useMemo } from 'react';
import { type LoaderFunctionArgs, useLoaderData, useSearchParams } from 'react-router';
import {
  DataTable,
  DataTableFilter,
  useDataTableFilters,
  useFilterSync,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from './data-table-stories.helpers';

// --- Data Fetch Handler ---
const handleDataFetch = async ({ request }: LoaderFunctionArgs): Promise<DataResponse> => {
  const url = new URL(request.url);
  const params = url.searchParams;

  // Parse pagination, sorting, and filters from URL
  const page = dataTableRouterParsers.page.parse(params.get('page')) ?? 0;
  const pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize')) ?? 10;
  const sortField = params.get('sortField');
  const sortOrder = (params.get('sortOrder') || 'asc') as 'asc' | 'desc';
  const filtersParam = params.get('filters');

  // Parse filters
  let parsedFilters = [];
  try {
    if (filtersParam) {
      parsedFilters = filtersArraySchema.parse(JSON.parse(filtersParam));
    }
  } catch (error) {
    console.error('Filter parsing error:', error);
  }

  // Apply filtering, sorting, pagination to data
  let processedData = [...mockDatabase];
  
  // Apply filters, sorting, and pagination logic here...
  
  return {
    data: paginatedData,
    meta: { total, page, pageSize, pageCount },
    facetedCounts,
  };
};

function DataTableWithBazzaFilters() {
  const loaderData = useLoaderData<DataResponse>();
  const [searchParams, setSearchParams] = useSearchParams();

  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;
  const facetedCounts = loaderData?.facetedCounts ?? {};

  // --- Bazza UI Filter Setup ---
  const [filters, setFilters] = useFilterSync();

  // Read pagination and sorting from URL
  const pageIndex = Number.parseInt(searchParams.get('page') ?? '0', 10);
  const pageSize = Number.parseInt(searchParams.get('pageSize') ?? '10', 10);
  const sortField = searchParams.get('sortField');
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

  const pagination = { pageIndex, pageSize };
  const sorting = sortField ? [{ id: sortField, desc: sortOrder === 'desc' }] : [];

  // Event handlers update URL directly
  const handlePaginationChange = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
    searchParams.set('page', next.pageIndex.toString());
    searchParams.set('pageSize', next.pageSize.toString());
    setSearchParams(searchParams);
  };

  const handleSortingChange = (updaterOrValue) => {
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    if (next.length > 0) {
      searchParams.set('sortField', next[0].id);
      searchParams.set('sortOrder', next[0].desc ? 'desc' : 'asc');
    } else {
      searchParams.delete('sortField');
      searchParams.delete('sortOrder');
    }
    setSearchParams(searchParams);
  };

  // Setup filter actions and strategy
  const {
    columns: filterColumns,
    actions,
    strategy,
  } = useDataTableFilters({
    columnsConfig: bazzaProcessedColumns,
    filters,
    onFiltersChange: setFilters,
    faceted: facetedOptionCounts,
    strategy: 'server',
    data,
  });

  // TanStack Table Setup
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, sorting },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-4">
      {/* Bazza UI Filter Interface */}
      <DataTableFilter columns={filterColumns} filters={filters} actions={actions} strategy={strategy} />

      {/* Data Table */}
      <DataTable table={table} columns={columns.length} pageCount={pageCount} />
    </div>
  );
}`,
      },
    },
  },
  render: () => <DataTableWithBazzaFilters />,
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DataTableWithBazzaFilters,
          loader: handleDataFetch,
        },
      ],
    }),
  ],
  play: async (context) => {
    // Run the tests in sequence
    await testInitialRenderServerSide(context);
    await testPaginationServerSide(context);
    await testFiltering(context);
  },
};
