
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

// Custom parsers to replace nuqs parsers
export const parseAsString = {
  parse: (value: string | null): string => {
    return value || '';
  },
  serialize: (value: string | null): string | null => {
    return value === '' ? null : value;
  },
};

export const parseAsInteger = {
  parse: (value: string | null): number => {
    if (!value) return 0;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  },
  serialize: (value: number | null): string | null => {
    return value === 0 ? null : value?.toString() || null;
  },
};

export const parseAsJson = <T>(validator: (value: unknown) => T) => ({
  parse: (value: string | null): T | null => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      return validator(parsed);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return null;
    }
  },
  serialize: (value: T | null): string | null => {
    if (value === null) return null;
    return JSON.stringify(value);
  },
});

// Export the parsers with default values
export const dataTableRouterParsers = {
  search: {
    parse: parseAsString.parse,
    serialize: parseAsString.serialize,
    defaultValue: '',
  },
  filters: {
    parse: (value: string | null) => parseAsJson<FilterValue[]>(parseFilterValueArray).parse(value) || [],
    serialize: (value: FilterValue[] | null) => {
      return value && value.length > 0 ? parseAsJson<FilterValue[]>(parseFilterValueArray).serialize(value) : null;
    },
    defaultValue: [] as FilterValue[],
  },
  page: {
    parse: parseAsInteger.parse,
    serialize: parseAsInteger.serialize,
    defaultValue: 0,
  },
  pageSize: {
    parse: parseAsInteger.parse,
    serialize: parseAsInteger.serialize,
    defaultValue: 10,
  },
  sortField: {
    parse: parseAsString.parse,
    serialize: parseAsString.serialize,
    defaultValue: '',
  },
  sortOrder: {
    parse: parseAsString.parse,
    serialize: parseAsString.serialize,
    defaultValue: 'asc',
  },
};

// Export the inferred type for convenience
export type DataTableRouterState = {
  search: string;
  filters: FilterValue[];
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
};
