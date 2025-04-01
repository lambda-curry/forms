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
import { Form, useNavigation } from 'react-router-dom';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRouterToolbar } from './data-table-router-toolbar';
import { useDataTableUrlState } from './data-table-hooks';
import { type DataTableFilterParams } from './data-table-schema';

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
  debounceMs?: number;
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
  debounceMs = 300,
}: DataTableRouterFormProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  const { filterState, updateFilterState } = useDataTableUrlState<TData>({
    filterableColumns,
    searchableColumns,
    defaultSort,
    debounceMs,
  });
  
  const columnFilters = React.useMemo(() => {
    const filters: ColumnFiltersState = [];
    
    filterableColumns.forEach((column) => {
      const columnId = String(column.id);
      const filterValues = filterState[columnId];
      
      if (filterValues && Array.isArray(filterValues) && filterValues.length > 0) {
        filters.push({
          id: columnId,
          value: filterValues,
        });
      }
    });
    
    searchableColumns.forEach((column) => {
      const columnId = String(column.id);
      const searchValue = filterState[`search_${columnId}`];
      
      if (searchValue) {
        filters.push({
          id: columnId,
          value: searchValue,
        });
      }
    });
    
    if (filterState.search) {
      filters.push({
        id: 'global',
        value: filterState.search,
      });
    }
    
    return filters;
  }, [filterState, filterableColumns, searchableColumns]);
  
  const sorting = React.useMemo(() => {
    const sortState: SortingState = [];
    
    if (filterState.sortField) {
      sortState.push({
        id: filterState.sortField,
        desc: filterState.sortOrder === 'desc',
      });
    }
    
    return sortState;
  }, [filterState]);

  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' || navigation.state === 'submitting';

  const handleColumnFiltersChange = React.useCallback((filters: ColumnFiltersState) => {
    const updates: Partial<DataTableFilterParams> = {};
    
    filterableColumns.forEach((column) => {
      updates[String(column.id)] = undefined;
    });
    
    searchableColumns.forEach((column) => {
      updates[`search_${String(column.id)}`] = undefined;
    });
    
    updates.search = undefined;
    
    filters.forEach((filter) => {
      if (filter.id === 'global') {
        updates.search = filter.value as string;
      } else if (searchableColumns.some(col => String(col.id) === filter.id)) {
        updates[`search_${filter.id}`] = filter.value as string;
      } else {
        updates[filter.id] = filter.value as string[];
      }
    });
    
    updateFilterState(updates);
  }, [filterableColumns, searchableColumns, updateFilterState]);
  
  const handleSortingChange = React.useCallback((newSorting: SortingState) => {
    if (newSorting.length > 0) {
      updateFilterState({
        sortField: newSorting[0].id,
        sortOrder: newSorting[0].desc ? 'desc' : 'asc',
      });
    } else {
      updateFilterState({
        sortField: undefined,
        sortOrder: 'asc',
      });
    }
  }, [updateFilterState]);
  
  const handlePaginationChange = React.useCallback((pageIndex: number, pageSize: number) => {
    updateFilterState({
      page: pageIndex,
      pageSize,
    });
  }, [updateFilterState]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: filterState.page,
        pageSize: filterState.pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      handlePaginationChange(pageIndex, pageSize);
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
      <Form id="data-table-router-form" method={formMethod} action={formAction}>
        <DataTableRouterToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
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
      </Form>

      <DataTablePagination table={table} onPaginationChange={handlePaginationChange} />
    </div>
  );
}
