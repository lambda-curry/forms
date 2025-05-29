import type { ColumnDef } from '@tanstack/react-table';
import {
  CalendarIcon,
  CheckCircledIcon,
  DataTableColumnHeader,
  type MockIssue,
  PersonIcon,
  StarIcon,
  TextIcon,
  assigneeOptions,
  createColumnConfigHelper,
  priorityOptions,
  statusOptions,
} from './data-table-stories.helpers';

// --- Column Configuration ---
const dtf = createColumnConfigHelper<MockIssue>();

export const columnConfigs = [
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
    .accessor((row) => row.status)
    .displayName('Status')
    .icon(CheckCircledIcon)
    .options(statusOptions)
    .build(),
  dtf
    .option()
    .id('assignee')
    .accessor((row) => row.assignee)
    .displayName('Assignee')
    .icon(PersonIcon)
    .options(assigneeOptions)
    .build(),
  dtf
    .option()
    .id('priority')
    .accessor((row) => row.priority)
    .displayName('Priority')
    .icon(StarIcon)
    .options(priorityOptions)
    .build(),
  dtf
    .date()
    .id('createdDate')
    .accessor((row) => row.createdDate)
    .displayName('Created Date')
    .icon(CalendarIcon)
    .build(),
  dtf
    .number()
    .id('estimatedHours')
    .accessor((row) => row.estimatedHours)
    .displayName('Estimated Hours')
    .icon(TextIcon)
    .build(),
];

// --- Table Columns Definition ---
export const columns: ColumnDef<MockIssue>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue('assignee')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      return (
        <div className="flex items-center">
          <span className="capitalize">{priority}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.getValue('createdDate') as Date;
      return <div className="w-[100px]">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'estimatedHours',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hours" />,
    cell: ({ row }) => {
      const hours = row.getValue('estimatedHours') as number;
      return <div className="w-[80px]">{hours}h</div>;
    },
  },
];
