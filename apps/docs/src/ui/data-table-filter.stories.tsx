import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { type ColumnDef } from '@tanstack/react-table';
import {
  DataTableFilter,
  defineMeta,
  filterFn,
  type DataTableFilterState,
} from '@lambda-curry/components/ui/data-table-filter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lambda-curry/components/ui/table';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Badge } from '@lambda-curry/components/ui/badge';
import { CalendarIcon, CircleDotDashedIcon, TagIcon, UserIcon } from 'lucide-react';

// Define the data type
interface Issue {
  id: string;
  title: string;
  status: 'in-progress' | 'todo' | 'done' | 'backlog';
  assignee: string;
  labels: string[];
  estimatedHours: number;
  startDate?: Date;
  endDate?: Date;
}

// Sample data
const issues: Issue[] = [
  {
    id: '1',
    title: 'Implement user login',
    status: 'in-progress',
    assignee: 'JS',
    labels: ['Feature'],
    estimatedHours: 101,
    startDate: new Date('2025-03-28'),
  },
  {
    id: '2',
    title: 'Fix payment processing',
    status: 'todo',
    assignee: 'RE',
    labels: ['Bug'],
    estimatedHours: 6,
  },
  {
    id: '3',
    title: 'Design database schema',
    status: 'done',
    assignee: 'AY',
    labels: ['Database', 'Feature'],
    estimatedHours: 10,
    startDate: new Date('2025-03-24'),
    endDate: new Date('2025-03-29'),
  },
  {
    id: '4',
    title: 'Update API docs',
    status: 'backlog',
    assignee: '',
    labels: ['Documentation', 'API'],
    estimatedHours: 4,
  },
  {
    id: '5',
    title: 'Optimize frontend',
    status: 'in-progress',
    assignee: 'MS',
    labels: ['Performance', 'User Interface'],
    estimatedHours: 12,
    startDate: new Date('2025-03-29'),
  },
  {
    id: '6',
    title: 'Add unit tests',
    status: 'todo',
    assignee: 'JS',
    labels: ['Testing', 'Feature'],
    estimatedHours: 8,
  },
  {
    id: '7',
    title: 'Implement dark mode',
    status: 'done',
    assignee: '',
    labels: ['Feature', 'User Interface'],
    estimatedHours: 6,
    startDate: new Date('2025-03-26'),
    endDate: new Date('2025-03-31'),
  },
  {
    id: '8',
    title: 'Fix search filter',
    status: 'backlog',
    assignee: '',
    labels: ['Bug', 'User Interface'],
    estimatedHours: 3,
  },
  {
    id: '9',
    title: 'Refactor auth middleware',
    status: 'todo',
    assignee: 'RE',
    labels: ['Refactor'],
    estimatedHours: 5,
  },
  {
    id: '10',
    title: 'Update user profiles',
    status: 'in-progress',
    assignee: 'AY',
    labels: ['Enhancement', 'User Interface'],
    estimatedHours: 7,
    startDate: new Date('2025-03-27'),
  },
];

// Define status options
const ISSUE_STATUSES = [
  {
    label: 'In Progress',
    value: 'in-progress',
  },
  {
    label: 'Todo',
    value: 'todo',
  },
  {
    label: 'Done',
    value: 'done',
  },
  {
    label: 'Backlog',
    value: 'backlog',
  },
];

// Define label options
const ISSUE_LABELS = [
  {
    label: 'Feature',
    value: 'Feature',
    icon: TagIcon,
  },
  {
    label: 'Bug',
    value: 'Bug',
    icon: TagIcon,
  },
  {
    label: 'Enhancement',
    value: 'Enhancement',
    icon: TagIcon,
  },
  {
    label: 'Documentation',
    value: 'Documentation',
    icon: TagIcon,
  },
  {
    label: 'Performance',
    value: 'Performance',
    icon: TagIcon,
  },
  {
    label: 'Testing',
    value: 'Testing',
    icon: TagIcon,
  },
  {
    label: 'Refactor',
    value: 'Refactor',
    icon: TagIcon,
  },
  {
    label: 'API',
    value: 'API',
    icon: TagIcon,
  },
  {
    label: 'Database',
    value: 'Database',
    icon: TagIcon,
  },
  {
    label: 'User Interface',
    value: 'User Interface',
    icon: TagIcon,
  },
];

// Define columns
const columns: ColumnDef<Issue>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    filterFn: filterFn('text'),
    meta: defineMeta('title', {
      displayName: 'Title',
      type: 'text',
      icon: UserIcon,
    }),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: filterFn('option'),
    meta: defineMeta('status', {
      displayName: 'Status',
      type: 'option',
      icon: CircleDotDashedIcon,
      options: ISSUE_STATUSES,
    }),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusObj = ISSUE_STATUSES.find((s) => s.value === status);
      
      return (
        <Badge variant="outline" className="capitalize">
          {statusObj?.label || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    filterFn: filterFn('option'),
    meta: defineMeta('assignee', {
      displayName: 'Assignee',
      type: 'option',
      icon: UserIcon,
      options: [
        { label: 'JS', value: 'JS' },
        { label: 'RE', value: 'RE' },
        { label: 'AY', value: 'AY' },
        { label: 'MS', value: 'MS' },
        { label: 'Unassigned', value: '' },
      ],
    }),
  },
  {
    accessorKey: 'labels',
    header: 'Labels',
    filterFn: filterFn('multiOption'),
    meta: defineMeta('labels', {
      displayName: 'Labels',
      type: 'multiOption',
      icon: TagIcon,
      options: ISSUE_LABELS,
    }),
    cell: ({ row }) => {
      const labels = row.getValue('labels') as string[];
      
      return (
        <div className="flex flex-wrap gap-1">
          {labels.map((label) => (
            <Badge key={label} variant="secondary" className="capitalize">
              {label}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'estimatedHours',
    header: 'Estimated Hours',
    filterFn: filterFn('number'),
    meta: defineMeta('estimatedHours', {
      displayName: 'Estimated Hours',
      type: 'number',
      icon: CalendarIcon,
      max: 120,
    }),
    cell: ({ row }) => {
      const hours = row.getValue('estimatedHours') as number;
      
      return <div>{hours} h</div>;
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    filterFn: filterFn('date'),
    meta: defineMeta('startDate', {
      displayName: 'Start Date',
      type: 'date',
      icon: CalendarIcon,
    }),
    cell: ({ row }) => {
      const date = row.getValue('startDate') as Date | undefined;
      
      return <div>{date ? date.toLocaleDateString() : '-'}</div>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    filterFn: filterFn('date'),
    meta: defineMeta('endDate', {
      displayName: 'End Date',
      type: 'date',
      icon: CalendarIcon,
    }),
    cell: ({ row }) => {
      const date = row.getValue('endDate') as Date | undefined;
      
      return <div>{date ? date.toLocaleDateString() : '-'}</div>;
    },
  },
];

const meta: Meta<typeof DataTableFilterDemo> = {
  title: 'UI/DataTableFilter',
  component: DataTableFilterDemo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DataTableFilterDemo>;

export const Default: Story = {};

function DataTableFilterDemo() {
  const [filters, setFilters] = React.useState<DataTableFilterState>([]);
  
  // Create table instance
  const table = useReactTable({
    data: issues,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters: filters.map((filter) => ({
        id: filter.id,
        value: filter.value.values,
      })),
    },
    filterFns: {
      text: filterFn('text'),
      number: filterFn('number'),
      date: filterFn('date'),
      option: filterFn('option'),
      multiOption: filterFn('multiOption'),
    },
  });
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Data Table Filter</h1>
      
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <DataTableFilter
            columns={columns}
            filters={filters}
            actions={{
              onFiltersChange: setFilters,
            }}
            locale="en"
            strategy="tanstack-table"
          />
        </div>
        
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Introduction</h2>
        <p>
          This is an add-on to your existing shadcn/ui data table component. It adds client-side filtering with a clean, modern UI inspired by Linear.
        </p>
        <p>
          This component relies on TanStack Table, a headless UI for building powerful tables & datagrids.
        </p>
        
        <h2 className="text-xl font-bold">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Complete refactoring with a new API structure</li>
          <li>Internationalization (i18n) support</li>
          <li>Quick Search Filters for option and multiOption columns</li>
          <li>Number Filtering Overhaul with range slider support</li>
          <li>UI improvements and performance enhancements</li>
          <li>Comprehensive filtering capabilities for different data types</li>
        </ul>
        
        <h2 className="text-xl font-bold">Usage</h2>
        <p>
          To use the new DataTableFilter component, you need to:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Define your columns with proper metadata using the defineMeta helper</li>
          <li>Use the filterFn function for filtering</li>
          <li>Manage filter state with useState or a state management library</li>
          <li>Pass the columns, filters, and actions to the DataTableFilter component</li>
        </ol>
        
        <h2 className="text-xl font-bold">API</h2>
        <p>
          The new API structure requires different props:
        </p>
        <pre className="bg-muted p-4 rounded-md overflow-auto">
{`<DataTableFilter
  columns={columns}
  filters={filters}
  actions={{
    onFiltersChange: setFilters
  }}
  locale="en"
  strategy="tanstack-table"
/>`}
        </pre>
      </div>
    </div>
  );
}
