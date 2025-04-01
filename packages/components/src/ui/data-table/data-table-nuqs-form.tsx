import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useEffect } from 'react';
import { z } from 'zod';
import { useQueryState, parseAsInteger, parseAsString, parseAsJson, createParser } from 'nuqs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableNuqsToolbar } from './data-table-nuqs-toolbar';

// Create a parser for sorting state
const parseAsSortingState = createParser({
  parse: (value) => {
    try {
      const parsed = JSON.parse(value);
      return parsed as SortingState;
    } catch (e) {
      return [];
    }
  },
  serialize: (value) => JSON.stringify(value),
});

// Create a parser for column filters state
const parseAsColumnFiltersState = createParser({
  parse: (value) => {
    try {
      const parsed = JSON.parse(value);
      return parsed as ColumnFiltersState;
    } catch (e) {
      return [];
    }
  },
  serialize: (value) => JSON.stringify(value),
});

interface DataTableNuqsFormProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: {
    id: keyof TData;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
    schema?: z.ZodType<any>;
  }[];
  searchableColumns?: {
    id: keyof TData;
    title: string;
    schema?: z.ZodType<any>;
  }[];
  defaultSort?: {
    id: string;
    desc: boolean;
  };
  pageCount?: number;
  isLoading?: boolean;
}

export function DataTableNuqsForm<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  defaultSort,
  pageCount,
  isLoading = false,
}: DataTableNuqsFormProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Use nuqs for URL state management
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [sorting, setSorting] = useQueryState(
    'sort', 
    parseAsSortingState.withDefault(defaultSort ? [defaultSort] : [])
  );
  const [columnFilters, setColumnFilters] = useQueryState(
    'filters', 
    parseAsColumnFiltersState.withDefault([])
  );
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: page,
        pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater({ pageIndex: page, pageSize }) 
        : updater;
      setPage(newPagination.pageIndex);
      setPageSize(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: Boolean(pageCount),
    pageCount,
  });

  return (
    <div className="space-y-4">
      <DataTableNuqsToolbar
        table={table}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        search={search}
        setSearch={setSearch}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
              // biome-ignore lint/style/useExplicitLengthCheck: <explanation>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

      <DataTablePagination table={table} />
    </div>
  );
}