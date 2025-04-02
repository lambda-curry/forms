import { parseAsInteger, parseAsJson, parseAsString } from 'nuqs';

// Define and export the shape of a single filter
export interface FilterValue {
  // Export the interface
  id: string;
  value: unknown; // Keep unknown for flexibility, JSON handles serialization
}

// Runtime parser for FilterValue[]
const parseFilterValueArray = (value: unknown): FilterValue[] => {
  if (!Array.isArray(value)) throw new Error('Expected array');
  return value.map((item) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('id' in item) ||
      typeof item.id !== 'string' ||
      !('value' in item)
    ) {
      throw new Error('Invalid filter value');
    }
    return { id: item.id, value: item.value };
  });
};

export const dataTableRouterParsers = {
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  filters: parseAsJson<FilterValue[]>(parseFilterValueArray).withDefault([]).withOptions({ clearOnDefault: true }),
  page: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(10),
  sortField: parseAsString.withDefault(''), // Provide a sensible default if possible
  // Use parseAsString for sortOrder, rely on component logic for valid values
  sortOrder: parseAsString.withDefault('asc'),
};

// Export the inferred type for convenience
export type DataTableRouterState = {
  search: string | null;
  filters: FilterValue[] | null;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
};
