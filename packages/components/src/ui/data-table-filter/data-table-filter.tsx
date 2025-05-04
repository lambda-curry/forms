import * as React from 'react';
import { type ColumnDef, type RowData, type Table } from '@tanstack/react-table';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Separator } from '../separator';
import { Badge } from '../badge';
import { cn } from '../utils';
import { ScrollArea } from '../scroll-area';
import { PropertyFilterItem } from './property-filter-item';
import { QuickSearchFilter } from './quick-search-filter';
import { type ColumnDataType, type ColumnMeta, type ColumnOption, type DataTableFilterState, type FilterOperator, type FilterValue } from './types';
import { useTranslation } from './i18n';

export interface DataTableFilterProps<TData extends RowData> {
  /**
   * The columns to filter on.
   */
  columns: ColumnDef<TData, any>[];
  
  /**
   * The current filter state.
   */
  filters: DataTableFilterState;
  
  /**
   * Actions to perform when filters change.
   */
  actions: {
    onFiltersChange: (filters: DataTableFilterState) => void;
  };
  
  /**
   * The strategy to use for filtering.
   * @default 'tanstack-table'
   */
  strategy?: 'tanstack-table' | 'custom';
  
  /**
   * The locale to use for translations.
   * @default 'en'
   */
  locale?: string;
  
  /**
   * Optional table instance for backward compatibility.
   */
  table?: Table<TData>;
}

export function DataTableFilter<TData extends RowData>({
  columns,
  filters,
  actions,
  strategy = 'tanstack-table',
  locale = 'en',
  table,
}: DataTableFilterProps<TData>) {
  const { t } = useTranslation(locale);
  const [open, setOpen] = React.useState(false);
  
  // Get filterable columns (columns with meta.type defined)
  const filterableColumns = React.useMemo(() => {
    return columns.filter((column) => {
      const meta = column.meta as ColumnMeta<TData, any> | undefined;
      return meta?.type !== undefined;
    });
  }, [columns]);
  
  // Handle filter changes
  const handleFilterChange = React.useCallback(
    (columnId: string, operator: FilterOperator, values: any) => {
      const newFilters = [...filters];
      const existingFilterIndex = newFilters.findIndex((filter) => filter.id === columnId);
      
      if (values === undefined || (Array.isArray(values) && values.length === 0)) {
        // Remove filter if values are empty
        if (existingFilterIndex !== -1) {
          newFilters.splice(existingFilterIndex, 1);
        }
      } else if (existingFilterIndex !== -1) {
        // Update existing filter
        newFilters[existingFilterIndex] = {
          id: columnId,
          value: {
            operator,
            values,
            columnMeta: getColumnMeta(columnId),
          },
        };
      } else {
        // Add new filter
        newFilters.push({
          id: columnId,
          value: {
            operator,
            values,
            columnMeta: getColumnMeta(columnId),
          },
        });
      }
      
      actions.onFiltersChange(newFilters);
    },
    [filters, actions, columns]
  );
  
  // Get column meta for a given column ID
  const getColumnMeta = React.useCallback(
    (columnId: string) => {
      const column = columns.find((col) => col.id === columnId);
      return column?.meta as ColumnMeta<TData, any> | undefined;
    },
    [columns]
  );
  
  // Clear all filters
  const handleClearFilters = React.useCallback(() => {
    actions.onFiltersChange([]);
  }, [actions]);
  
  // Get filter value for a column
  const getFilterValue = React.useCallback(
    (columnId: string) => {
      return filters.find((filter) => filter.id === columnId)?.value;
    },
    [filters]
  );
  
  return (
    <div className="flex flex-1 items-center space-x-2">
      {/* Quick search filters */}
      <div className="flex flex-wrap gap-1">
        {filterableColumns
          .filter((column) => {
            const meta = column.meta as ColumnMeta<TData, any>;
            return meta.type === 'option' || meta.type === 'multiOption';
          })
          .map((column) => {
            const meta = column.meta as ColumnMeta<TData, any>;
            const filterValue = getFilterValue(column.id as string);
            
            return (
              <QuickSearchFilter
                key={column.id as string}
                column={column}
                meta={meta}
                filterValue={filterValue}
                onFilterChange={handleFilterChange}
                locale={locale}
              />
            );
          })}
      </div>
      
      {/* Main filter button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 border-dashed',
              filters.length > 0 && 'bg-muted/50'
            )}
          >
            <Filter className="mr-2 h-3.5 w-3.5" />
            {t('filter')}
            {filters.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {filters.length}
                </Badge>
              </>
            )}
            <ChevronDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="start">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <h4 className="font-medium">{t('filters')}</h4>
            {filters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleClearFilters}
              >
                {t('resetFilters')}
                <X className="ml-1 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-[300px]">
            <div className="p-3 space-y-3">
              {filterableColumns.map((column) => {
                const meta = column.meta as ColumnMeta<TData, any>;
                const filterValue = getFilterValue(column.id as string);
                
                return (
                  <PropertyFilterItem
                    key={column.id as string}
                    column={column}
                    meta={meta}
                    filterValue={filterValue}
                    onFilterChange={handleFilterChange}
                    locale={locale}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      
      {/* Active filters display */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filters.map((filter) => {
            const meta = filter.value.columnMeta;
            if (!meta) return null;
            
            return (
              <Badge
                key={filter.id}
                variant="secondary"
                className="rounded-sm px-1 font-normal flex items-center gap-1"
              >
                <span className="font-medium">{meta.displayName}:</span>
                <span className="max-w-[100px] truncate">
                  {formatFilterValue(filter.value, meta.type, t)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleFilterChange(filter.id, 'eq', undefined)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          
          {filters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleClearFilters}
            >
              {t('clearAll')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to format filter values for display
function formatFilterValue(
  filterValue: FilterValue,
  type: ColumnDataType,
  t: (key: string) => string
): string {
  const { operator, values } = filterValue;
  
  if (values === undefined || (Array.isArray(values) && values.length === 0)) {
    return '';
  }
  
  switch (type) {
    case 'text':
      return `${t(`operators.${operator}`)} ${values}`;
    
    case 'number':
      if (operator === 'between') {
        return `${values[0]} - ${values[1]}`;
      }
      return `${t(`operators.${operator}`)} ${values}`;
    
    case 'date':
      if (operator === 'between') {
        return `${formatDate(values[0])} - ${formatDate(values[1])}`;
      }
      return `${t(`operators.${operator}`)} ${formatDate(values)}`;
    
    case 'option':
      return values as string;
    
    case 'multiOption':
      if (Array.isArray(values)) {
        return values.length === 1
          ? values[0] as string
          : `${values.length} ${t('selected')}`;
      }
      return '';
    
    default:
      return String(values);
  }
}

// Helper function to format dates
function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return date;
  }
  
  return date.toLocaleDateString();
}

