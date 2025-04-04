import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import type { ChangeEvent, ComponentType } from 'react';
import { useCallback } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { cn } from '../ui';
import { Button } from '../ui/button';
import { DataTableFacetedFilter } from '../ui/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '../ui/data-table/data-table-view-options';
import type { DataTableRouterState, FilterValue } from './data-table-router-parsers';
import { TextField } from './text-field';

export interface DataTableRouterToolbarProps<TData> {
  className?: string;
  table: Table<TData>;
  filterableColumns?: {
    id: keyof TData;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: ComponentType<{ className?: string }>;
    }[];
  }[];
  searchableColumns?: {
    id: keyof TData;
    title: string;
  }[];
  setUrlState: (newState: Partial<DataTableRouterState>) => void;
  defaultStateValues: DataTableRouterState;
}

export function DataTableRouterToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  className,
  setUrlState,
  defaultStateValues,
}: DataTableRouterToolbarProps<TData>) {
  let watchedSearch = '';
  let watchedFilters: FilterValue[] = [];
  
  try {
    const { watch } = useRemixFormContext<DataTableRouterState>();
    watchedSearch = watch('search') || '';
    watchedFilters = watch('filters') || [];
  } catch (error) {
    console.warn('RemixFormProvider context not found in DataTableRouterToolbar. Form state will not be available.');
    watchedSearch = defaultStateValues.search || '';
    watchedFilters = defaultStateValues.filters || [];
  }

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUrlState({ search: event.target.value || null, page: 0 });
    },
    [setUrlState],
  );

  const handleFilterUpdate = useCallback(
    (columnId: string, value: unknown) => {
      const currentFilters = watchedFilters || [];
      let newFilters: FilterValue[];
      const existingFilterIndex = currentFilters.findIndex((f: FilterValue) => f.id === columnId);

      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
        newFilters = currentFilters.filter((f: FilterValue) => f.id !== columnId);
      } else if (existingFilterIndex > -1) {
        newFilters = [
          ...currentFilters.slice(0, existingFilterIndex),
          { id: columnId, value },
          ...currentFilters.slice(existingFilterIndex + 1),
        ];
      } else {
        newFilters = [...currentFilters, { id: columnId, value }];
      }
      setUrlState({ filters: newFilters.length > 0 ? newFilters : null, page: 0 });
    },
    [setUrlState, watchedFilters],
  );

  const handleReset = useCallback(() => {
    setUrlState({
      ...defaultStateValues,
      search: null,
      filters: null,
    });
  }, [setUrlState, defaultStateValues]);

  const isFiltered = Boolean(watchedSearch) || (watchedFilters?.length || 0) > 0;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchableColumns.length > 0 && (
            <TextField
              name="search"
              placeholder={`Filter ${searchableColumns.map((c) => c.title).join(', ')}...`}
              onChange={handleSearchChange}
              className="w-[150px] lg:w-[250px]"
              suffix={
                watchedSearch ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2"
                    onClick={() => setUrlState({ search: null, page: 0 })}
                  >
                    <Cross2Icon className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                ) : null
              }
            />
          )}

          {filterableColumns.map((column) => {
            const tableColumn = table.getColumn(String(column.id));
            if (!tableColumn) return null;
            const currentFilterValue = watchedFilters?.find((f: FilterValue) => f.id === String(column.id))?.value;
            return (
              <DataTableFacetedFilter
                key={String(column.id)}
                column={tableColumn}
                title={column.title}
                options={column.options}
                initialValue={currentFilterValue as string[]}
                onValueChange={(value: string[] | undefined) => handleFilterUpdate(String(column.id), value)}
              />
            );
          })}

          {isFiltered && (
            <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions columns={table.getAllColumns().filter((col) => col.getCanHide())} />
      </div>
    </div>
  );
}
