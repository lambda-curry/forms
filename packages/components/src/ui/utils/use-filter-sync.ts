import { parseAsJson, useQueryState } from 'nuqs';
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
      .withDefault([]),
    // TODO: Add debouncing if needed, e.g., .withOptions({ history: 'push', shallow: false, debounce: 300 })
  );

  return [filters, setFilters] as const;
}
