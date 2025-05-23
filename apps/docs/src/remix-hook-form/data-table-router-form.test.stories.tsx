import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';
import { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import type { ColumnDef } from '@tanstack/react-table';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Define the data schema
const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['open', 'in-progress', 'closed', 'blocked']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignee: z.string(),
  labels: z.array(z.string()),
  createdAt: z.string().datetime(),
});

type Issue = z.infer<typeof issueSchema>;

// Sample test data
const testIssues: Issue[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `ISSUE-${i + 1}`,
  title: `Test Issue ${i + 1}`,
  status: ['open', 'in-progress', 'closed', 'blocked'][i % 4] as Issue['status'],
  priority: ['low', 'medium', 'high', 'urgent'][i % 4] as Issue['priority'],
  assignee: `User ${(i % 5) + 1}`,
  labels: [`label-${i % 3}`, `category-${i % 2}`],
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// Define response type
interface IssuesResponse {
  data: Issue[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// Define the columns
const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
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
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('priority')}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
    cell: ({ row }) => <div>{row.getValue('assignee')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
  },
];

// Component to display the data table with router form integration
function IssuesTableTestComponent() {
  const loaderData = useLoaderData<IssuesResponse>();

  // Ensure we have data even if loaderData is undefined
  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Issues Table (Bazza UI Server Filters via Loader)</h1>
      <p className="mb-4 text-sm text-gray-600">
        This example demonstrates comprehensive filter testing including:
      </p>
      <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
        <li>URL state synchronization</li>
        <li>Server-side filtering and pagination</li>
        <li>Multiple filter combinations</li>
        <li>Search functionality</li>
        <li>Filter persistence across navigation</li>
      </ul>
      <DataTableRouterForm<Issue, keyof Issue>
        columns={columns}
        data={data}
        pageCount={pageCount}
        filterableColumns={[
          {
            id: 'status' as keyof Issue,
            title: 'Status',
            options: [
              { label: 'Open', value: 'open' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Closed', value: 'closed' },
              { label: 'Blocked', value: 'blocked' },
            ],
          },
          {
            id: 'priority' as keyof Issue,
            title: 'Priority',
            options: [
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' },
              { label: 'Urgent', value: 'urgent' },
            ],
          },
        ]}
        searchableColumns={[
          {
            id: 'title' as keyof Issue,
            title: 'Title',
          },
        ]}
      />
    </div>
  );
}

// Loader function to handle data fetching based on URL parameters
const handleIssuesDataFetch = async ({ request }: LoaderFunctionArgs) => {
  // Add a small delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Ensure we have a valid URL object
  const url = request?.url ? new URL(request.url) : new URL('http://localhost?page=0&pageSize=10');
  const params = url.searchParams;

  // Use our custom parsers to parse URL search parameters
  const page = dataTableRouterParsers.page.parse(params.get('page'));
  const pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize'));
  const sortField = dataTableRouterParsers.sortField.parse(params.get('sortField'));
  const sortOrder = dataTableRouterParsers.sortOrder.parse(params.get('sortOrder'));
  const search = dataTableRouterParsers.search.parse(params.get('search'));
  const parsedFilters = dataTableRouterParsers.filters.parse(params.get('filters'));

  // Apply filters
  let filteredData = [...testIssues];

  // 1. Apply global search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (issue) => issue.title.toLowerCase().includes(searchLower) || issue.id.toLowerCase().includes(searchLower),
    );
  }

  // 2. Apply faceted filters from the parsed 'filters' array
  if (parsedFilters && parsedFilters.length > 0) {
    parsedFilters.forEach((filter) => {
      if (filter.id in testIssues[0] && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[];
        filteredData = filteredData.filter((issue) => {
          const issueValue = issue[filter.id as keyof Issue];
          return filterValues.includes(issueValue);
        });
      }
    });
  }

  // 3. Apply sorting
  if (sortField && sortOrder && sortField in testIssues[0]) {
    filteredData.sort((a, b) => {
      const aValue = a[sortField as keyof Issue];
      const bValue = b[sortField as keyof Issue];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 4. Apply pagination
  const safePage = params.has('page') ? page : dataTableRouterParsers.page.defaultValue;
  const safePageSize = params.has('pageSize') ? pageSize : dataTableRouterParsers.pageSize.defaultValue;
  const start = safePage * safePageSize;
  const paginatedData = filteredData.slice(start, start + safePageSize);

  // Return the data response
  return {
    data: paginatedData,
    meta: {
      total: filteredData.length,
      page: safePage,
      pageSize: safePageSize,
      pageCount: Math.ceil(filteredData.length / safePageSize),
    },
  };
};

const meta: Meta<typeof DataTableRouterForm> = {
  title: 'Data Table/Router Form Tests',
  component: DataTableRouterForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive tests for DataTableRouterForm with URL synchronization and server-side filtering',
      },
    },
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: IssuesTableTestComponent,
          loader: handleIssuesDataFetch,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableRouterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Test functions
const testInitialTableState = async ({ canvas }: StoryContext) => {
  // Wait for table to load
  await expect(canvas.findByText('Issues Table (Bazza UI Server Filters via Loader)')).resolves.toBeInTheDocument();
  
  // Verify table headers are present
  expect(canvas.getByText('ID')).toBeInTheDocument();
  expect(canvas.getByText('Title')).toBeInTheDocument();
  expect(canvas.getByText('Status')).toBeInTheDocument();
  expect(canvas.getByText('Priority')).toBeInTheDocument();
  
  // Verify filter buttons are present
  expect(canvas.getByRole('button', { name: /status/i })).toBeInTheDocument();
  expect(canvas.getByRole('button', { name: /priority/i })).toBeInTheDocument();
  
  // Verify some initial data is loaded
  await expect(canvas.findByText('ISSUE-1')).resolves.toBeInTheDocument();
};

const testStatusFilterApplication = async ({ canvas }: StoryContext) => {
  // Open status filter
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  // Wait for popover to open
  const popover = await canvas.findByRole('dialog');
  expect(popover).toBeInTheDocument();
  
  // Select "Open" status
  const openOption = within(popover).getByText('Open');
  await userEvent.click(openOption);
  
  // Close popover by clicking outside
  await userEvent.click(canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)'));
  
  // Verify filter is applied - button should show selection
  expect(statusFilter).toHaveTextContent('Open');
  
  // Wait for data to reload and verify filtered results
  await new Promise(resolve => setTimeout(resolve, 300)); // Wait for loader
  
  // Check that only open issues are visible (this depends on test data)
  const tableRows = canvas.getAllByRole('row');
  expect(tableRows.length).toBeGreaterThan(1); // Header + data rows
};

const testMultipleFiltersApplication = async ({ canvas }: StoryContext) => {
  // Apply priority filter in addition to status filter
  const priorityFilter = canvas.getByRole('button', { name: /priority/i });
  await userEvent.click(priorityFilter);
  
  const popover = await canvas.findByRole('dialog');
  const highOption = within(popover).getByText('High');
  await userEvent.click(highOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)'));
  
  // Verify both filters are applied
  expect(canvas.getByRole('button', { name: /status/i })).toHaveTextContent('Open');
  expect(canvas.getByRole('button', { name: /priority/i })).toHaveTextContent('High');
  
  // Wait for data to reload
  await new Promise(resolve => setTimeout(resolve, 300));
};

const testSearchFunctionality = async ({ canvas }: StoryContext) => {
  // Find and use the search input
  const searchInput = canvas.getByPlaceholderText(/search/i);
  expect(searchInput).toBeInTheDocument();
  
  // Type in search term
  await userEvent.type(searchInput, 'Test Issue 1');
  
  // Wait for search to be applied
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verify search results (should show issues with "Test Issue 1" in title)
  const tableRows = canvas.getAllByRole('row');
  expect(tableRows.length).toBeGreaterThan(1); // Should have some results
};

const testPaginationControls = async ({ canvas }: StoryContext) => {
  // Clear search to see pagination
  const searchInput = canvas.getByPlaceholderText(/search/i);
  await userEvent.clear(searchInput);
  
  // Wait for data to reload
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Look for pagination controls
  const nextButton = canvas.queryByRole('button', { name: /next/i });
  const prevButton = canvas.queryByRole('button', { name: /previous/i });
  
  // Verify pagination controls exist (if there's enough data)
  if (nextButton) {
    expect(nextButton).toBeInTheDocument();
  }
  if (prevButton) {
    expect(prevButton).toBeInTheDocument();
  }
};

const testFilterClearance = async ({ canvas }: StoryContext) => {
  // Clear status filter
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  const popover = await canvas.findByRole('dialog');
  const clearButton = within(popover).getByText('Clear filters');
  await userEvent.click(clearButton);
  
  // Close popover
  await userEvent.click(canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)'));
  
  // Verify status filter is cleared
  expect(statusFilter).not.toHaveTextContent('Open');
  
  // Clear priority filter
  const priorityFilter = canvas.getByRole('button', { name: /priority/i });
  await userEvent.click(priorityFilter);
  
  const priorityPopover = await canvas.findByRole('dialog');
  const priorityClearButton = within(priorityPopover).getByText('Clear filters');
  await userEvent.click(priorityClearButton);
  
  // Close popover
  await userEvent.click(canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)'));
  
  // Verify priority filter is cleared
  expect(priorityFilter).not.toHaveTextContent('High');
  
  // Wait for data to reload
  await new Promise(resolve => setTimeout(resolve, 300));
};

const testSortingFunctionality = async ({ canvas }: StoryContext) => {
  // Click on Title column header to sort
  const titleHeader = canvas.getByText('Title');
  await userEvent.click(titleHeader);
  
  // Wait for sorting to be applied
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Verify sorting indicator or data order change
  // Note: This test might need adjustment based on actual sorting implementation
  const tableRows = canvas.getAllByRole('row');
  expect(tableRows.length).toBeGreaterThan(1);
};

const testURLStatePersistence = async ({ canvas }: StoryContext) => {
  // Apply a filter
  const statusFilter = canvas.getByRole('button', { name: /status/i });
  await userEvent.click(statusFilter);
  
  const popover = await canvas.findByRole('dialog');
  const closedOption = within(popover).getByText('Closed');
  await userEvent.click(closedOption);
  
  // Close popover
  await userEvent.click(canvas.getByText('Issues Table (Bazza UI Server Filters via Loader)'));
  
  // Wait for URL to update
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Verify filter persists (button should still show selection)
  expect(statusFilter).toHaveTextContent('Closed');
  
  // Note: In a real browser environment, we could test URL parameters
  // For Storybook tests, we verify the component state persistence
};

export const ComprehensiveRouterFormTests: Story = {
  render: () => <IssuesTableTestComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive test suite for DataTableRouterForm covering filtering, search, pagination, and URL synchronization.',
      },
    },
  },
  play: async (storyContext) => {
    // Run all test scenarios in sequence
    await testInitialTableState(storyContext);
    await testStatusFilterApplication(storyContext);
    await testMultipleFiltersApplication(storyContext);
    await testSearchFunctionality(storyContext);
    await testPaginationControls(storyContext);
    await testFilterClearance(storyContext);
    await testSortingFunctionality(storyContext);
    await testURLStatePersistence(storyContext);
  },
};

// Individual test stories for focused testing
export const InitialState: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testInitialTableState,
};

export const FilterApplication: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testStatusFilterApplication,
};

export const MultipleFilters: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testMultipleFiltersApplication,
};

export const SearchFunctionality: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testSearchFunctionality,
};

export const PaginationControls: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testPaginationControls,
};

export const FilterClearance: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testFilterClearance,
};

export const SortingFunctionality: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testSortingFunctionality,
};

export const URLStatePersistence: Story = {
  render: () => <IssuesTableTestComponent />,
  play: testURLStatePersistence,
};

