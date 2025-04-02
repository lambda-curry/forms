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
import { useQueryStates } from 'nuqs';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
import { z } from 'zod';

import { DataTablePagination } from '../ui/data-table/data-table-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DataTableRouterToolbar, type DataTableRouterToolbarProps } from './data-table-router-toolbar';

// Import the nuqs parsers and the inferred type
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

  // --- nuqs state management ---
  // Use nuqs to manage URL state. Debounce options can be set here per parser if needed.
  const [urlState, setUrlState] = useQueryStates(dataTableRouterParsers, {
    // Default nuqs options (shallow routing, replace history, no scroll)
    history: 'replace', // Default
    shallow: false, // we want to re-run the loader when the url changes
    // scroll: false,     // Default
    // Configure debounce globally if needed (though nuqs batches by default)
    // throttleMs: 300,
  });
  // --- End nuqs state management ---

  // Initialize RHF to *reflect* the nuqs state
  const methods = useRemixForm<DataTableRouterState>({
    // Use the nuqs inferred type
    // No resolver needed if Zod isn't primary validation driver here
    defaultValues: urlState, // Initialize with current URL state from nuqs
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

  // Table instance uses RHF state (which mirrors nuqs/URL state)
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

  // Pagination handler updates nuqs state
  const handlePaginationChange = useCallback(
    (pageIndex: number, newPageSize: number) => {
      setUrlState({ page: pageIndex, pageSize: newPageSize });
    },
    [setUrlState],
  );

  // Derive default values directly from parsers for reset
  const standardStateValues: DataTableRouterState = {
    search: '',
    filters: [],
    page: 0,
    pageSize: 10,
    sortField: '',
    sortOrder: 'asc',
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
