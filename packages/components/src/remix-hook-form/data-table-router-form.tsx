import {
  type ColumnDef,
  type ColumnFilter,
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
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useSearchParams } from 'react-router-dom';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

import { DataTablePagination } from '../ui/data-table/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DataTableRouterToolbar, type DataTableRouterToolbarProps } from './data-table-router-toolbar';

// Import the parsers and the inferred type
import { type DataTableRouterState, type FilterValue, dataTableRouterParsers } from './data-table-router-parsers';

// Schema for form data validation and type safety
const dataTableSchema = z.object({
  search: z.string().optional(),
  filters: z.array(z.object({ id: z.string(), value: z.any() })).optional(),
  page: z.number().min(0).optional(),
  pageSize: z.number().min(1).optional(),
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

type DataTableFormData = z.infer<typeof dataTableSchema>;

export interface DataTableRouterFormProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns?: DataTableRouterToolbarProps<TData>['filterableColumns'];
  searchableColumns?: DataTableRouterToolbarProps<TData>['searchableColumns'];
  pageCount?: number;
  defaultStateValues?: Partial<DataTableRouterState>;
}

export function DataTableRouterForm<TData, TValue>({
  columns,
  data,
  filterableColumns = [],
  searchableColumns = [],
  pageCount,
  defaultStateValues,
}: DataTableRouterFormProps<TData, TValue>) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  // --- React Router state management ---
  // Use React Router's useSearchParams hook to manage URL state
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse URL search parameters using our custom parsers
  const urlState: DataTableRouterState = {
    search: dataTableRouterParsers.search.parse(searchParams.get('search')),
    filters: dataTableRouterParsers.filters.parse(searchParams.get('filters')),
    page: dataTableRouterParsers.page.parse(searchParams.get('page')),
    pageSize: dataTableRouterParsers.pageSize.parse(searchParams.get('pageSize')),
    sortField: dataTableRouterParsers.sortField.parse(searchParams.get('sortField')),
    sortOrder: dataTableRouterParsers.sortOrder.parse(searchParams.get('sortOrder')),
  };

  // Function to update URL search parameters
  const setUrlState = useCallback(
    (newState: Partial<DataTableRouterState>) => {
      const updatedState = { ...urlState, ...newState };
      const newParams = new URLSearchParams();

      // Only add parameters that are not default values
      if (updatedState.search !== dataTableRouterParsers.search.defaultValue) {
        const serialized = dataTableRouterParsers.search.serialize(updatedState.search);
        if (serialized !== null) newParams.set('search', serialized);
      }

      if (updatedState.filters.length > 0) {
        const serialized = dataTableRouterParsers.filters.serialize(updatedState.filters);
        if (serialized !== null) newParams.set('filters', serialized);
      }

      if (updatedState.page !== dataTableRouterParsers.page.defaultValue) {
        const serialized = dataTableRouterParsers.page.serialize(updatedState.page);
        if (serialized !== null) newParams.set('page', serialized);
      }

      if (updatedState.pageSize !== dataTableRouterParsers.pageSize.defaultValue) {
        const serialized = dataTableRouterParsers.pageSize.serialize(updatedState.pageSize);
        if (serialized !== null) newParams.set('pageSize', serialized);
      }

      if (updatedState.sortField !== dataTableRouterParsers.sortField.defaultValue) {
        const serialized = dataTableRouterParsers.sortField.serialize(updatedState.sortField);
        if (serialized !== null) newParams.set('sortField', serialized);
      }

      if (updatedState.sortOrder !== dataTableRouterParsers.sortOrder.defaultValue) {
        const serialized = dataTableRouterParsers.sortOrder.serialize(updatedState.sortOrder);
        if (serialized !== null) newParams.set('sortOrder', serialized);
      }

      // Update the URL with the new search parameters
      setSearchParams(newParams, { replace: true });
    },
    [urlState, setSearchParams]
  );
  // --- End React Router state management ---

  // Initialize RHF to *reflect* the URL state
  const methods = useRemixForm<DataTableRouterState>({
    // No resolver needed if Zod isn't primary validation driver here
    defaultValues: urlState, // Initialize with current URL state
  });

  // Sync RHF state if urlState changes (e.g., back/forward, external link)
  useEffect(() => {
    // Only reset if the urlState differs from current RHF values
    if (JSON.stringify(urlState) !== JSON.stringify(methods.getValues())) {
      methods.reset(urlState);
    }
  }, [urlState, methods]);

  // Local UI state (column visibility, row selection)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Table instance uses RHF state (which mirrors URL state)
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: [{ id: urlState.sortField, desc: urlState.sortOrder === 'desc' }],
      columnFilters: urlState.filters as ColumnFilter[],
      pagination: { pageIndex: urlState.page, pageSize: urlState.pageSize },
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    // Define callbacks inline
    onSortingChange: (updater) => {
      const currentSorting = table.getState().sorting;
      const sorting = typeof updater === 'function' ? updater(currentSorting) : updater;
      setUrlState({
        sortField: sorting[0]?.id ?? '',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        page: 0,
      });
    },
    onColumnFiltersChange: (updater) => {
      const currentFilters = table.getState().columnFilters;
      const filters = typeof updater === 'function' ? updater(currentFilters) : updater;
      setUrlState({
        filters: filters as FilterValue[],
        page: 0,
      });
    },
  });

  // Pagination handler updates URL state
  const handlePaginationChange = useCallback(
    (pageIndex: number, newPageSize: number) => {
      setUrlState({ page: pageIndex, pageSize: newPageSize });
    },
    [setUrlState],
  );

  // Derive default values directly from parsers for reset
  const standardStateValues: DataTableRouterState = {
    search: dataTableRouterParsers.search.defaultValue,
    filters: dataTableRouterParsers.filters.defaultValue,
    page: dataTableRouterParsers.page.defaultValue,
    pageSize: dataTableRouterParsers.pageSize.defaultValue,
    sortField: dataTableRouterParsers.sortField.defaultValue,
    sortOrder: dataTableRouterParsers.sortOrder.defaultValue,
    ...defaultStateValues,
  };

  // Handle pagination props separately
  const paginationProps = {
    pageCount: pageCount || 0,
    onPaginationChange: handlePaginationChange,
  };

  return (
    <RemixFormProvider {...methods}>
      <div className="space-y-4">
        <DataTableRouterToolbar<TData>
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          setUrlState={setUrlState}
          defaultStateValues={standardStateValues}
        />

        {/* Table Rendering */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
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

        <DataTablePagination {...paginationProps} />
      </div>
    </RemixFormProvider>
  );
}
