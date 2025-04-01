import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';

import { Button } from '../button';
import { TextInput } from '../text-input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFilterFactory } from './data-table-filter-factory';

interface DataTableNuqsToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: keyof TData;
    title: string;
    type?: 'select' | 'number' | 'date' | 'text';
    options?: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
    schema?: z.ZodType<any>;
    placeholder?: string;
  }[];
  searchableColumns?: {
    id: keyof TData;
    title: string;
    schema?: z.ZodType<any>;
  }[];
  search: string;
  setSearch: (value: string) => void;
}

export function DataTableNuqsToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  search,
  setSearch,
}: DataTableNuqsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || search !== '';

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
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                  />
                </React.Fragment>
              ),
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id as string) && (
                <DataTableFilterFactory
                  key={column.id as string}
                  column={table.getColumn(column.id as string)}
                  title={column.title}
                  type={column.type || 'select'}
                  options={column.options || []}
                  schema={column.schema}
                  placeholder={column.placeholder}
                />
              ),
          )}
        {isFiltered && (
          <Button 
            variant="ghost" 
            onClick={() => {
              table.resetColumnFilters();
              setSearch('');
            }} 
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