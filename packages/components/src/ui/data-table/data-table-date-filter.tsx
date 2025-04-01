import type { Column } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';
import { useQueryState, createParser } from 'nuqs';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Badge } from '../badge';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { dateFilterSchema } from './data-table-schemas';

// Create a parser for date range values
const parseAsDateRange = createParser({
  parse: (value) => {
    try {
      return JSON.parse(value) as { from?: string; to?: string };
    } catch (e) {
      return {};
    }
  },
  serialize: (value) => JSON.stringify(value),
});

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  schema?: z.ZodType<any>;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title,
  schema = dateFilterSchema,
}: DataTableDateFilterProps<TData, TValue>) {
  const columnId = column?.id || '';
  
  // Use nuqs for URL state management
  const [dateRange, setDateRange] = useQueryState(
    `filter_${columnId}`,
    parseAsDateRange.withDefault({})
  );

  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    dateRange.from ? new Date(dateRange.from) : undefined
  );
  const [toDate, setToDate] = React.useState<Date | undefined>(
    dateRange.to ? new Date(dateRange.to) : undefined
  );

  // Set column filter when dateRange changes
  React.useEffect(() => {
    if (column) {
      if (dateRange.from || dateRange.to) {
        column.setFilterValue(dateRange);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [column, dateRange]);

  const handleApply = () => {
    const newRange: { from?: string; to?: string } = {};
    
    if (fromDate) {
      newRange.from = fromDate.toISOString();
    }
    
    if (toDate) {
      newRange.to = toDate.toISOString();
    }
    
    try {
      // Validate with zod schema
      schema.parse(newRange);
      setDateRange(newRange);
    } catch (error) {
      // If validation fails, don't update
      console.error('Validation error:', error);
    }
  };

  const handleReset = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setDateRange({});
  };

  const hasValue = Boolean(dateRange.from || dateRange.to);

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
                {dateRange.from && dateRange.to
                  ? `${format(new Date(dateRange.from), 'PP')} - ${format(new Date(dateRange.to), 'PP')}`
                  : dateRange.from
                  ? `After ${format(new Date(dateRange.from), 'PP')}`
                  : `Before ${format(new Date(dateRange.to!), 'PP')}`}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Filter by {title}</h4>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>From</span>
                </div>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>To</span>
                </div>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </div>
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