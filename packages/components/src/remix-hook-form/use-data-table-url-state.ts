import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { type DataTableRouterState, dataTableRouterParsers } from './data-table-router-parsers';

/**
 * Custom hook for managing URL state in data tables
 *
 * This hook provides a clean interface for working with URL search parameters
 * in data table components, replacing the functionality previously provided by nuqs.
 *
 * @returns An object containing the current URL state and a function to update it
 */
export function useDataTableUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL search parameters using our custom parsers
  const urlState: DataTableRouterState = useMemo(
    () => ({
      search: dataTableRouterParsers.search.parse(searchParams.get('search')),
      filters: dataTableRouterParsers.filters.parse(searchParams.get('filters')),
      page: dataTableRouterParsers.page.parse(searchParams.get('page')),
      pageSize: dataTableRouterParsers.pageSize.parse(searchParams.get('pageSize')),
      sortField: dataTableRouterParsers.sortField.parse(searchParams.get('sortField')),
      // 'asc' or 'desc'
      sortOrder: dataTableRouterParsers.sortOrder.parse(searchParams.get('sortOrder')),
    }),
    [searchParams],
  );

  // Function to update URL search parameters
  const setUrlState = useCallback(
    (newState: Partial<DataTableRouterState>) => {
      const updatedState = { ...urlState, ...newState };
      const newParams = new URLSearchParams();

      // Only add parameters that are not default values
      if (updatedState.search !== dataTableRouterParsers.search.defaultValue) {
        const serialized = dataTableRouterParsers.search.serialize(updatedState.search);
        if (serialized !== null) newParams.set('search', serialized);
      }

      if (updatedState.filters.length > 0) {
        const serialized = dataTableRouterParsers.filters.serialize(updatedState.filters);
        if (serialized !== null) newParams.set('filters', serialized);
      }

      if (updatedState.page !== dataTableRouterParsers.page.defaultValue) {
        const serialized = dataTableRouterParsers.page.serialize(updatedState.page);
        if (serialized !== null) newParams.set('page', serialized);
      }

      if (updatedState.pageSize !== dataTableRouterParsers.pageSize.defaultValue) {
        const serialized = dataTableRouterParsers.pageSize.serialize(updatedState.pageSize);
        if (serialized !== null) newParams.set('pageSize', serialized);
      }

      if (updatedState.sortField !== dataTableRouterParsers.sortField.defaultValue) {
        const serialized = dataTableRouterParsers.sortField.serialize(updatedState.sortField);
        if (serialized !== null) newParams.set('sortField', serialized);
      }

      if (updatedState.sortOrder !== dataTableRouterParsers.sortOrder.defaultValue) {
        const serialized = dataTableRouterParsers.sortOrder.serialize(updatedState.sortOrder);
        if (serialized !== null) newParams.set('sortOrder', serialized);
      }

      // Update the URL with the new search parameters
      setSearchParams(newParams, { replace: true });
    },
    [setSearchParams, urlState],
  );

  // Return the current URL state and the function to update it
  return { urlState, setUrlState };
}

/**
 * Get the default state values for a data table
 *
 * @param defaultStateValues Optional custom default values to override the standard ones
 * @returns A DataTableRouterState object with default values
 */
export function getDefaultDataTableState(defaultStateValues?: Partial<DataTableRouterState>): DataTableRouterState {
  return {
    search: dataTableRouterParsers.search.defaultValue,
    filters: dataTableRouterParsers.filters.defaultValue,
    page: dataTableRouterParsers.page.defaultValue,
    pageSize: dataTableRouterParsers.pageSize.defaultValue,
    sortField: dataTableRouterParsers.sortField.defaultValue,
    // 'asc' or 'desc'
    sortOrder: dataTableRouterParsers.sortOrder.defaultValue,
    ...defaultStateValues,
  };
}
