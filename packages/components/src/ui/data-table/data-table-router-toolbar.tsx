import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '../button';
import { TextInput } from '../text-input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

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

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id as string) && (
                <React.Fragment key={column.id as string}>
                  <TextInput
                    name={`search-${column.id}`}
                    placeholder={`Search ${column.title}...`}
                    value={
                      (table.getColumn(column.id as string)?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                      table.getColumn(column.id as string)?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                  />
                  {/* Hidden input for form submission */}
                  <input
                    type="hidden"
                    name={`search`}
                    value={
                      (table.getColumn(column.id as string)?.getFilterValue() as string) ?? ''
                    }
                  />
                </React.Fragment>
              )
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
                  formMode={true}
                />
              )
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
            type="button"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}