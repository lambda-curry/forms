import { Cross2Icon, MixerHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';
import { type ChangeEvent, useCallback } from 'react';
import { useFormContext } from 'remix-hook-form';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTableFacetedFilter } from '../ui/data-table/data-table-faceted-filter';
import { DataTableViewOptions } from '../ui/data-table/data-table-view-options';
import { type DataTableRouterState } from './data-table-router-parsers';

export interface DataTableFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData | string;
  title: string;
  options: DataTableFilterOption[];
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData | string;
  title: string;
}

export interface DataTableRouterToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: DataTableFilterableColumn<TData>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  setUrlState: (state: Partial<DataTableRouterState>) => void;
  defaultStateValues: DataTableRouterState;
}

export function DataTableRouterToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  setUrlState,
  defaultStateValues,
}: DataTableRouterToolbarProps<TData>) {
  const { watch } = useFormContext();
  const watchedFilters = watch('filters') || [];
  const watchedSearch = watch('search') || '';

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUrlState({ search: event.target.value || '', page: 0 });
    },
    [setUrlState],
  );

  const handleFilterChange = useCallback(
    (columnId: string, value: string[]) => {
      const currentFilters = [...watchedFilters];
      const existingFilterIndex = currentFilters.findIndex((filter) => filter.id === columnId);
      let newFilters;

      if (value.length === 0) {
        // Remove filter if no values selected
        if (existingFilterIndex !== -1) {
          newFilters = currentFilters.filter((_, index) => index !== existingFilterIndex);
        } else {
          newFilters = currentFilters;
        }
      } else {
        // Add or update filter
        if (existingFilterIndex !== -1) {
          newFilters = [...currentFilters];
          newFilters[existingFilterIndex] = { id: columnId, value };
        } else {
          newFilters = [...currentFilters, { id: columnId, value }];
        }
      }
      setUrlState({ filters: newFilters, page: 0 });
    },
    [setUrlState, watchedFilters],
  );

  const handleReset = useCallback(() => {
    setUrlState({
      ...defaultStateValues,
      search: '',
      filters: [],
    });
  }, [setUrlState, defaultStateValues]);

  const hasFiltersOrSearch = watchedFilters.length > 0 || watchedSearch.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      {searchableColumns.length > 0 && (
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder={`Search ${searchableColumns.map((column) => column.title).join(', ')}...`}
              value={watchedSearch}
              onChange={handleSearchChange}
              className="h-8 w-full"
            />
            {watchedSearch && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2"
                  onClick={() => setUrlState({ search: '', page: 0 })}
                >
                  <Cross2Icon className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-2">
        {filterableColumns.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {filterableColumns.map((column) => {
              // Find the current filter value for this column
              const currentFilter = watchedFilters.find((filter) => filter.id === column.id);
              const selectedValues = (currentFilter?.value as string[]) || [];

              return (
                <DataTableFacetedFilter
                  key={column.id}
                  column={column}
                  title={column.title}
                  options={column.options}
                  selectedValues={selectedValues}
                  onValuesChange={(values) => handleFilterChange(column.id as string, values)}
                />
              );
            })}
          </div>
        )}

        {/* Reset Button */}
        {hasFiltersOrSearch && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* View Options */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
