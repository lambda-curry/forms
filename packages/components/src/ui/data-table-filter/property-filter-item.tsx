import * as React from 'react';
import { type ColumnDef, type RowData } from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '../button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../command';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { cn } from '../utils';
import { Slider } from '../slider';
import { DatePicker } from '../date-picker';
import { TextInput } from '../text-input';
import { Checkbox } from '../checkbox';
import { type ColumnDataType, type ColumnMeta, type ColumnOption, type FilterOperator, type FilterValue } from './types';
import { useTranslation } from './i18n';

interface PropertyFilterItemProps<TData extends RowData> {
  column: ColumnDef<TData, any>;
  meta: ColumnMeta<TData, any>;
  filterValue?: FilterValue;
  onFilterChange: (columnId: string, operator: FilterOperator, values: any) => void;
  locale?: string;
}

export function PropertyFilterItem<TData extends RowData>({
  column,
  meta,
  filterValue,
  onFilterChange,
  locale = 'en',
}: PropertyFilterItemProps<TData>) {
  const { t } = useTranslation(locale);
  const [operator, setOperator] = React.useState<FilterOperator>(
    filterValue?.operator || getDefaultOperator(meta.type)
  );
  
  // Get available operators for the column type
  const operators = React.useMemo(() => {
    return getOperatorsForType(meta.type).map((op) => ({
      label: t(`operators.${op}`),
      value: op,
    }));
  }, [meta.type, t]);
  
  // Handle operator change
  const handleOperatorChange = React.useCallback(
    (newOperator: FilterOperator) => {
      setOperator(newOperator);
      
      // Update filter with new operator and existing values
      if (filterValue?.values !== undefined) {
        onFilterChange(column.id as string, newOperator, filterValue.values);
      }
    },
    [column.id, filterValue, onFilterChange]
  );
  
  // Handle value change
  const handleValueChange = React.useCallback(
    (values: any) => {
      onFilterChange(column.id as string, operator, values);
    },
    [column.id, operator, onFilterChange]
  );
  
  // Render filter input based on column type
  const renderFilterInput = () => {
    switch (meta.type) {
      case 'text':
        return (
          <TextInput
            placeholder={t('enterValue')}
            value={filterValue?.values || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            className="h-8"
          />
        );
      
      case 'number':
        if (operator === 'between') {
          return (
            <div className="space-y-4">
              <Slider
                defaultValue={filterValue?.values || [0, meta.max || 100]}
                min={0}
                max={meta.max || 100}
                step={1}
                onValueChange={handleValueChange}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{meta.max || 100}</span>
              </div>
            </div>
          );
        }
        
        return (
          <TextInput
            type="number"
            placeholder={t('enterValue')}
            value={filterValue?.values || ''}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            className="h-8"
          />
        );
      
      case 'date':
        if (operator === 'between') {
          return (
            <div className="space-y-2">
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full justify-start text-left font-normal"
                    >
                      {filterValue?.values?.[0] ? new Date(filterValue.values[0]).toLocaleDateString() : t('startDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={filterValue?.values?.[0] ? new Date(filterValue.values[0]) : undefined}
                      onSelect={(date) => {
                        const endDate = filterValue?.values?.[1] ? new Date(filterValue.values[1]) : undefined;
                        handleValueChange([date, endDate]);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full justify-start text-left font-normal"
                    >
                      {filterValue?.values?.[1] ? new Date(filterValue.values[1]).toLocaleDateString() : t('endDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      mode="single"
                      selected={filterValue?.values?.[1] ? new Date(filterValue.values[1]) : undefined}
                      onSelect={(date) => {
                        const startDate = filterValue?.values?.[0] ? new Date(filterValue.values[0]) : undefined;
                        handleValueChange([startDate, date]);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        }
        
        return (
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-full justify-start text-left font-normal"
                >
                  {filterValue?.values ? new Date(filterValue.values).toLocaleDateString() : t('selectDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                  mode="single"
                  selected={filterValue?.values ? new Date(filterValue.values) : undefined}
                  onSelect={handleValueChange}
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      
      case 'option':
        return (
          <OptionSelector
            options={getColumnOptions(column, meta)}
            value={filterValue?.values as string}
            onChange={handleValueChange}
            placeholder={t('selectOption')}
          />
        );
      
      case 'multiOption':
        return (
          <MultiOptionSelector
            options={getColumnOptions(column, meta)}
            values={filterValue?.values as string[] || []}
            onChange={handleValueChange}
            placeholder={t('selectOptions')}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {meta.icon && <meta.icon className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium">{meta.displayName}</span>
        </div>
        <div className="ml-auto">
          <OperatorSelector
            operators={operators}
            value={operator}
            onChange={handleOperatorChange}
          />
        </div>
      </div>
      {renderFilterInput()}
      <Separator className="mt-2" />
    </div>
  );
}

// Helper component for selecting operators
function OperatorSelector({
  operators,
  value,
  onChange,
}: {
  operators: { label: string; value: FilterOperator }[];
  value: FilterOperator;
  onChange: (value: FilterOperator) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedOperator = operators.find((op) => op.value === value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
        >
          {selectedOperator?.label || 'Select'}
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandGroup>
            {operators.map((op) => (
              <CommandItem
                key={op.value}
                onSelect={() => {
                  onChange(op.value);
                  setOpen(false);
                }}
              >
                {op.label}
                {op.value === value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Helper component for selecting a single option
function OptionSelector({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: ColumnOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((op) => op.value === value);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-full justify-between"
        >
          {selectedOption ? (
            <div className="flex items-center gap-2">
              {selectedOption.icon && (
                <div className="h-4 w-4">
                  {React.isValidElement(selectedOption.icon)
                    ? selectedOption.icon
                    : React.createElement(selectedOption.icon as React.ComponentType<{ className?: string }>, {
                        className: 'h-4 w-4',
                      })}
                </div>
              )}
              {selectedOption.label}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No options found</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.icon && (
                  <div className="mr-2 h-4 w-4">
                    {React.isValidElement(option.icon)
                      ? option.icon
                      : React.createElement(option.icon as React.ComponentType<{ className?: string }>, {
                          className: 'h-4 w-4',
                        })}
                  </div>
                )}
                {option.label}
                {option.value === value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Helper component for selecting multiple options
function MultiOptionSelector({
  options,
  values,
  onChange,
  placeholder,
}: {
  options: ColumnOption[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground">{placeholder}</span>
        {values.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs ml-auto"
            onClick={() => onChange([])}
          >
            Clear
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...values, option.value]);
                } else {
                  onChange(values.filter((v) => v !== option.value));
                }
              }}
            />
            <label
              htmlFor={`option-${option.value}`}
              className="text-sm font-normal flex items-center gap-2 cursor-pointer"
            >
              {option.icon && (
                <div className="h-4 w-4">
                  {React.isValidElement(option.icon)
                    ? option.icon
                    : React.createElement(option.icon as React.ComponentType<{ className?: string }>, {
                        className: 'h-4 w-4',
                      })}
                </div>
              )}
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get default operator for a column type
function getDefaultOperator(type: ColumnDataType): FilterOperator {
  switch (type) {
    case 'text':
      return 'contains';
    case 'number':
      return 'eq';
    case 'date':
      return 'eq';
    case 'option':
      return 'eq';
    case 'multiOption':
      return 'in';
    default:
      return 'eq';
  }
}

// Helper function to get available operators for a column type
function getOperatorsForType(type: ColumnDataType): FilterOperator[] {
  switch (type) {
    case 'text':
      return ['eq', 'neq', 'contains', 'startsWith', 'endsWith', 'empty', 'nempty'];
    case 'number':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'empty', 'nempty'];
    case 'date':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'between', 'empty', 'nempty'];
    case 'option':
      return ['eq', 'neq', 'empty', 'nempty'];
    case 'multiOption':
      return ['in', 'nin', 'empty', 'nempty'];
    default:
      return ['eq', 'neq'];
  }
}

// Helper function to get column options
function getColumnOptions<TData extends RowData>(
  column: ColumnDef<TData, any>,
  meta: ColumnMeta<TData, any>
): ColumnOption[] {
  // If options are provided in meta, use them
  if (meta.options) {
    return meta.options;
  }
  
  // Otherwise, try to generate options from column values
  // This would typically be done by the parent component
  return [];
}
