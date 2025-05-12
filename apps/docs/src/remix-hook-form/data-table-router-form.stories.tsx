import { DataTableRouterForm } from '@lambdacurry/forms/remix-hook-form/data-table-router-form';
import {
  type BazzaFilterItem,
  type BazzaFiltersState,
  dataTableRouterParsers,
} from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers';
import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { ActivityIcon, ShieldIcon, UserIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { z } from 'zod';
import { withReactRouterStubDecorator } from '../lib/storybook/react-router-stub';

// Assuming createColumnConfigHelper is available from bazza/ui
// For the story, we'll simulate its output if direct import is problematic.
// import { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/column-config-helper'; // Example path

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

// TanStack Table Column Definitions (for display)
const tanstackTableColumns: ColumnDef<User>[] = [
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
    // Filter-related properties like enableColumnFilter, filterFn are now handled by Bazza UI config
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
  },
];

interface BazzaFilterColumnConfig {
  id: string;
  type: string;
  displayName: string;
  filterType: string;
  options?: { label: string; value: string }[];
  icon: ComponentType<{ className?: string }>;
}

// Updated Bazza UI Filter Column Configurations
const bazzaFilterColumnConfigs: BazzaFilterColumnConfig[] = [
  {
    id: 'name',
    type: 'text',
    displayName: 'Name',
    filterType: 'text',
    icon: UserIcon,
  },
  {
    id: 'role',
    type: 'option',
    displayName: 'Role',
    filterType: 'option',
    icon: ShieldIcon,
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Editor', value: 'editor' },
    ],
  },
  {
    id: 'status',
    type: 'option',
    displayName: 'Status',
    filterType: 'option',
    icon: ActivityIcon,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  // Add more configs for other filterable columns as needed
];

// Log all options for each config to help debug undefined labels
bazzaFilterColumnConfigs.forEach((config) => {
  console.log('>>>>> config', config);
  // Log the options array for each config, if present
  console.log(`Config id: ${config.id}, options:`, config.options);
  if (config.options) {
    config.options.forEach((opt, idx) => {
      // Log if label is missing or undefined
      if (!opt || typeof opt.label !== 'string') {
        // eslint-disable-next-line no-console
        console.warn(`Option label is missing or not a string in config '${config.id}' at index ${idx}:`, opt);
      }
    });
  }
});

function DataTableRouterFormExample() {
  const loaderData = useLoaderData<DataResponse>();
  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;

  // Log options before rendering to catch runtime issues
  bazzaFilterColumnConfigs.forEach((config) => {
    if (config.options) {
      config.options.forEach((opt, idx) => {
        if (!opt || typeof opt.label !== 'string') {
          // eslint-disable-next-line no-console
          console.warn(
            `[Render] Option label is missing or not a string in config '${config.id}' at index ${idx}:`,
            opt,
          );
        }
      });
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users Table (Bazza UI Filters)</h1>
      <p className="mb-4">This example demonstrates integration with React Router forms, including:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>Form-based filtering with automatic submission</li>
        <li>Loading state while waiting for data</li>
        <li>Server-side filtering and pagination</li>
        <li>URL-based state management with React Router</li>
      </ul>
      <DataTableRouterForm<User, keyof User>
        columns={tanstackTableColumns} // For table display
        data={data}
        pageCount={pageCount}
        filterColumnConfigs={bazzaFilterColumnConfigs} // Pass Bazza UI config
        // dtfOptions and dtfFacetedData would be fetched and passed for server-driven options/facets
      />
    </div>
  );
}

const handleDataFetch = async ({ request }: LoaderFunctionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const url = request?.url ? new URL(request.url) : new URL('http://localhost?page=0&pageSize=10');
  const params = url.searchParams;

  const page = dataTableRouterParsers.page.parse(params.get('page'));
  const pageSize = dataTableRouterParsers.pageSize.parse(params.get('pageSize'));
  const sortField = dataTableRouterParsers.sortField.parse(params.get('sortField'));
  const sortOrder = dataTableRouterParsers.sortOrder.parse(params.get('sortOrder'));
  const search = dataTableRouterParsers.search.parse(params.get('search'));

  // Parse BazzaFiltersState
  const bazzaFilters = dataTableRouterParsers.filters.parse(params.get('filters')) as BazzaFiltersState;

  let filteredData = [...users];

  // 1. Apply global search (if still used)
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = filteredData.filter(
      (user) => user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
    );
  }

  // 2. Apply Bazza UI filters
  if (bazzaFilters && bazzaFilters.length > 0) {
    bazzaFilters.forEach((filter: BazzaFilterItem) => {
      const { columnId, type, operator, values } = filter;
      if (!values || values.length === 0) return;

      filteredData = filteredData.filter((user) => {
        const userValue = user[columnId as keyof User];

        switch (type) {
          case 'text': {
            if (operator === 'contains' && typeof userValue === 'string' && typeof values[0] === 'string') {
              return userValue.toLowerCase().includes(values[0].toLowerCase());
            }
            // Add other text operators: equals, startsWith, etc.
            return true; // Default pass if operator not handled
          }

          case 'option': {
            if (operator === 'is any of' && Array.isArray(values)) return values.includes(userValue as string);
            if (operator === 'is' && typeof values[0] === 'string') return userValue === values[0];
            // Add other option operators
            return true;
          }

          // Add cases for 'number', 'date' filters based on bazza/ui operators
          default:
            return true;
        }
      });
    });
  }

  // 3. Apply sorting (same as before)
  if (sortField && sortOrder && sortField in users[0]) {
    filteredData.sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // 4. Apply pagination (same as before)
  const safePage = params.has('page') ? page : dataTableRouterParsers.page.defaultValue;
  const safePageSize = params.has('pageSize') ? pageSize : dataTableRouterParsers.pageSize.defaultValue;
  const start = safePage * safePageSize;
  const paginatedData = filteredData.slice(start, start + safePageSize);

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
  args: {} as any, // Args for DataTableRouterForm if needed, handled by Example component
  render: () => <DataTableRouterFormExample />,
  parameters: {
    docs: {
      description: {
        story: 'This is a description of the DataTableRouterForm component.',
      },
    },
  },
};
