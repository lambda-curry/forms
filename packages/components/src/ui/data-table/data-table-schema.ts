import { z } from 'zod';

/**
 * Schema for data table filter parameters
 */
export const dataTableFilterSchema = z.object({
  // Pagination
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).default(10),
  
  // Sorting
  sortField: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  
  // Search
  search: z.string().optional(),
  
  // We'll validate specific filter fields dynamically based on the column configuration
});

/**
 * Type for data table filter parameters
 */
export type DataTableFilterParams = z.infer<typeof dataTableFilterSchema>;

/**
 * Create a schema for a specific filter configuration
 */
export function createFilterSchema<TData>(
  filterableColumns: {
    id: keyof TData;
    options: {
      value: string;
    }[];
  }[] = [],
  searchableColumns: {
    id: keyof TData;
  }[] = []
) {
  // Start with the base schema
  let schema = dataTableFilterSchema;

  // Add filter fields for each filterable column
  filterableColumns.forEach((column) => {
    const columnId = String(column.id);
    const allowedValues = column.options.map((option) => option.value);
    
    // Add the field to the schema as an optional array of allowed values
    schema = schema.extend({
      [columnId]: z.array(z.enum(allowedValues as [string, ...string[]])).optional(),
    });
  });

  // Add search fields for each searchable column
  searchableColumns.forEach((column) => {
    const columnId = String(column.id);
    
    // Add the search field to the schema
    schema = schema.extend({
      [`search_${columnId}`]: z.string().optional(),
    });
  });

  return schema;
}