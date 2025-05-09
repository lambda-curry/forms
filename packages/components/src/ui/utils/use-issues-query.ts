import { useQuery } from '@tanstack/react-query';
import type { FiltersState } from './filters';

// Define the expected shape of the API response
interface IssuesApiResponse<T = any> {
  data: T[];
  facetedCounts: Record<string, Record<string, number>>;
}

// Generic function to fetch data with filters
async function fetchData<T = any>(
  endpoint: string,
  filters: FiltersState
): Promise<IssuesApiResponse<T>> {
  // Encode filters for URL
  const filterParam = filters.length > 0 ? `filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
  const response = await fetch(`${endpoint}?${filterParam}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data: IssuesApiResponse<T> = await response.json();
  return data;
}

/**
 * Custom hook to fetch data using TanStack Query, based on filter state.
 *
 * @param endpoint The API endpoint to fetch data from
 * @param filters The current filter state
 * @param options Additional query options
 * @returns The TanStack Query result object for the data query
 */
export function useDataQuery<T = any>(
  endpoint: string,
  filters: FiltersState,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
    onSuccess?: (data: IssuesApiResponse<T>) => void;
    onError?: (error: Error) => void;
  }
) {
  return useQuery({
    queryKey: [endpoint, filters], // Use endpoint and filters in the query key for caching
    queryFn: () => fetchData<T>(endpoint, filters),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    enabled: options?.enabled !== false, // Enabled by default unless explicitly disabled
    refetchInterval: options?.refetchInterval, // Optional refetch interval
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    // Reduced stale time to ensure more frequent updates
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Custom hook to fetch issues data using TanStack Query, based on filter state.
 * This is a specialized version of useDataQuery for issues.
 *
 * @param filters The current filter state
 * @param options Additional query options
 * @returns The TanStack Query result object for the issues query
 */
export function useIssuesQuery(
  filters: FiltersState,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
    onSuccess?: (data: IssuesApiResponse) => void;
    onError?: (error: Error) => void;
  }
) {
  return useDataQuery('/api/issues', filters, options);
}
