import { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
import { DataTableNuqsForm } from '@lambdacurry/forms/ui/data-table/data-table-nuqs-form';
import { 
  createColumnFilterSchema, 
  selectFilterSchema, 
  textFilterSchema, 
  numberFilterSchema, 
  dateFilterSchema 
} from '@lambdacurry/forms/ui/data-table/data-table-schemas';
import type { Meta, StoryObj } from '@storybook/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { z } from 'zod';

// Define the data schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'editor']),
  status: z.enum(['active', 'inactive', 'pending']),
  age: z.number().min(18).max(100),
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
  age: 18 + Math.floor(Math.random() * 50),
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
    accessorKey: 'age',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
    cell: ({ row }) => <div>{row.getValue('age')}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value: { min?: number; max?: number }) => {
      const age = row.getValue<number>(id);
      if (value.min !== undefined && value.max !== undefined) {
        return age >= value.min && age <= value.max;
      } else if (value.min !== undefined) {
        return age >= value.min;
      } else if (value.max !== undefined) {
        return age <= value.max;
      }
      return true;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
    enableColumnFilter: true,
    filterFn: (row, id, value: { from?: string; to?: string }) => {
      const date = new Date(row.getValue<string>(id)).getTime();
      if (value.from && value.to) {
        return date >= new Date(value.from).getTime() && date <= new Date(value.to).getTime();
      } else if (value.from) {
        return date >= new Date(value.from).getTime();
      } else if (value.to) {
        return date <= new Date(value.to).getTime();
      }
      return true;
    },
  },
];

// Component to display the data table with nuqs integration
const DataTableNuqsFormExample = () => {
  const [data, setData] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate data fetching with URL parameters
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Get URL parameters
      const url = new URL(window.location.href);
      const page = Number.parseInt(url.searchParams.get('page') || '0');
      const pageSize = Number.parseInt(url.searchParams.get('pageSize') || '10');
      const sortParam = url.searchParams.get('sort');
      const filtersParam = url.searchParams.get('filters');
      const search = url.searchParams.get('search') || '';
      
      // Parse sorting
      let sortField = 'name';
      let sortOrder = 'asc';
      
      if (sortParam) {
        try {
          const sortData = JSON.parse(sortParam);
          if (sortData.length > 0) {
            sortField = sortData[0].id;
            sortOrder = sortData[0].desc ? 'desc' : 'asc';
          }
        } catch (e) {
          console.error('Error parsing sort parameter:', e);
        }
      }
      
      // Parse filters
      const filters: Record<string, any> = {};
      
      if (filtersParam) {
        try {
          const filtersData = JSON.parse(filtersParam);
          filtersData.forEach((filter: any) => {
            filters[filter.id] = filter.value;
          });
        } catch (e) {
          console.error('Error parsing filters parameter:', e);
        }
      }
      
      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Apply filters
      let filteredData = [...users];
      
      // Apply search
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower),
        );
      }
      
      // Apply column filters
      if (filters.role) {
        filteredData = filteredData.filter((user) => filters.role.includes(user.role));
      }
      
      if (filters.status) {
        filteredData = filteredData.filter((user) => filters.status.includes(user.status));
      }
      
      if (filters.age) {
        if (filters.age.min !== undefined) {
          filteredData = filteredData.filter((user) => user.age >= filters.age.min);
        }
        if (filters.age.max !== undefined) {
          filteredData = filteredData.filter((user) => user.age <= filters.age.max);
        }
      }
      
      if (filters.createdAt) {
        if (filters.createdAt.from) {
          const fromDate = new Date(filters.createdAt.from).getTime();
          filteredData = filteredData.filter(
            (user) => new Date(user.createdAt).getTime() >= fromDate,
          );
        }
        if (filters.createdAt.to) {
          const toDate = new Date(filters.createdAt.to).getTime();
          filteredData = filteredData.filter(
            (user) => new Date(user.createdAt).getTime() <= toDate,
          );
        }
      }
      
      // Apply sorting
      filteredData.sort((a, b) => {
        const aValue = a[sortField as keyof User];
        const bValue = b[sortField as keyof User];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      
      // Apply pagination
      const start = page * pageSize;
      const paginatedData = filteredData.slice(start, start + pageSize);
      
      setData(paginatedData);
      setPageCount(Math.ceil(filteredData.length / pageSize));
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users Table (Nuqs Integration)</h1>
      <p className="mb-4">This example demonstrates integration with nuqs and zod, including:</p>
      <ul className="list-disc pl-5 mb-4">
        <li>URL-based state management with nuqs</li>
        <li>Schema validation with zod</li>
        <li>Four filter types: text, select, number, and date</li>
        <li>Pagination support</li>
      </ul>
      <DataTableNuqsForm
        columns={columns}
        data={data}
        pageCount={pageCount}
        isLoading={isLoading}
        defaultSort={{ id: 'name', desc: false }}
        filterableColumns={[
          {
            id: 'role',
            title: 'Role',
            type: 'select',
            options: [
              { label: 'Admin', value: 'admin' },
              { label: 'User', value: 'user' },
              { label: 'Editor', value: 'editor' },
            ],
            schema: selectFilterSchema,
          },
          {
            id: 'status',
            title: 'Status',
            type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Pending', value: 'pending' },
            ],
            schema: selectFilterSchema,
          },
          {
            id: 'age',
            title: 'Age',
            type: 'number',
            schema: numberFilterSchema,
          },
          {
            id: 'createdAt',
            title: 'Created At',
            type: 'date',
            schema: dateFilterSchema,
          },
        ]}
        searchableColumns={[
          {
            id: 'name',
            title: 'Name',
            schema: textFilterSchema,
          },
        ]}
      />
    </div>
  );
};

const meta: Meta<typeof DataTableNuqsForm> = {
  title: 'UI/DataTableNuqsForm',
  component: DataTableNuqsForm,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DataTableNuqsFormExample />,
};