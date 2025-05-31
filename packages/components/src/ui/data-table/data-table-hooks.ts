import { type ComponentType, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { debounce } from '../utils/debounce';
import { type DataTableFilterParams, createFilterSchema } from './data-table-schema';

/**
 * Custom hook for managing data table filter state in the URL
 */
export function useDataTableUrlState<TData>({
  filterableColumns = [],
  searchableColumns = [],
  defaultSort,
  debounceMs = 300,
}: {
  filterableColumns?: {
    id: keyof TData;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: ComponentType<{ className?: string }>;
    }[];
  }[];
  searchableColumns?: {
    id: keyof TData;
    title: string;
  }[];
  defaultSort?: {
    id: string;
    desc: boolean;
  };
  debounceMs?: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Create a schema for the filter parameters based on the column configuration
  const filterSchema = useMemo(() => {
    return createFilterSchema<TData>(filterableColumns, searchableColumns);
  }, [filterableColumns, searchableColumns]);

  // Parse the current URL search params using the schema
  const parseSearchParams = useCallback(() => {
    const params: Record<string, string | string[]> = {};

    // Extract all search params
    for (const [key, value] of searchParams.entries()) {
      // Handle array values (like filter arrays)
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    }

    // Parse with the schema, using safe parse to handle validation errors
    const result = filterSchema.safeParse(params);

    if (result.success) {
      return result.data;
    }

    // If validation fails, return defaults from the schema
    return filterSchema.parse({}) as DataTableFilterParams;
  }, [searchParams, filterSchema]);

  // Get the current filter state from URL
  const filterState = useMemo(() => {
    return parseSearchParams();
  }, [parseSearchParams]);

  // Create a debounced version of setSearchParams
  const debouncedSetSearchParams = useMemo(() => {
    return debounce((newParams: Record<string, string | string[] | number | undefined>) => {
      // Remove undefined or null values
      const cleanParams = Object.fromEntries(
        Object.entries(newParams)
          .filter(([_, value]) => value != null && value !== '')
          .map(([key, value]) => [key, Array.isArray(value) ? value : String(value)]),
      );

      setSearchParams(cleanParams);
    }, debounceMs);
  }, [setSearchParams, debounceMs]);

  // Update URL search params
  const updateFilterState = useCallback(
    (updates: Partial<DataTableFilterParams>) => {
      const currentState = parseSearchParams();
      const newState = { ...currentState, ...updates } as Record<string, string | string[] | number | undefined>;

      // Remove null/undefined values and empty strings
      Object.keys(newState).forEach((key) => {
        if (newState[key] === null || newState[key] === undefined || newState[key] === '') {
          delete newState[key];
        }
      });

      debouncedSetSearchParams(newState);
    },
    [parseSearchParams, debouncedSetSearchParams],
  );

  // Initialize with default sort if provided and not already in URL
  useEffect(() => {
    if (defaultSort && !searchParams.has('sortField')) {
      updateFilterState({
        sortField: defaultSort.id,
        sortOrder: defaultSort.desc ? 'desc' : 'asc',
      });
    }
  }, [defaultSort, searchParams, updateFilterState]);

  return {
    filterState,
    updateFilterState,
  };
}
