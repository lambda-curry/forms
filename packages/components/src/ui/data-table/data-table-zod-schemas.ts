import { z } from 'zod';

/**
 * Schema for sorting parameters
 */
export const sortSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export type SortSchemaType = z.infer<typeof sortSchema>;

/**
 * Schema for filter parameters
 */
export const filterSchema = z.object({
  id: z.string(),
  value: z.array(z.string()),
});

export type FilterSchemaType = z.infer<typeof filterSchema>;

/**
 * Schema for pagination parameters
 */
export const paginationSchema = z.object({
  pageIndex: z.number().int().min(0),
  pageSize: z.number().int().min(1),
});

export type PaginationSchemaType = z.infer<typeof paginationSchema>;

/**
 * Schema for search parameters
 */
export const searchSchema = z.object({
  value: z.string(),
  column: z.string(),
});

export type SearchSchemaType = z.infer<typeof searchSchema>;

/**
 * Helper function to parse URL search params using zod schemas
 * @param searchParams URLSearchParams object
 * @returns Parsed parameters object
 */
export function parseDataTableParams(searchParams: URLSearchParams) {
  // Parse sort params
  const sortField = searchParams.get('sortField');
  const sortOrder = searchParams.get('sortOrder');
  const sort = sortField 
    ? [{ id: sortField, desc: sortOrder === 'desc' }] 
    : [];

  // Parse pagination params
  const page = parseInt(searchParams.get('page') || '0', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const pagination = {
    pageIndex: isNaN(page) ? 0 : page,
    pageSize: isNaN(pageSize) ? 10 : pageSize,
  };

  // Parse filter params
  const filters: Record<string, string[]> = {};
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'sortField' && key !== 'sortOrder' && key !== 'page' && key !== 'pageSize' && key !== 'search') {
      if (!filters[key]) {
        filters[key] = [];
      }
      filters[key].push(value);
    }
  }

  const columnFilters = Object.entries(filters).map(([id, value]) => ({
    id,
    value,
  }));

  // Parse search params
  const searchValue = searchParams.get('search');
  const search = searchValue ? { value: searchValue, column: '' } : {};

  return {
    sort,
    pagination,
    columnFilters,
    search,
  };
}

/**
 * Helper function to convert data table state to URL search params
 * @param state Data table state object
 * @returns URLSearchParams object
 */
export function dataTableStateToSearchParams(state: {
  sort?: SortSchemaType[];
  pagination?: PaginationSchemaType;
  columnFilters?: FilterSchemaType[];
  search?: Partial<SearchSchemaType>;
}) {
  const searchParams = new URLSearchParams();

  // Add sort params
  if (state.sort && state.sort.length > 0) {
    searchParams.set('sortField', state.sort[0].id);
    searchParams.set('sortOrder', state.sort[0].desc ? 'desc' : 'asc');
  }

  // Add pagination params
  if (state.pagination) {
    searchParams.set('page', state.pagination.pageIndex.toString());
    searchParams.set('pageSize', state.pagination.pageSize.toString());
  }

  // Add filter params
  if (state.columnFilters) {
    state.columnFilters.forEach((filter) => {
      if (Array.isArray(filter.value)) {
        filter.value.forEach((value) => {
          searchParams.append(filter.id, value);
        });
      }
    });
  }

  // Add search params
  if (state.search?.value) {
    searchParams.set('search', state.search.value);
  }

  return searchParams;
}