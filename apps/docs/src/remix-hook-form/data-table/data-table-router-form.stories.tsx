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
import { withReactRouterStubDecorator } from '../../lib/storybook/react-router-stub';

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

const applyGlobalSearch = (data: User[], search: string | null | undefined): User[] => {
  if (!search) {
    return data;
  }

  const searchLower = search.toLowerCase();
  return data.filter((user) => {
    return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower);
  });
};

const matchesTextFilter = (user: User, filter: BazzaFilterItem): boolean => {
  if (!filter.values || filter.values.length === 0) {
    return true;
  }

  const [rawValue] = filter.values;
  if (typeof rawValue !== 'string') {
    return true;
  }

  const userValue = user[filter.columnId as keyof User];
  if (typeof userValue !== 'string') {
    return true;
  }

  const normalizedValue = rawValue.toLowerCase();
  const normalizedUserValue = userValue.toLowerCase();

  switch (filter.operator) {
    case 'contains':
      return normalizedUserValue.includes(normalizedValue);
    case 'is':
    case 'equals':
      return normalizedUserValue === normalizedValue;
    case 'starts with':
      return normalizedUserValue.startsWith(normalizedValue);
    default:
      return true;
  }
};

const matchesOptionFilter = (user: User, filter: BazzaFilterItem): boolean => {
  if (!filter.values || filter.values.length === 0) {
    return true;
  }

  const userValue = user[filter.columnId as keyof User];
  if (filter.operator === 'is any of') {
    return filter.values.includes(userValue as string);
  }

  if (filter.operator === 'is') {
    return userValue === filter.values[0];
  }

  return true;
};

const matchesBazzaFilter = (user: User, filter: BazzaFilterItem): boolean => {
  switch (filter.type) {
    case 'text':
      return matchesTextFilter(user, filter);
    case 'option':
      return matchesOptionFilter(user, filter);
    default:
      return true;
  }
};

const applyBazzaFilters = (data: User[], filters: BazzaFiltersState | null): User[] => {
  if (!filters || filters.length === 0) {
    return data;
  }

  return filters.reduce<User[]>((current, filter) => {
    if (!filter.values || filter.values.length === 0) {
      return current;
    }

    return current.filter((user) => matchesBazzaFilter(user, filter));
  }, data);
};

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

function DataTableRouterFormExample() {
  const loaderData = useLoaderData<DataResponse>();
  const data = loaderData?.data ?? [];
  const pageCount = loaderData?.meta.pageCount ?? 0;

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
  const bazzaFilters = dataTableRouterParsers.filters.parse(params.get('filters')) as BazzaFiltersState | null;

  let filteredData = applyGlobalSearch([...users], search);
  filteredData = applyBazzaFilters(filteredData, bazzaFilters);

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
    docs: {
      description: {
        component: `
# Data Table Router Form (Legacy)

This component demonstrates the legacy data table filtering approach using DataTableRouterForm. 

## ⚠️ Migration Notice

**This component is being superseded by the new Bazza UI filter components.** 

For new projects, please use the **Data Table/Bazza UI Filters** stories instead, which provide:
- Better type safety with column configuration helpers
- More filter types (text, option, date, number)
- Improved user experience with faceted filtering
- Better URL state management
- Enhanced accessibility

## Migration Path

To migrate from this legacy approach to Bazza UI filters:

1. **Replace DataTableRouterForm** with direct DataTable usage
2. **Update filter configuration** from TanStack table filterFn to Bazza UI column configs
3. **Use new hooks**: Replace custom logic with useDataTableFilters and useFilterSync
4. **Update imports**: Import from '@lambdacurry/forms/ui/data-table-filter'

See the **Data Table/Bazza UI Filters** stories for complete migration examples.

## Current Implementation

This story shows the current DataTableRouterForm implementation with basic Bazza filter integration for backward compatibility.
        `,
      },
    },
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
        story: `
**Legacy Data Table with Basic Filtering**

This story demonstrates the legacy DataTableRouterForm component with basic filtering capabilities.

**⚠️ For New Projects**: Use the **Data Table/Bazza UI Filters** stories instead for:
- Enhanced filter types (text, option, date, number)
- Better user experience with faceted filtering
- Improved type safety and maintainability

**Features Shown:**
- Basic server-side filtering and pagination
- URL state synchronization
- Simple filter configuration

**Migration Example:**
Instead of configuring filters in TanStack table columns, use Bazza UI column config:

\`\`\`typescript
// Legacy approach (this story)
{
  accessorKey: 'role',
  enableColumnFilter: true,
  filterFn: (row, id, value: string[]) => {
    return value.includes(row.getValue(id));
  },
}

// New Bazza UI approach (recommended)
dtf
  .option()
  .id('role')
  .accessor((row) => row.role)
  .displayName('Role')
  .options([
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ])
  .build()
\`\`\`
        `,
      },
    },
  },
};
