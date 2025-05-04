import * as React from 'react';
import { type ColumnDef, type RowData } from '@tanstack/react-table';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '../button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Badge } from '../badge';
import { cn } from '../utils';
import { type ColumnMeta, type FilterOperator, type FilterValue } from './types';
import { useTranslation } from './i18n';

interface QuickSearchFilterProps<TData extends RowData> {
  column: ColumnDef<TData, any>;
  meta: ColumnMeta<TData, any>;
  filterValue?: FilterValue;
  onFilterChange: (columnId: string, operator: FilterOperator, values: any) => void;
  locale?: string;
}

export function QuickSearchFilter<TData extends RowData>({
  column,
  meta,
  filterValue,
  onFilterChange,
  locale = 'en',
}: QuickSearchFilterProps<TData>) {
  const { t } = useTranslation(locale);
  const [open, setOpen] = React.useState(false);
  
  // Only render for option and multiOption columns
  if (meta.type !== 'option' && meta.type !== 'multiOption') {
    return null;
  }
  
  // Get options for the column
  const options = meta.options || [];
  if (options.length === 0) {
    return null;
  }
  
  // Get selected values
  const selectedValues = filterValue?.values || [];
  const isMulti = meta.type === 'multiOption';
  
  // Handle selection change
  const handleSelect = (value: string) => {
    if (isMulti) {
      // For multiOption, toggle the value in the array
      const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      onFilterChange(column.id as string, 'in', newValues.length > 0 ? newValues : undefined);
    } else {
      // For option, set or clear the value
      onFilterChange(column.id as string, 'eq', value === selectedValues ? undefined : value);
    }
  };
  
  // Clear all selected values
  const handleClear = () => {
    onFilterChange(column.id as string, isMulti ? 'in' : 'eq', undefined);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-8 border-dashed',
            (isMulti ? (Array.isArray(selectedValues) && selectedValues.length > 0) : selectedValues) && 'bg-muted/50'
          )}
        >
          <div className="flex items-center gap-1">
            {meta.icon && <meta.icon className="mr-1 h-3.5 w-3.5" />}
            <span>{meta.displayName}</span>
            
            {/* Show badge for selected values */}
            {isMulti ? (
              Array.isArray(selectedValues) && selectedValues.length > 0 && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal ml-1">
                  {selectedValues.length}
                </Badge>
              )
            ) : (
              selectedValues && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal ml-1">
                  {options.find((opt) => opt.value === selectedValues)?.label || selectedValues}
                </Badge>
              )
            )}
            
            <ChevronsUpDown className="ml-1 h-3.5 w-3.5" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('search')} />
          <CommandEmpty>{t('noResults')}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = isMulti
                ? Array.isArray(selectedValues) && selectedValues.includes(option.value)
                : selectedValues === option.value;
              
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center"
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                    )}
                  >
                    <Check className={cn('h-4 w-4')} />
                  </div>
                  {option.icon && (
                    <div className="mr-2 h-4 w-4">
                      {React.isValidElement(option.icon)
                        ? option.icon
                        : React.createElement(option.icon as React.ComponentType<{ className?: string }>, {
                            className: 'h-4 w-4',
                          })}
                    </div>
                  )}
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          {((isMulti && Array.isArray(selectedValues) && selectedValues.length > 0) || (!isMulti && selectedValues)) && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-full justify-center text-xs"
                onClick={() => {
                  handleClear();
                  setOpen(false);
                }}
              >
                {t('clearFilter')}
                <X className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

