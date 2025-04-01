import type { Column } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';
import { useQueryState, parseAsString } from 'nuqs';

import { Badge } from '../badge';
import { Button } from '../button';
import { TextInput } from '../text-input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { textFilterSchema } from './data-table-schemas';

interface DataTableTextFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  placeholder?: string;
  schema?: z.ZodType<any>;
}

export function DataTableTextFilter<TData, TValue>({
  column,
  title,
  placeholder = 'Filter...',
  schema = textFilterSchema,
}: DataTableTextFilterProps<TData, TValue>) {
  const columnId = column?.id || '';
  
  // Use nuqs for URL state management
  const [value, setValue] = useQueryState(
    `filter_${columnId}`,
    parseAsString.withDefault('')
  );

  const [localValue, setLocalValue] = React.useState<string>(value);

  // Set column filter when value changes
  React.useEffect(() => {
    if (column) {
      if (value) {
        column.setFilterValue(value);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [column, value]);

  // Update local value when URL value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleApply = () => {
    try {
      // Validate with zod schema
      schema.parse(localValue);
      setValue(localValue);
    } catch (error) {
      // If validation fails, don't update
      console.error('Validation error:', error);
    }
  };

  const handleReset = () => {
    setLocalValue('');
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" type="button">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {value && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {value}
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
                placeholder={placeholder}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8"
              />
              {localValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocalValue('')}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
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