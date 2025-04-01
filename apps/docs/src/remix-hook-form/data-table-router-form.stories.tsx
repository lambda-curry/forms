import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import { DataTableRouterForm } from '@lambdacurry/forms/ui/data-table/data-table-router-form';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
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
const DataTableRouterFormExample = () => {
  const [data, setData] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const loaderData = useLoaderData<DataResponse>();

  // Update state when loader data changes
  useEffect(() => {
    if (loaderData) {
      setData(loaderData.data);
      setPageCount(loaderData.meta.pageCount);
    }
  }, [loaderData]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users Table (React Router Form Integration)</h1>
      <p className="mb-4">This example demonstrates integration with React Router forms, including:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Form-based filtering with automatic submission</li>
        <li>Loading state while waiting for data</li>
        <li>Server-side filtering and pagination</li>
        <li>URL-based state management</li>
      </ul>
      <DataTableRouterForm
        columns={columns}
        data={data}
        pageCount={pageCount}
        formAction="/"
        formMethod="post"
        defaultSort={{ id: 'name', desc: false }}
        filterableColumns={[
          {
            id: 'role',
            title: 'Role',
            options: [
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Editor', value: 'editor' },
            ],
          },
          {
            id: 'status',
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
            id: 'name',
            title: 'Name',
          },
        ]}
      />
    </div>
  );
};

const meta: Meta<typeof DataTableRouterForm> = {
  title: 'UI/DataTableRouterForm',
  component: DataTableRouterForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTableRouterFormExample />,
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/',
          Component: DataTableRouterFormExample,
          loader: async ({ request }: { request: Request }) => {
            // Simulate server delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            // For initial load without URL params, create a base URL
            const url = request.url ? new URL(request.url) : new URL('http://localhost');

            // Set default values if not provided
            const page = Number.parseInt(url.searchParams.get('page') || '0');
            const pageSize = Number.parseInt(url.searchParams.get('pageSize') || '10');
            const sortField = url.searchParams.get('sortField') || 'name';
            const sortOrder = url.searchParams.get('sortOrder') || 'asc';
            const roleFilter = url.searchParams.getAll('role');
            const statusFilter = url.searchParams.getAll('status');
            const search = url.searchParams.get('search');

            // Apply filters
            let filteredData = [...users];

            if (roleFilter.length > 0) {
              filteredData = filteredData.filter((user) => roleFilter.includes(user.role));
            }

            if (statusFilter.length > 0) {
              filteredData = filteredData.filter((user) => statusFilter.includes(user.status));
            }

            if (search) {
              const searchLower = search.toLowerCase();
              filteredData = filteredData.filter(
                (user) =>
                  user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
              );
            }

            // Apply sorting
            if (sortField && sortOrder) {
              filteredData.sort((a, b) => {
                const aValue = a[sortField as keyof User];
                const bValue = b[sortField as keyof User];

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
              });
            }

            // Apply pagination
            const start = page * pageSize;
            const paginatedData = filteredData.slice(start, start + pageSize);

            return {
              data: paginatedData,
              meta: {
                total: filteredData.length,
                page,
                pageSize,
                pageCount: Math.ceil(filteredData.length / pageSize),
              },
            };
          },
          action: async ({ request }: { request: Request }) => {
            // Simulate server delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const formData = await request.formData();
            const page = Number.parseInt(formData.get('page')?.toString() || '0');
            const pageSize = Number.parseInt(formData.get('pageSize')?.toString() || '10');
            const sortField = formData.get('sortField')?.toString() || 'name';
            const sortOrder = formData.get('sortOrder')?.toString() || 'asc';
            const roleFilter = formData.getAll('role').map((val: FormDataEntryValue) => val.toString());
            const statusFilter = formData.getAll('status').map((val: FormDataEntryValue) => val.toString());
            const search = formData.get('search')?.toString();

            // Apply filters
            let filteredData = [...users];

            if (roleFilter.length > 0) {
              filteredData = filteredData.filter((user) => roleFilter.includes(user.role));
            }

            if (statusFilter.length > 0) {
              filteredData = filteredData.filter((user) => statusFilter.includes(user.status));
            }

            if (search) {
              const searchLower = search.toLowerCase();
              filteredData = filteredData.filter(
                (user) =>
                  user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
              );
            }

            // Apply sorting
            if (sortField && sortOrder) {
              filteredData.sort((a, b) => {
                const aValue = a[sortField as keyof User];
                const bValue = b[sortField as keyof User];

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
                return 0;
              });
            }

            // Apply pagination
            const start = page * pageSize;
            const paginatedData = filteredData.slice(start, start + pageSize);

            return {
              data: paginatedData,
              meta: {
                total: filteredData.length,
                page,
                pageSize,
                pageCount: Math.ceil(filteredData.length / pageSize),
              },
            };
          },
        },
      ],
    }),
  ],
};
