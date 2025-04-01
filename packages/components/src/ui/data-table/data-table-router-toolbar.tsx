import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '../button';
import { TextInput } from '../text-input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { debounce } from '../utils/debounce';

interface DataTableRouterToolbarProps<TData> {
  table: Table<TData>;
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
}

export function DataTableRouterToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableRouterToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchParams] = useSearchParams();

  const debouncedSearchHandlers = React.useMemo(() => {
    const handlers: Record<string, (value: string) => void> = {};
    
    searchableColumns.forEach((column) => {
      const columnId = column.id as string;
      handlers[columnId] = debounce((value: string) => {
        table.getColumn(columnId)?.setFilterValue(value);
      }, 300);
    });
    
    return handlers;
  }, [searchableColumns, table]);

  const getSearchValue = React.useCallback((columnId: string) => {
    const searchKey = `search_${columnId}`;
    return searchParams.get(searchKey) || '';
  }, [searchParams]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id as string) && (
                <React.Fragment key={column.id as string}>
                  <TextInput
                    placeholder={`Search ${column.title}...`}
                    value={getSearchValue(column.id as string)}
                    onChange={(event) => {
                      debouncedSearchHandlers[column.id as string](event.target.value);
                    }}
                    className="h-8 w-[150px] lg:w-[250px]"
                  />
                </React.Fragment>
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id as string) && (
                <DataTableFacetedFilter
                  key={column.id as string}
                  column={table.getColumn(column.id as string)}
                  title={column.title}
                  options={column.options}
                />
              ),
          )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3" type="button">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
