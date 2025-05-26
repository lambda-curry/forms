import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { columnConfigs, columns } from './data-table-stories.components';
import {
  DataTable,
  DataTableFilter,
  type MockIssue,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  mockDatabase,
  useDataTableFilters,
  useFilterSync,
  useReactTable,
  withReactRouterStubDecorator,
} from './data-table-stories.helpers';
import { testFiltering, testInitialRender, testPagination } from './data-table-stories.test-utils';

// --- Main Component ---
function DataTableWithClientSideFilters() {
  // --- Client-side data state ---
  const [data] = useState<MockIssue[]>(mockDatabase);

  // --- Bazza UI Filter Setup ---
  const [filters, setFilters] = useFilterSync();

  // --- Pagination and Sorting State ---
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  // --- Event Handlers ---
  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination(typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue);
  };

  // --- Wrapper for DataTable pagination handler ---
  const handleDataTablePagination = (pageIndex: number, pageSize: number) => {
    setPagination({ pageIndex, pageSize });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting(typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue);
  };

  // --- Bazza UI Filter Setup ---
  const bazzaProcessedColumns = useMemo(() => columnConfigs, []);

  // Define a filter strategy for client-side filtering
  const filterStrategy = 'client' as const;

  // Setup filter actions and strategy (controlled mode)
  const {
    columns: filterColumns,
    actions,
    strategy,
    data: filteredData,
  } = useDataTableFilters({
    columnsConfig: bazzaProcessedColumns,
    filters,
    onFiltersChange: setFilters,
    strategy: filterStrategy,
    data,
  });

  // --- TanStack Table Setup ---
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false, // Client-side pagination
    manualSorting: false, // Client-side sorting
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Client-Side Filters)</h1>
        <p className="text-gray-600 mb-6">
          This demonstrates client-side filtering using Bazza UI components and real-time filtering without server
          requests. All filtering happens in the browser for immediate response.
        </p>
      </div>

      {/* Bazza UI Filter Interface */}
      <DataTableFilter columns={filterColumns} filters={filters} actions={actions} strategy={strategy} />

      {/* Data Table */}
      <DataTable
        table={table}
        columns={columns.length}
        pagination={true}
        pageCount={table.getPageCount()}
        onPaginationChange={handleDataTablePagination}
      />
    </div>
  );
}

// --- Test Functions ---
const testInitialRenderClientSide = testInitialRender('Issues Table (Bazza UI Client-Side Filters)');
const testPaginationClientSide = testPagination({ serverSide: false });

// --- Story Configuration ---
const meta: Meta<typeof DataTableWithClientSideFilters> = {
  title: 'Data Table/Client Side Filters',
  component: DataTableWithClientSideFilters,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Client-side filtering with Bazza UI components and real-time filtering without server requests.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ClientSide: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates client-side filtering using Bazza UI components and real-time filtering without server requests. All filtering happens in the browser for immediate response.',
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DataTableWithClientSideFilters,
        },
      ],
    }),
  ],
  render: () => <DataTableWithClientSideFilters />,
  play: async (context) => {
    // Run the tests in sequence
    await testInitialRenderClientSide(context);
    await testPaginationClientSide(context);
    await testFiltering(context);
  },
};
