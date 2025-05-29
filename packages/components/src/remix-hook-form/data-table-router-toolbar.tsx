import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { type ChangeEvent, useCallback } from 'react';

import { Button } from '../ui/button';
import { DataTableFilter } from '../ui/data-table-filter';
import { DataTableViewOptions } from '../ui/data-table/data-table-view-options';
import type { BazzaFiltersState } from './data-table-router-parsers';
import { TextField } from './text-field';

export interface DataTableRouterToolbarProps<TData> {
  table: Table<TData>;
  search?: string;
  onSearchChange: (newSearch: string) => void;
  onResetFiltersAndSearch: () => void;
  hasActiveFiltersOrSearch: boolean;

  dtfColumns: any[];
  dtfFilters: BazzaFiltersState;
  dtfActions: any;
  dtfStrategy: 'client' | 'server';
}

export function DataTableRouterToolbar<TData>({
  table,
  search,
  onSearchChange,
  onResetFiltersAndSearch,
  hasActiveFiltersOrSearch,
  dtfColumns,
  dtfFilters,
  dtfActions,
  dtfStrategy,
}: DataTableRouterToolbarProps<TData>) {
  const handleSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onSearchChange(event.target.value || '');
    },
    [onSearchChange],
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Global Search (kept separate from bazza/ui column filters) */}
      <div className="relative flex-1">
        <TextField
          name="search"
          placeholder="Search..."
          value={search}
          onChange={handleSearchInputChange}
          className="w-full pr-10"
          suffix={
            search ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full w-8 px-2 flex items-center justify-center"
                onClick={handleClearSearch}
                type="button"
              >
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            ) : null
          }
        />
      </div>

      {/* Bazza UI Filters */}
      <div className="flex items-center space-x-2">
        <DataTableFilter columns={dtfColumns} filters={dtfFilters} actions={dtfActions} strategy={dtfStrategy} />

        {/* Reset Button - clears both bazza filters (via action) and global search */}
        {hasActiveFiltersOrSearch && (
          <Button variant="ghost" onClick={onResetFiltersAndSearch} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {/* View Options - uses TanStack table instance */}
        <DataTableViewOptions columns={table.getAllColumns()} />
      </div>
    </div>
  );
}
