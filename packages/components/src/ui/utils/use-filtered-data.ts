import { useMemo } from 'react';
import type { Column, ColumnConfig, DataTableFilterActions, FilterStrategy, FiltersState } from '../data-table-filter/core/types';
import { createColumns } from '../data-table-filter/core/filters';
import { useFilterSync } from './use-filter-sync';
import { useDataQuery } from './use-issues-query';

interface UseFilteredDataOptions<TData> {
  endpoint: string;
  columnsConfig: ReadonlyArray<ColumnConfig<TData, any, any, any>>;
  strategy?: FilterStrategy;
  initialData?: TData[];
  queryOptions?: {
    enabled?: boolean;
    refetchInterval?: number | false;
    onSuccess?: (data: { data: TData[]; facetedCounts: Record<string, Record<string, number>> }) => void;
    onError?: (error: Error) => void;
  };
}

/**
 * A hook that combines filter state management with data fetching.
 * It handles:
 * 1. Syncing filters with URL query parameters
 * 2. Fetching data based on current filters
 * 3. Creating columns with faceted counts from the API
 * 4. Providing filter actions
 * 
 * @returns Everything needed to implement a filtered data table
 */
export function useFilteredData<TData>({
  endpoint,
  columnsConfig,
  strategy = 'client',
  initialData = [],
  queryOptions,
}: UseFilteredDataOptions<TData>) {
  // Sync filters with URL query parameters
  const [filters, setFilters] = useFilterSync();
  
  // Fetch data with current filters
  const { data, isLoading, isError, error, refetch } = useDataQuery<TData>(
    endpoint,
    filters,
    queryOptions
  );
  
  // Create columns with faceted counts from the API
  const columns = useMemo(() => {
    if (!data) return createColumns(initialData, columnsConfig, strategy);
    
    // Apply faceted counts from the API to the columns
    const enhancedConfig = columnsConfig.map(config => {
      if ((config.type === 'option' || config.type === 'multiOption') && data.facetedCounts?.[config.id]) {
        return {
          ...config,
          facetedOptions: new Map(
            Object.entries(data.facetedCounts[config.id]).map(([key, count]) => [key, count])
          )
        };
      }
      if (config.type === 'number' && data.facetedCounts?.[config.id]) {
        // For number columns, we might have min/max values
        const values = Object.values(data.facetedCounts[config.id]);
        if (values.length === 2) {
          return {
            ...config,
            min: values[0],
            max: values[1],
          };
        }
      }
      return config;
    });
    
    return createColumns(data.data || initialData, enhancedConfig, strategy);
  }, [data, columnsConfig, initialData, strategy]);
  
  // Create filter actions
  const actions: DataTableFilterActions = useMemo(() => {
    return {
      addFilterValue: (column, values) => {
        setFilters(prev => {
          const filter = prev.find(f => f.columnId === column.id);
          if (!filter) {
            return [...prev, {
              columnId: column.id,
              type: column.type,
              operator: column.type === 'option' ? 'is any of' : 'contains',
              values
            }];
          }
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values: [...new Set([...f.values, ...values])] }
              : f
          );
        });
      },
      removeFilterValue: (column, values) => {
        setFilters(prev => {
          const filter = prev.find(f => f.columnId === column.id);
          if (!filter) return prev;
          
          const newValues = filter.values.filter(v => !values.includes(v));
          if (newValues.length === 0) {
            return prev.filter(f => f.columnId !== column.id);
          }
          
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values: newValues }
              : f
          );
        });
      },
      setFilterValue: (column, values) => {
        setFilters(prev => {
          const exists = prev.some(f => f.columnId === column.id);
          if (!exists) {
            return [...prev, {
              columnId: column.id,
              type: column.type,
              operator: column.type === 'option' ? 'is any of' : 'contains',
              values
            }];
          }
          return prev.map(f => 
            f.columnId === column.id 
              ? { ...f, values }
              : f
          );
        });
      },
      setFilterOperator: (columnId, operator) => {
        setFilters(prev => 
          prev.map(f => 
            f.columnId === columnId 
              ? { ...f, operator }
              : f
          )
        );
      },
      removeFilter: (columnId) => {
        setFilters(prev => prev.filter(f => f.columnId !== columnId));
      },
      removeAllFilters: () => {
        setFilters([]);
      }
    };
  }, [setFilters]);
  
  return {
    filters,
    setFilters,
    columns,
    actions,
    data: data?.data || initialData,
    facetedCounts: data?.facetedCounts,
    isLoading,
    isError,
    error,
    refetch,
  };
}

