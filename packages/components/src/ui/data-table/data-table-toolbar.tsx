import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';
import type * as React from 'react';

import { Button } from '../button';
import { TextInput } from '../text-input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
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

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableToolbarProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const globalFilter = searchParams.get('search') || '';

  const resetFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams, { replace: true });
    table.resetColumnFilters();
  };

  const updateSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
    
    searchableColumns.forEach((column) => {
      table.getColumn(column.id as string)?.setFilterValue(value);
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && (
          <TextInput
            placeholder="Search..."
            value={globalFilter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              updateSearch(event.target.value);
            }}
            className="h-10 w-[150px] lg:w-[250px]"
          />
        )}
        {filterableColumns.length > 0 &&
          filterableColumns.map((column) => {
            const tableColumn = table.getColumn(column.id as string);
            return tableColumn ? (
              <DataTableFacetedFilter
                key={column.id as string}
                column={tableColumn}
                title={column.title}
                options={column.options}
              />
            ) : null;
          })}
        {globalFilter && (
          <Button variant="ghost" onClick={resetFilters} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions columns={table.getAllColumns()} />
    </div>
  );
}
