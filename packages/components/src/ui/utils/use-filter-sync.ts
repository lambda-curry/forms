import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { type FiltersState, filtersArraySchema } from './filters';

/**
 * Hook to synchronize the data table filter state with URL query parameters.
 * Uses nuqs for encoding/decoding and zod schema for validation.
 *
 * @returns A tuple containing the current filter state and a function to update it.
 */
export function useFilterSync() {
  const [filters, setFilters] = useQueryState<FiltersState>(
    'filters', // The query parameter key
    parseAsJson(filtersArraySchema.parse) // Now filtersArraySchema should be defined
      .withDefault([])
      .withOptions({ history: 'push', shallow: false, debounce: 300 }) // Add debouncing and history options
  );

  // This effect ensures that when the component mounts, it immediately
  // applies any filters from the URL to the data fetching logic
  useEffect(() => {
    // The filters are already loaded from the URL via useQueryState
    // This is just a placeholder for any additional initialization if needed
  }, []);

  return [filters, setFilters] as const;
}
