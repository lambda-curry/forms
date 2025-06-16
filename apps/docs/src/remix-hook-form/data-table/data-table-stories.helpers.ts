// --- Shared Types and Interfaces ---
export interface MockIssue {
  id: string;
  title: string;
  status: 'todo' | 'in progress' | 'done' | 'backlog';
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: Date;
  estimatedHours: number;
}

export interface DataResponse {
  data: MockIssue[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
  };
  facetedCounts: Record<string, Record<string, number>>;
}

// --- Mock Database ---
export const mockDatabase: MockIssue[] = [
  {
    id: 'TASK-1',
    title: 'Fix login bug',
    status: 'todo',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-01-15'),
    estimatedHours: 2.5,
  },
  {
    id: 'TASK-2',
    title: 'Add dark mode',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-01-20'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-3',
    title: 'Improve dashboard performance',
    status: 'in progress',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-02-01'),
    estimatedHours: 3.0,
  },
  {
    id: 'TASK-4',
    title: 'Update documentation',
    status: 'done',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-02-10'),
    estimatedHours: 0.5,
  },
  {
    id: 'TASK-5',
    title: 'Refactor auth module',
    status: 'backlog',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-02-15'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-6',
    title: 'Implement user profile page',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'medium',
    createdDate: new Date('2024-03-01'),
    estimatedHours: 1.0,
  },
  {
    id: 'TASK-7',
    title: 'Design new landing page',
    status: 'todo',
    assignee: 'Alice',
    priority: 'high',
    createdDate: new Date('2024-03-05'),
    estimatedHours: 3.5,
  },
  {
    id: 'TASK-8',
    title: 'Write API integration tests',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-03-10'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-9',
    title: 'Deploy to staging environment',
    status: 'todo',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-03-15'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-10',
    title: 'User feedback session',
    status: 'done',
    assignee: 'Alice',
    priority: 'low',
    createdDate: new Date('2024-03-20'),
    estimatedHours: 0.5,
  },
  {
    id: 'TASK-11',
    title: 'Fix critical bug in payment module',
    status: 'in progress',
    assignee: 'Bob',
    priority: 'high',
    createdDate: new Date('2024-03-22'),
    estimatedHours: 3.0,
  },
  {
    id: 'TASK-12',
    title: 'Update third-party libraries',
    status: 'backlog',
    assignee: 'Charlie',
    priority: 'low',
    createdDate: new Date('2024-03-25'),
    estimatedHours: 1.0,
  },
  {
    id: 'TASK-13',
    title: 'Onboard new developer',
    status: 'done',
    assignee: 'Alice',
    priority: 'medium',
    createdDate: new Date('2024-04-01'),
    estimatedHours: 2.0,
  },
  {
    id: 'TASK-14',
    title: 'Research new caching strategy',
    status: 'todo',
    assignee: 'Bob',
    priority: 'medium',
    createdDate: new Date('2024-04-05'),
    estimatedHours: 1.5,
  },
  {
    id: 'TASK-15',
    title: 'Accessibility audit',
    status: 'in progress',
    assignee: 'Charlie',
    priority: 'high',
    createdDate: new Date('2024-04-10'),
    estimatedHours: 2.5,
  },
];

// --- Utility Functions ---
export function calculateFacetedCounts(
  data: MockIssue[],
  countColumns: Array<keyof MockIssue>,
  allOptions: Record<keyof MockIssue, { value: string; label: string }[] | undefined>,
): Record<string, Record<string, number>> {
  const counts: Record<string, Record<string, number>> = {};

  countColumns.forEach((columnId) => {
    counts[columnId as string] = {};

    // Initialize all defined options with 0 count
    const options = allOptions[columnId];
    if (options) {
      options.forEach((option) => {
        counts[columnId as string][option.value] = 0;
      });
    }

    // Count actual occurrences
    data.forEach((item) => {
      const value = item[columnId];
      if (value !== undefined && value !== null) {
        const stringValue = String(value);
        if (counts[columnId as string][stringValue] !== undefined) {
          counts[columnId as string][stringValue]++;
        } else {
          // For values not in predefined options, still count them
          counts[columnId as string][stringValue] = (counts[columnId as string][stringValue] || 0) + 1;
        }
      }
    });
  });

  return counts;
}

// --- Column Configuration Options ---
export const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'backlog', label: 'Backlog' },
];

export const assigneeOptions = [
  { value: 'Alice', label: 'Alice' },
  { value: 'Bob', label: 'Bob' },
  { value: 'Charlie', label: 'Charlie' },
];

export const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

// --- Shared Imports (for re-export) ---
export { dataTableRouterParsers } from '@lambdacurry/forms/remix-hook-form/data-table-router-parsers';
export { DataTableFilter } from '@lambdacurry/forms/ui/data-table-filter/components/data-table-filter';
export { createColumnConfigHelper } from '@lambdacurry/forms/ui/data-table-filter/core/filters';
export { useDataTableFilters } from '@lambdacurry/forms/ui/data-table-filter/hooks/use-data-table-filters';
export { DataTable } from '@lambdacurry/forms/ui/data-table/data-table';
export { DataTableColumnHeader } from '@lambdacurry/forms/ui/data-table/data-table-column-header';
export type { FiltersState } from '@lambdacurry/forms/ui/utils/filters';
export { filtersArraySchema } from '@lambdacurry/forms/ui/utils/filters';
export { useFilterSync } from '@lambdacurry/forms/ui/utils/use-filter-sync';
export { CalendarIcon, CheckCircledIcon, PersonIcon, StarIcon, TextIcon } from '@radix-ui/react-icons';
export type { ColumnDef, PaginationState, SortingState, OnChangeFn } from '@tanstack/react-table';
export { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
export { useMemo } from 'react';
export { type LoaderFunctionArgs, useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router';
export { withReactRouterStubDecorator } from '../../lib/storybook/react-router-stub';
