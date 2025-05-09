import { useQuery } from '@tanstack/react-query';
import type { FiltersState } from './filters';

// Define the expected shape of the API response
interface IssuesApiResponse {
  data: { id: string; title: string; status: string; assignee: string }[]; // TODO: Define a proper Issue type
  facetedCounts: Record<string, Record<string, number>>;
}

// Placeholder function to fetch data - replace with actual API call
async function fetchIssues(filters: FiltersState): Promise<IssuesApiResponse> {
  // Encode filters for URL
  const filterParam = filters.length > 0 ? `filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
  const response = await fetch(`/api/issues?${filterParam}`); // Adjust API path if needed

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data: IssuesApiResponse = await response.json();
  return data;
}

/**
 * Custom hook to fetch issues data using TanStack Query, based on filter state.
 *
 * @param filters The current filter state.
 * @returns The TanStack Query result object for the issues query.
 */
export function useIssuesQuery(filters: FiltersState) {
  return useQuery({
    queryKey: ['issues', filters], // Use filters in the query key for caching
    queryFn: () => fetchIssues(filters),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    // Consider adding options like staleTime, gcTime, refetchOnWindowFocus, etc.
  });
}
