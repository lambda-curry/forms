import { DataTable } from '@lambdacurry/forms/ui/data-table';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import type { Meta, StoryObj } from '@storybook/react';
import { type ActionFunctionArgs } from 'react-router';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';
import { z } from 'zod';

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
const users: User[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'admin' : i % 3 === 1 ? 'user' : 'editor',
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
}));

// Define the columns
const columns = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue('role')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
    ),
  },
];

// Mock API handler for data fetching with filters and pagination
const handleDataFetch = async (request: Request) => {
  const url = new URL(request.url);
  
  // Get query parameters
  const page = parseInt(url.searchParams.get('page') || '0');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const sortField = url.searchParams.get('sortField');
  const sortOrder = url.searchParams.get('sortOrder');
  const roleFilter = url.searchParams.getAll('role');
  const statusFilter = url.searchParams.getAll('status');
  const search = url.searchParams.get('search');
  
  // Apply filters
  let filteredData = [...users];
  
  if (roleFilter.length > 0) {
    filteredData = filteredData.filter(user => roleFilter.includes(user.role));
  }
  
  if (statusFilter.length > 0) {
    filteredData = filteredData.filter(user => statusFilter.includes(user.status));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      user => 
        user.name.toLowerCase().includes(searchLower) || 
        user.email.toLowerCase().includes(searchLower)
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
    }
  };
};

// Component to display the data table
const DataTableExample = () => {
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={users}
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
          {
            id: 'email',
            title: 'Email',
          },
        ]}
      />
    </div>
  );
};

const meta: Meta<typeof DataTable> = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTableExample />,
  decorators: [
    withReactRouterStubDecorator({
      routes: [
        {
          path: '/api/users',
          action: async ({ request }: ActionFunctionArgs) => handleDataFetch(request),
        },
      ],
    }),
  ],
};