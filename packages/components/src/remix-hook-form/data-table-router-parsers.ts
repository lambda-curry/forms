// Define and export the shape of a single filter for Bazza UI
export interface BazzaFilterItem {
  columnId: string;
  type: string; // e.g., 'text', 'option', 'number'
  operator: string; // e.g., 'contains', 'is', 'isAnyOf', 'equals', 'between'
  values: unknown[];
}

export type BazzaFiltersState = BazzaFilterItem[];

// Runtime parser for BazzaFiltersState
const parseBazzaFiltersState = (value: unknown): BazzaFiltersState => {
  if (!Array.isArray(value)) {
    // console.warn('Expected array for filters, got:', value);
    return []; // Return empty array or throw error based on desired strictness
  }
  return value.reduce((acc: BazzaFiltersState, item) => {
    if (
      typeof item === 'object' &&
      item !== null &&
      'columnId' in item &&
      typeof item.columnId === 'string' &&
      'type' in item &&
      typeof item.type === 'string' &&
      'operator' in item &&
      typeof item.operator === 'string' &&
      'values' in item &&
      Array.isArray(item.values)
    ) {
      acc.push({
        columnId: item.columnId,
        type: item.type,
        operator: item.operator,
        values: item.values,
      });
    } else {
      // console.warn('Invalid filter item:', item);
    }
    return acc;
  }, []);
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
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
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
    parse: (value: string | null) => parseAsJson<BazzaFiltersState>(parseBazzaFiltersState).parse(value) || [],
    serialize: (value: BazzaFiltersState | null) => {
      return value && value.length > 0 ? parseAsJson<BazzaFiltersState>(parseBazzaFiltersState).serialize(value) : null;
    },
    defaultValue: [] as BazzaFiltersState,
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
  filters: BazzaFiltersState; // Updated to use BazzaFiltersState
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
};
