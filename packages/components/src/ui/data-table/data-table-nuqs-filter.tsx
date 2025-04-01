import type { Column } from '@tanstack/react-table';
import { Check, PlusCircle } from 'lucide-react';
import * as React from 'react';
import { z } from 'zod';
import { useQueryState, createParser } from 'nuqs';

import { Badge } from '../badge';
import { Button } from '../button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { cn } from '../utils';

// Create a parser for array values
const parseAsStringArray = createParser({
  parse: (value) => {
    try {
      return JSON.parse(value) as string[];
    } catch (e) {
      return [];
    }
  },
  serialize: (value) => JSON.stringify(value),
});

interface DataTableNuqsFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  schema?: z.ZodType<any>;
}

export function DataTableNuqsFilter<TData, TValue>({
  column,
  title,
  options,
  schema,
}: DataTableNuqsFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const columnId = column?.id || '';
  
  // Use nuqs for URL state management
  const [selectedValues, setSelectedValues] = useQueryState(
    `filter_${columnId}`,
    parseAsStringArray.withDefault([])
  );

  // Set column filter when selectedValues change
  React.useEffect(() => {
    if (column) {
      if (selectedValues.length > 0) {
        column.setFilterValue(selectedValues);
      } else {
        column.setFilterValue(undefined);
      }
    }
  }, [column, selectedValues]);

  // Validate values with zod schema if provided
  const validateValue = (value: string) => {
    if (!schema) return true;
    try {
      schema.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSelect = (value: string) => {
    const isSelected = selectedValues.includes(value);
    let newValues: string[];
    
    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      if (validateValue(value)) {
        newValues = [...selectedValues, value];
      } else {
        // If validation fails, don't add the value
        return;
      }
    }
    
    setSelectedValues(newValues);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed" type="button">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedValues([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}