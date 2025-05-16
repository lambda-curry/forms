import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BazzaFiltersState } from '../../remix-hook-form/data-table-router-parsers';
import { dataTableRouterParsers } from '../../remix-hook-form/data-table-router-parsers';

/**
 * Custom hook for synchronizing filter state with URL parameters
 * 
 * This hook provides a clean interface for working with filter state in data table components,
 * automatically syncing the state with URL search parameters.
 * 
 * @returns A tuple containing the current filter state and a function to update it
 */
export function useFilterSync(): [BazzaFiltersState, (newFilters: BazzaFiltersState) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse filters from URL
  const filtersFromUrl = dataTableRouterParsers.filters.parse(searchParams.get('filters'));
  
  // Function to update filters in URL
  const setFilters = useCallback((newFilters: BazzaFiltersState) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update or remove the filters parameter
    if (newFilters.length > 0) {
      const serialized = dataTableRouterParsers.filters.serialize(newFilters);
      if (serialized !== null) {
        newParams.set('filters', serialized);
      }
    } else {
      newParams.delete('filters');
    }
    
    // Update the URL with the new search parameters
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  return [filtersFromUrl, setFilters];
}

