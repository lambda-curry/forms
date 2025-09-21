import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  // type ColumnFilter, // No longer directly used for state.columnFilters
  type VisibilityState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from 'react-router';
import { RemixFormProvider, useRemixForm } from 'remix-hook-form';
// import { z } from 'zod'; // Schema is now more for URL state structure

import { DataTablePagination } from '../ui/data-table/data-table-pagination';
// Bazza UI imports - assuming types for ColumnConfig and output of useDataTableFilters
// For now, using 'any' for some bazza types if not precisely known.
import {
  useDataTableFilters, // The hook from bazza/ui
  // createColumnConfigHelper, // Assume columnsConfig is pre-built and passed in
} from '../ui/data-table-filter'; // Adjusted path
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { BazzaFiltersState, DataTableRouterState } from './data-table-router-parsers';
import { DataTableRouterToolbar } from './data-table-router-toolbar';
import { getDefaultDataTableState, useDataTableUrlState } from './use-data-table-url-state';

// dataTableSchema can remain to validate the shape of URL params if desired, but RemixForm doesn't use a resolver here.

export interface DataTableRouterFormProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // For TanStack Table display
  data: TData[]; // Data from server (already filtered/sorted/paginated)
  pageCount?: number;
  defaultStateValues?: Partial<DataTableRouterState>;
  // New prop for Bazza UI filter configurations
  // Shape is intentionally loose to allow passing configs from various sources without tight coupling
  filterColumnConfigs: unknown[];
  // Props for server-fetched options/faceted data for bazza/ui, if needed for server strategy
  dtfOptions?: unknown;
  dtfFacetedData?: unknown;
}

export function DataTableRouterForm<TData, TValue>({
  columns,
  data,
  pageCount,
  defaultStateValues,
  filterColumnConfigs,
  dtfOptions,
  dtfFacetedData,
}: DataTableRouterFormProps<TData, TValue>) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const { urlState, setUrlState } = useDataTableUrlState();

  const methods = useRemixForm<DataTableRouterState>({
    defaultValues: urlState,
  });

  const {
    columns: dtfGeneratedColumns,
    filters: dtfInternalFilters, // Filters state internal to useDataTableFilters
    actions: dtfActions,
    strategy: dtfStrategyReturned,
  } = useDataTableFilters({
    strategy: 'server',
    data: data,
    // Cast to the exact parameter type to preserve strong typing without using `any`
    columnsConfig: filterColumnConfigs as Parameters<typeof useDataTableFilters>[0]['columnsConfig'],
    options: dtfOptions as Parameters<typeof useDataTableFilters>[0]['options'],
    faceted: dtfFacetedData as Parameters<typeof useDataTableFilters>[0]['faceted'],
    filters: urlState.filters, // Use URL filters as the source of truth
    onFiltersChange: (newFilters) => {
      // Update URL state when filters change
      setUrlState({ filters: newFilters as BazzaFiltersState, page: 0 });
    },
  });

  // Sync URL filters TO Bazza internal filters (e.g., on back/forward nav)
  // This is now handled by the controlled state pattern with filters and onFiltersChange

  // Sync RHF state if urlState changes (e.g., back/forward, external link)
  useEffect(() => {
    if (JSON.stringify(urlState) !== JSON.stringify(methods.getValues())) {
      methods.reset(urlState);
    }
  }, [urlState, methods]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: [{ id: urlState.sortField, desc: urlState.sortOrder === 'desc' }],
      // columnFilters: urlState.filters as ColumnFilter[], // REMOVED: Filtering is server-side
      pagination: { pageIndex: urlState.page, pageSize: urlState.pageSize },
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true, // Crucial for server-side filtering
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Still useful for table structure
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // If using any client-side faceting with TST
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onSortingChange: (updater) => {
      const currentSorting = table.getState().sorting;
      const sorting = typeof updater === 'function' ? updater(currentSorting) : updater;
      setUrlState({
        sortField: sorting[0]?.id ?? '',
        sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        page: 0,
      });
    },
    // onColumnFiltersChange: // REMOVED: Not used for server-side filtering control
  });

  const defaultDataTableState = getDefaultDataTableState(defaultStateValues);
  const visibleColumns = table.getVisibleFlatColumns();
  const skeletonRowIds = useMemo(() => {
    const count = urlState.pageSize > 0 ? urlState.pageSize : defaultDataTableState.pageSize;
    return Array.from({ length: count }, () => window.crypto.randomUUID());
  }, [urlState.pageSize, defaultDataTableState.pageSize]);

  const handlePaginationChange = useCallback(
    (pageIndex: number, newPageSize: number) => {
      setUrlState({ page: pageIndex, pageSize: newPageSize });
    },
    [setUrlState],
  );

  const standardStateValues = getDefaultDataTableState(defaultStateValues);

  const paginationProps = {
    pageCount: pageCount || 0,
    onPaginationChange: handlePaginationChange,
  };

  const handleSearchChange = (newSearch: string) => {
    setUrlState({ search: newSearch, page: 0 });
  };

  const handleResetFiltersAndSearch = () => {
    if (dtfActions.removeAllFilters) {
      dtfActions.removeAllFilters(); // Use the action from useDataTableFilters
    }
    // Then update URL, which will also clear Bazza filters via the effect if setFiltersState was not called
    setUrlState({
      ...standardStateValues,
      search: '',
      filters: [],
    });
  };

  const hasActiveBazzaFilters = dtfInternalFilters && dtfInternalFilters.length > 0;
  const hasActiveSearch = !!urlState.search;
  const hasActiveFiltersOrSearch = hasActiveBazzaFilters || hasActiveSearch;

  return (
    <RemixFormProvider {...methods}>
      <div className="space-y-4">
        <DataTableRouterToolbar<TData>
          table={table}
          search={urlState.search}
          onSearchChange={handleSearchChange}
          onResetFiltersAndSearch={handleResetFiltersAndSearch}
          hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
          // Pass Bazza UI filter props
          dtfColumns={dtfGeneratedColumns} // Generated by useDataTableFilters
          dtfFilters={dtfInternalFilters as BazzaFiltersState} // Display Bazza's current internal state
          dtfActions={dtfActions}
          dtfStrategy={dtfStrategyReturned || 'server'}
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
                skeletonRowIds.map((rowId) => (
                  <TableRow key={rowId} className="even:bg-gray-50">
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="py-2">
                        <div className="h-6 my-1.5 bg-gray-200 rounded animate-pulse w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="even:bg-gray-50">
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
