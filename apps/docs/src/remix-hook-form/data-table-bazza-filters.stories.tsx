// --- NEW IMPORTS for Router Form data handling ---
import { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers'; // Use parsers
// --- Corrected Hook Import Paths ---
import { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter'; // Use the barrel file export
// --- NEW IMPORTS for Bazza UI Filters ---
import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters'; // Assuming path
import { DataTable } from '@lambdacurry/forms/ui/data-table/data-table';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
// Import the filters schema and types from the new location
import type { Filter, FiltersState } from '@lambdacurry/forms/ui/utils/filters'; // Assuming path alias
import { filtersArraySchema } from '@lambdacurry/forms/ui/utils/filters'; // Assuming path alias
// --- Re-add useDataTableFilters import ---
import { useDataTableFilters } from '@lambdacurry/forms/ui/utils/use-data-table-filters';
import { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync'; // Ensure this is the correct path for filter sync
// Add icon imports
import { CalendarIcon, CheckCircledIcon, PersonIcon, StarIcon, TextIcon } from '@radix-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react'; // FIX: Add Meta, StoryObj
import type { ColumnDef, PaginationState, SortingState } from '@tanstack/react-table'; // Added PaginationState, SortingState
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react'; // Added useState, useEffect
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
  },
  {
    id: 'TASK-2',
    title: 'Add dark mode',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-01-20'),
  },
  {
    id: 'TASK-3',
    title: 'Improve dashboard performance',
    status: 'in progress',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-02-01'),
  },
  {
    id: 'TASK-4',
    title: 'Update documentation',
    status: 'done',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-02-10'),
  },
  {
    id: 'TASK-5',
    title: 'Refactor auth module',
    status: 'backlog',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-02-15'),
  },
  {
    id: 'TASK-6',
    title: 'Implement user profile page',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'medium',
    createdDate: new Date('2024-03-01'),
  },
  {
    id: 'TASK-7',
    title: 'Design new landing page',
    status: 'todo',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-03-05'),
  },
  {
    id: 'TASK-8',
    title: 'Write API integration tests',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-03-10'),
  },
  {
    id: 'TASK-9',
    title: 'Deploy to staging environment',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-03-15'),
  },
  {
    id: 'TASK-10',
    title: 'User feedback session',
    status: 'done',
    assignee: 'Alice',
    priority: 'low',
    createdDate: new Date('2024-03-20'),
  },
  {
    id: 'TASK-11',
    title: 'Fix critical bug in payment module',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'high',
    createdDate: new Date('2024-03-22'),
  },
  {
    id: 'TASK-12',
    title: 'Update third-party libraries',
    status: 'backlog',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-03-25'),
  },
  {
    id: 'TASK-13',
    title: 'Onboard new developer',
    status: 'done',
    assignee: 'Alice',
    priority: 'medium',
    createdDate: new Date('2024-04-01'),
  },
  {
    id: 'TASK-14',
    title: 'Research new caching strategy',
    status: 'todo',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-04-05'),
  },
  {
    id: 'TASK-15',
    title: 'Accessibility audit',
    status: 'in progress',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-04-10'),
  },
  // --- END ADDED DATA ---
];

// --- Helper Functions (copied from deleted API route) ---
// Function to apply filters to the mock data
function applyFilters(data: MockIssue[], filters: FiltersState): MockIssue[] {
  if (filters.length === 0) return data;
  return data.filter((item) => {
    return filters.every((filter: Filter) => {
      const itemValue = item[filter.columnId as keyof MockIssue];
      // Ensure filter.values exists and is an array before accessing
      const filterValues = Array.isArray(filter.values) ? filter.values : [];

      switch (filter.operator) {
        // --- FIX: Remove 'is' case as loader now converts it ---
        // case 'is': // Removed
        case 'is any of':
          return filterValues.includes(itemValue as string | number | boolean | null);
        case 'is none of':
          return !filterValues.includes(itemValue as string | number | boolean | null);
        case 'contains':
          return (
            typeof itemValue === 'string' &&
            typeof filterValues[0] === 'string' &&
            itemValue.toLowerCase().includes(filterValues[0].toLowerCase())
          );
        case 'does not contain':
          return (
            typeof itemValue === 'string' &&
            typeof filterValues[0] === 'string' &&
            !itemValue.toLowerCase().includes(filterValues[0].toLowerCase())
          );
        default:
          // Log unexpected operators if they occur
          console.warn(`applyFilters: Unknown operator '${filter.operator}' encountered.`);
          return true;
      }
    });
  });
}

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
];

// --- FIX: Extract defined options for faceted counting ---
const allDefinedOptions: Record<keyof MockIssue, { value: string; label: string }[] | undefined> = {
  id: undefined,
  title: undefined,
  status: columnConfigs.find((c) => c.id === 'status')?.options,
  assignee: columnConfigs.find((c) => c.id === 'assignee')?.options,
  priority: columnConfigs.find((c) => c.id === 'priority')?.options,
  createdDate: undefined,
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
];
// --- END Column Definitions ---

// --- NEW Wrapper Component using Loader Data ---
function DataTableWithBazzaFilters() {
  const loaderData = useLoaderData<DataResponse>();
  const navigate = useNavigate();
  const location = useLocation(); // Get location for reading initial params

  // Extract data and meta from loader, provide defaults
  const data = useMemo(() => loaderData?.data ?? [], [loaderData?.data]);
  const pageCount = useMemo(() => loaderData?.meta.pageCount ?? 0, [loaderData?.meta.pageCount]);

  // NEW: Convert to Map of Maps
  const facetedCounts = useMemo(() => {
    const rawCounts = loaderData?.facetedCounts ?? {};
    const mapOfMaps = new Map<string, Map<string, number>>();
    for (const columnId in rawCounts) {
      const innerObject = rawCounts[columnId as keyof typeof rawCounts];
      const innerMap = new Map<string, number>();
      if (innerObject) {
        // Check if innerObject is not undefined
        for (const optionValue in innerObject) {
          innerMap.set(optionValue, innerObject[optionValue as keyof typeof innerObject]);
        }
      }
      mapOfMaps.set(columnId, innerMap);
    }
    return mapOfMaps;
  }, [loaderData?.facetedCounts]);

  // Use filter sync hook (this manages filters in the URL)
  const [filters, setFilters] = useFilterSync();

  // --- REVISED PAGINATION STATE MANAGEMENT ---
  // Define defaults for pagination
  const defaultPageIndex = dataTableRouterParsers.page.defaultValue;
  const defaultPageSize = dataTableRouterParsers.pageSize.defaultValue;

  // Get current pagination values from URL (via loaderData) or use defaults
  const currentPageIndexFromUrl = loaderData?.meta.page ?? defaultPageIndex;
  const currentPageSizeFromUrl = loaderData?.meta.pageSize ?? defaultPageSize;

  // Manage local pagination and sorting state
  // Initialize from URL-derived values
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPageIndexFromUrl,
    pageSize: currentPageSizeFromUrl,
  });

  // Initialize sorting state from URL params if they exist
  const [sorting, setSorting] = useState<SortingState>(() => {
    const params = new URLSearchParams(location.search);
    const sortField = params.get('sortField');
    const sortDesc = params.get('sortDesc') === 'true';
    return sortField ? [{ id: sortField, desc: sortDesc }] : [];
  });

  // Effect to synchronize pagination and sorting state FROM URL/loaderData if it changes
  useEffect(() => {
    const newPageIndex = loaderData?.meta.page ?? defaultPageIndex;
    const newPageSize = loaderData?.meta.pageSize ?? defaultPageSize;

    if (pagination.pageIndex !== newPageIndex || pagination.pageSize !== newPageSize) {
      setPagination({ pageIndex: newPageIndex, pageSize: newPageSize });
    }

    const params = new URLSearchParams(location.search);
    const sortFieldFromUrl = params.get('sortField');
    const sortDescFromUrl = params.get('sortDesc') === 'true';

    const currentSorting = sorting.length > 0 ? sorting[0] : null;
    const urlHasSorting = !!sortFieldFromUrl;

    if (urlHasSorting) {
      // Ensure sortFieldFromUrl is not null before using it with !
      if (
        sortFieldFromUrl &&
        (!currentSorting || currentSorting.id !== sortFieldFromUrl || currentSorting.desc !== sortDescFromUrl)
      ) {
        setSorting([{ id: sortFieldFromUrl, desc: sortDescFromUrl }]);
      }
    } else if (currentSorting) {
      setSorting([]);
    }
  }, [loaderData, location.search, pagination, sorting, defaultPageIndex, defaultPageSize]);

  // Handlers for pagination and sorting changes that navigate
  const handlePaginationChange = (updater: ((prevState: PaginationState) => PaginationState) | PaginationState) => {
    const newState = typeof updater === 'function' ? updater(pagination) : updater;
    const params = new URLSearchParams(location.search); // Preserve existing params like filters
    params.set('page', String(newState.pageIndex));
    params.set('pageSize', String(newState.pageSize));
    // Sorting is not changed by pagination, so it's already in location.search or not
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleSortingChange = (updater: ((prevState: SortingState) => SortingState) | SortingState) => {
    const newState = typeof updater === 'function' ? updater(sorting) : updater;
    const params = new URLSearchParams(location.search); // Preserve existing params

    if (newState.length > 0) {
      params.set('sortField', newState[0].id);
      params.set('sortDesc', String(newState[0].desc));
    } else {
      params.delete('sortField');
      params.delete('sortDesc');
    }
    // Optionally reset page to 0 on sort change
    // params.set('page', '0');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Use Bazza UI hook (strategy: 'server' means it expects externally filtered/faceted data)
  const {
    columns: bazzaProcessedColumns, // These columns have filter components integrated
    actions,
    strategy,
  } = useDataTableFilters<MockIssue, typeof columnConfigs, 'server'>({
    strategy: 'server',
    columnsConfig: columnConfigs, // Pass the configurations
    data: data, // Pass the data from the loader
    faceted: facetedCounts, // Pass faceted counts from loader
    filters: filters, // Pass current filters from useFilterSync
    onFiltersChange: setFilters, // Pass setter from useFilterSync
  });

  // Setup TanStack Table instance
  const table = useReactTable({
    data,
    columns: columns, // <-- FIX: Use original columns for cell rendering
    state: {
      pagination, // Controlled by local state, which is synced from URL
      sorting, // Controlled by local state, which is synced from URL
      // columnFilters are implicitly handled by the loader via the 'filters' state
    },
    pageCount: pageCount, // Total pages from loader meta
    onPaginationChange: handlePaginationChange, // Use new handler
    onSortingChange: handleSortingChange, // Use new handler
    manualPagination: true, // Pagination is handled by the loader
    manualFiltering: true, // Filtering is handled by the loader (triggered by filters state)
    manualSorting: true, // Sorting is handled by the loader
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Keep for potential features
    getPaginationRowModel: getPaginationRowModel(), // Keep for potential features
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Server Filters via Loader)</h1>
      <p className="mb-4">This example demonstrates server-driven filtering using Bazza UI and React Router Loader:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Filter state managed by Bazza UI filters component and synced to URL.</li>
        <li>Pagination and sorting state managed locally, synced to URL via `useEffect`.</li>
        <li>Data fetched via `loader` based on URL parameters (filters, pagination, sorting).</li>
        <li>Server provides filtered/paginated/sorted data and faceted counts.</li>
      </ul>

      {/* Render Bazza UI Filters - Pass Bazza's processed columns */}
      <DataTableFilter columns={bazzaProcessedColumns} filters={filters} actions={actions} strategy={strategy} />
      {/* Pass table instance (which now uses original columns for rendering) */}
      <DataTable className="mt-4" table={table} columns={columns.length} pagination />
    </div>
  );
}
// --- END Wrapper Component ---

// Define a type for the raw filter structure before Zod validation
interface RawFilter {
  columnId: string;
  operator: string; // Expecting string initially
  values?: unknown[]; // Values can be anything before validation
}

// Updated Loader function to return fake data matching DataResponse structure
const handleDataFetch = async ({ request }: LoaderFunctionArgs): Promise<DataResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate latency

  const url = new URL(request.url);
  const params = url.searchParams;

  // Parse pagination, sorting, and filters from URL using helpers/schemas
  const page = dataTableRouterParsers.page.parse(params.get('page'));
  let pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize'));
  const sortField = params.get('sortField'); // Get raw string or null
  const sortDesc = params.get('sortDesc') === 'true'; // Convert to boolean
  const filtersParam = params.get('filters');

  // --- FIX: Ensure a valid default pageSize ---
  if (!pageSize || pageSize <= 0) {
    console.log(`[Loader] - Invalid or missing pageSize (${pageSize}), defaulting to 10.`);
    pageSize = 10; // Set a sensible default
  }
  // --- END FIX ---

  let parsedFilters: FiltersState = [];
  try {
    if (filtersParam) {
      // --- FIX: Pre-process filters before Zod validation ---
      const rawJson: unknown = JSON.parse(filtersParam);
      let processedFilters: unknown[] = []; // Initialize array for processed filters

      if (Array.isArray(rawJson)) {
        // Use the RawFilter type and perform mapping
        processedFilters = rawJson.map((filter): RawFilter | unknown => {
          // Basic check if it's an object with expected properties
          if (typeof filter === 'object' && filter !== null && 'operator' in filter && 'columnId' in filter) {
            const typedFilter = filter as RawFilter;
            // Replace 'is' with 'is any of'
            if (typedFilter.operator === 'is') {
              return { ...typedFilter, operator: 'is any of' };
            }
            return typedFilter; // Return potentially typed filter
          }
          return filter; // Return unchanged if not matching structure
        });
      }
      // Now validate the potentially modified filters
      parsedFilters = filtersArraySchema.parse(processedFilters);
      // --- END FIX ---
    } else {
      // No filters provided
    }
  } catch (error) {
    console.error('[Loader] - Filter parsing/processing error:', error);
    parsedFilters = []; // Reset filters on error
  }

  // --- Apply filtering, sorting, pagination ---
  let processedData = [...mockDatabase];

  // 1. Apply filters
  processedData = applyFilters(processedData, parsedFilters);

  // 2. Apply sorting
  if (sortField && sortField in mockDatabase[0]) {
    processedData.sort((a, b) => {
      const aValue = a[sortField as keyof MockIssue];
      const bValue = b[sortField as keyof MockIssue];
      // Basic comparison, adjust for specific types if needed (e.g., dates)
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      return sortDesc ? comparison * -1 : comparison;
    });
  } else {
    // No sort
  }

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize); // Now pageSize is guaranteed > 0

  // 3. Apply pagination
  const start = page * pageSize;
  const paginatedData = processedData.slice(start, start + pageSize);

  // Calculate faceted counts based on the *original* database
  // --- FIX: Pass allDefinedOptions to calculateFacetedCounts ---
  const facetedColumns: Array<keyof MockIssue> = ['status', 'assignee', 'priority'];
  const facetedCounts = calculateFacetedCounts(mockDatabase, facetedColumns, allDefinedOptions);

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

const meta = {
  title: 'Data Table/Bazza UI Filters',
  component: DataTableWithBazzaFilters,
  parameters: {
    layout: 'fullscreen',
  },
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
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableWithBazzaFilters>;

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
    },
  },
};
