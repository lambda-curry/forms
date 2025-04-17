import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';
import { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Define the data schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'editor']),
  status: z.enum(['active', 'inactive', 'pending']),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof userSchema>;

// Sample data
const users: User[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'user' : 'editor',
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// Define response type
interface DataResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
}

// Define the columns
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
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
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
  },
];

// Component to display the data table with router form integration
function DataTableRouterFormExample() {
  const loaderData = useLoaderData<DataResponse>();
  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users Table (React Router Form Integration)</h1>
      <p className="mb-4">This example demonstrates integration with React Router forms, including:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Form-based filtering with automatic submission</li>
        <li>Loading state while waiting for data</li>
        <li>Server-side filtering and pagination</li>
        <li>URL-based state management with React Router</li>
      </ul>
      <DataTableRouterForm<User, keyof User>
        columns={columns}
        data={data}
        pageCount={pageCount}
        filterableColumns={[
          {
            id: 'role' as keyof User,
            title: 'Role',
            options: [
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Editor', value: 'editor' },
            ],
          },
          {
            id: 'status' as keyof User,
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Pending', value: 'pending' },
            ],
          },
        ]}
        searchableColumns={[
          {
            id: 'name' as keyof User,
            title: 'Name',
          },
        ]}
      />
    </div>
  );
}

// Loader function to handle data fetching based on URL parameters
const handleDataFetch = async ({ request }: LoaderFunctionArgs) => {
  // Add a small delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const url = request.url ? new URL(request.url) : new URL('http://localhost');
  const params = url.searchParams;

  // Use our custom parsers to parse URL search parameters
  const page = dataTableRouterParsers.page.parse(params.get('page'));
  const pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize'));
  const sortField = dataTableRouterParsers.sortField.parse(params.get('sortField'));
  const sortOrder = dataTableRouterParsers.sortOrder.parse(params.get('sortOrder'));
  const search = dataTableRouterParsers.search.parse(params.get('search'));
  const parsedFilters = dataTableRouterParsers.filters.parse(params.get('filters'));

  // Apply filters
  let filteredData = [...users];

  // 1. Apply global search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (user) => user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
    );
  }

  // 2. Apply faceted filters from the parsed 'filters' array
  if (parsedFilters && parsedFilters.length > 0) {
    // Check if parsedFilters is not null
    parsedFilters.forEach((filter) => {
      if (filter.id in users[0] && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[];
        filteredData = filteredData.filter((user) => {
          const userValue = user[filter.id as keyof User];
          return filterValues.includes(userValue);
        });
      } else {
        console.warn(`Invalid filter encountered: ${JSON.stringify(filter)}`);
      }
    });
  }

  // 3. Apply sorting
  if (sortField && sortOrder && sortField in users[0]) {
    filteredData.sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 4. Apply pagination
  // Provide defaults again for TS, although parsers guarantee numbers
  const safePage = page ?? 0;
  const safePageSize = pageSize ?? 10;
  const start = safePage * safePageSize;
  const paginatedData = filteredData.slice(start, start + safePageSize);

  // Log the data being returned for debugging
  console.log(`Returning ${paginatedData.length} items, page ${safePage}, total ${filteredData.length}`);

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

const meta = {
  title: 'RemixHookForm/Data Table',
  component: DataTableRouterForm,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DataTableRouterFormExample,
          loader: handleDataFetch,
        },
      ],
    }),
  ],
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  args: {} as any,
  render: () => <DataTableRouterFormExample />,
  parameters: {
    docs: {
      description: {
        story: 'This is a description of the DataTableRouterForm component.',
      },
    },
  },
};
