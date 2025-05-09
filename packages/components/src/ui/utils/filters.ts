import { z } from 'zod';

export const filterOperatorSchema = z.enum([
  'is any of',
  'is none of',
  'contains',
  'does not contain',
  // Add other operators as needed
]);

export const filterTypeSchema = z.enum([
  'option',
  'text',
  'number',
  'date',
  // Add other types as needed
]);

export const filterSchema = z.object({
  columnId: z.string(),
  type: filterTypeSchema,
  operator: filterOperatorSchema,
  values: z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export const filtersArraySchema = z.array(filterSchema);

export type FilterOperator = z.infer<typeof filterOperatorSchema>;
export type FilterType = z.infer<typeof filterTypeSchema>;
export type Filter = z.infer<typeof filterSchema>;
export type FiltersState = z.infer<typeof filtersArraySchema>;
