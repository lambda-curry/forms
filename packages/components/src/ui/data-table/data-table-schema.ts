import { z } from 'zod';

/**
 * Schema for data table filter parameters
 */
export const dataTableFilterSchema = z
  .object({
    // Pagination
    page: z.coerce.number().int().min(0).default(0),
    pageSize: z.coerce.number().int().min(1).default(10),

    // Sorting
    sortField: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),

    // Search
    dataTableSearch: z.string().optional(),
  })
  .passthrough(); // Allow additional properties

/**
 * Type for data table filter parameters
 */
export type DataTableFilterParams = z.infer<typeof dataTableFilterSchema> & {
  [key: string]: string | string[] | number | undefined;
};

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
  }[] = [],
) {
  // Create a shape object for the extended schema
  const extendedShape: Record<string, z.ZodType<string | string[] | undefined>> = {};

  // Add filter fields for each filterable column
  filterableColumns.forEach((column) => {
    const columnId = String(column.id);
    const allowedValues = column.options.map((option) => option.value);

    // Add the field to the shape
    extendedShape[columnId] = z.array(z.enum(allowedValues as [string, ...string[]])).optional();
  });

  // Add search fields for each searchable column
  searchableColumns.forEach((column) => {
    const columnId = String(column.id);

    // Add the search field to the shape
    extendedShape[`search_${columnId}`] = z.string().optional();
  });

  // Merge the base schema with the extended shape
  return z
    .object({
      ...dataTableFilterSchema.shape,
      ...extendedShape,
    })
    .passthrough();
}
