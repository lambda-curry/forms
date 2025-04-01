import type { Column } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';
import { useQueryState, createParser } from 'nuqs';

import { Badge } from '../badge';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { numberFilterSchema } from './data-table-schemas';

// Create a parser for number range values
const parseAsNumberRange = createParser({
  parse: (value) => {
    try {
      return JSON.parse(value) as { min?: number; max?: number };
    } catch (e) {
      return {};
    }
  },
  serialize: (value) => JSON.stringify(value),
});

interface DataTableNumberFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  schema?: z.ZodType<any>;
}

export function DataTableNumberFilter<TData, TValue>({
  column,
  title,
  schema = numberFilterSchema,
}: DataTableNumberFilterProps<TData, TValue>) {
  const columnId = column?.id || '';
  
  // Use nuqs for URL state management
  const [range, setRange] = useQueryState(
    `filter_${columnId}`,
    parseAsNumberRange.withDefault({})
  );

  const [localMin, setLocalMin] = React.useState<string>(range.min?.toString() || '');
  const [localMax, setLocalMax] = React.useState<string>(range.max?.toString() || '');

  // Set column filter when range changes
  React.useEffect(() => {
    if (column) {
      if (range.min !== undefined || range.max !== undefined) {
        column.setFilterValue(range);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [column, range]);

  const handleApply = () => {
    const newRange: { min?: number; max?: number } = {};
    
    if (localMin !== '') {
      const min = Number(localMin);
      if (!isNaN(min)) {
        newRange.min = min;
      }
    }
    
    if (localMax !== '') {
      const max = Number(localMax);
      if (!isNaN(max)) {
        newRange.max = max;
      }
    }
    
    try {
      // Validate with zod schema
      schema.parse(newRange);
      setRange(newRange);
    } catch (error) {
      // If validation fails, don't update
      console.error('Validation error:', error);
    }
  };

  const handleReset = () => {
    setLocalMin('');
    setLocalMax('');
    setRange({});
  };

  const hasValue = range.min !== undefined || range.max !== undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" type="button">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {hasValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {range.min !== undefined && range.max !== undefined
                  ? `${range.min} - ${range.max}`
                  : range.min !== undefined
                  ? `≥ ${range.min}`
                  : `≤ ${range.max}`}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filter by {title}</h4>
            <div className="flex items-center space-x-2">
              <TextInput
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                type="number"
                className="h-8"
              />
              <span>to</span>
              <TextInput
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                type="number"
                className="h-8"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handleReset} className="h-8">
              Reset
            </Button>
            <Button size="sm" onClick={handleApply} className="h-8">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}