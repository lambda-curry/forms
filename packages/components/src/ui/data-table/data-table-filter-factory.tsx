import type { Column } from '@tanstack/react-table';
import * as React from 'react';
import { z } from 'zod';

import { DataTableNuqsFilter } from './data-table-nuqs-filter';
import { DataTableNumberFilter } from './data-table-number-filter';
import { DataTableDateFilter } from './data-table-date-filter';
import { DataTableTextFilter } from './data-table-text-filter';

type FilterType = 'select' | 'number' | 'date' | 'text';

interface DataTableFilterFactoryProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  type: FilterType;
  options?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  schema?: z.ZodType<any>;
  placeholder?: string;
}

export function DataTableFilterFactory<TData, TValue>({
  column,
  title,
  type,
  options = [],
  schema,
  placeholder,
}: DataTableFilterFactoryProps<TData, TValue>) {
  switch (type) {
    case 'select':
      return (
        <DataTableNuqsFilter
          column={column}
          title={title}
          options={options}
          schema={schema}
        />
      );
    case 'number':
      return (
        <DataTableNumberFilter
          column={column}
          title={title}
          schema={schema}
        />
      );
    case 'date':
      return (
        <DataTableDateFilter
          column={column}
          title={title}
          schema={schema}
        />
      );
    case 'text':
    default:
      return (
        <DataTableTextFilter
          column={column}
          title={title}
          placeholder={placeholder}
          schema={schema}
        />
      );
  }
}