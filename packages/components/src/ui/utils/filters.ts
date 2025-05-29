import { z } from 'zod';

// Define the shape of a single filter item
export const filterItemSchema = z.object({
  columnId: z.string(),
  type: z.string(),
  operator: z.string(),
  values: z.array(z.unknown()),
});

// Define the shape of the filters array
export const filtersArraySchema = z.array(filterItemSchema);

// Export the type for the filters state
export type FiltersState = z.infer<typeof filtersArraySchema>;

