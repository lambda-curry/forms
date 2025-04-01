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
import { Form, useNavigation, useSubmit } from 'react-router-dom';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRouterToolbar } from './data-table-router-toolbar';

interface DataTableRouterFormProps<TData, TValue> {
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
  }[];
  searchableColumns?: {
    id: keyof TData;
    title: string;
  }[];
  defaultSort?: {
    id: string;
    desc: boolean;
  };
  pageCount?: number;
  formAction?: string;
  formMethod?: 'get' | 'post';
}

export function DataTableRouterForm<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  defaultSort,
  pageCount,
  formAction,
  formMethod = 'get',
}: DataTableRouterFormProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort ? [defaultSort] : []);

  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' || navigation.state === 'submitting';

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: Boolean(pageCount),
    pageCount,
  });

  // Auto-submit the form when filters change
  useEffect(() => {
    const formElement = document.getElementById('data-table-router-form') as HTMLFormElement;
    if (formElement) {
      submit(formElement);
    }
  }, [sorting, columnFilters, table.getState().pagination, submit]);

  return (
    <div className="space-y-4">
      <Form id="data-table-router-form" method={formMethod} action={formAction}>
        <DataTableRouterToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        />

        {/* Hidden inputs for sorting */}
        {sorting.length > 0 && (
          <>
            <input type="hidden" name="sortField" value={sorting[0].id} />
            <input type="hidden" name="sortOrder" value={sorting[0].desc ? 'desc' : 'asc'} />
          </>
        )}

        {/* Hidden inputs for pagination */}
        <input type="hidden" name="page" value={table.getState().pagination.pageIndex} />
        <input type="hidden" name="pageSize" value={table.getState().pagination.pageSize} />

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
      </Form>

      <DataTablePagination table={table} />
    </div>
  );
}
