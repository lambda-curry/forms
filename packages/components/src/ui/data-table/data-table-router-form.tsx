import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { createSearchParamsCache, useQueryState } from 'nuqs';
import * as React from 'react';
import { z } from 'zod';

import { Button } from '../button';
import { Input } from '../input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { cn } from '../utils';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

// Define Zod schemas for query parameters
const sortSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

const filterSchema = z.object({
  id: z.string(),
  value: z.array(z.string()),
});

const paginationSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1),
});

const searchSchema = z.object({
  value: z.string(),
  column: z.string(),
});

// Create a cache for search params
const cache = createSearchParamsCache();

interface DataTableRouterFormProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount?: number;
  formAction?: string;
  formMethod?: 'get' | 'post';
  defaultSort?: { id: string; desc: boolean };
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  isLoading?: boolean;
}

export function DataTableRouterForm<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  formAction = '/',
  formMethod = 'get',
  defaultSort,
  filterableColumns = [],
  searchableColumns = [],
  isLoading = false,
}: DataTableRouterFormProps<TData, TValue>) {
  const searchParams = useSearchParams();
  
  // Initialize state with values from URL or defaults
  const [sorting, setSorting] = useQueryState(
    'sort',
    cache.json(sortSchema).withDefault(defaultSort ? [defaultSort] : [])
  );
  
  const [columnFilters, setColumnFilters] = useQueryState(
    'filters',
    cache.json(z.array(filterSchema)).withDefault([])
  );
  
  const [pagination, setPagination] = useQueryState(
    'pagination',
    cache.json(paginationSchema).withDefault({
      pageIndex: 0,
      pageSize: 10,
    })
  );
  
  const [search, setSearch] = useQueryState(
    'search',
    cache.json(searchSchema.partial()).withDefault({})
  );
  
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Create a form ref to submit the form
  const formRef = React.useRef<HTMLFormElement>(null);

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
      setColumnFilters(newFilters);
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  // Handle search input change
  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const column = searchableColumns[0]?.id || '';
      setSearch(value ? { value, column } : {});
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    },
    [searchableColumns, setSearch]
  );

  // Create hidden inputs for form submission
  const renderHiddenInputs = () => {
    const inputs = [];

    // Add sorting inputs
    if (sorting.length > 0) {
      inputs.push(
        <input
          key="sortField"
          type="hidden"
          name="sortField"
          value={sorting[0].id}
        />,
        <input
          key="sortOrder"
          type="hidden"
          name="sortOrder"
          value={sorting[0].desc ? 'desc' : 'asc'}
        />
      );
    }

    // Add pagination inputs
    inputs.push(
      <input
        key="page"
        type="hidden"
        name="page"
        value={pagination.pageIndex.toString()}
      />,
      <input
        key="pageSize"
        type="hidden"
        name="pageSize"
        value={pagination.pageSize.toString()}
      />
    );

    // Add filter inputs
    columnFilters.forEach((filter) => {
      if (Array.isArray(filter.value)) {
        filter.value.forEach((value, i) => {
          inputs.push(
            <input
              key={`${filter.id}-${i}`}
              type="hidden"
              name={filter.id}
              value={value}
            />
          );
        });
      }
    });

    // Add search input
    if (search.value && search.column) {
      inputs.push(
        <input
          key="search"
          type="hidden"
          name="search"
          value={search.value}
        />
      );
    }

    return inputs;
  };

  return (
    <div className="space-y-4">
      <form
        ref={formRef}
        action={formAction}
        method={formMethod}
        className="flex items-center justify-between"
      >
        {renderHiddenInputs()}

        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 && (
            <div className="flex items-center">
              <Input
                placeholder={`Search ${searchableColumns[0]?.title || ''}...`}
                value={search.value || ''}
                onChange={handleSearchChange}
                className="h-8 w-[150px] lg:w-[250px]"
              />
              {search.value && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch({});
                    if (formRef.current) {
                      formRef.current.requestSubmit();
                    }
                  }}
                  className="h-8 px-2 lg:px-3"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          )}

          {filterableColumns.length > 0 &&
            filterableColumns.map((column) => {
              // Find the column filter
              const columnFilter = columnFilters.find(
                (filter) => filter.id === column.id
              );
              
              return (
                <DataTableFacetedFilter
                  key={column.id}
                  title={column.title}
                  options={column.options}
                  formMode={true}
                />
              );
            })}
        </div>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}