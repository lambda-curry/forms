import { z } from 'zod';

// Basic filter schemas
export const textFilterSchema = z.string();

export const numberFilterSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
});

export const dateFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export const selectFilterSchema = z.array(z.string());

// Create a schema for a specific column
export const createColumnFilterSchema = (type: 'text' | 'number' | 'date' | 'select') => {
  switch (type) {
    case 'text':
      return textFilterSchema;
    case 'number':
      return numberFilterSchema;
    case 'date':
      return dateFilterSchema;
    case 'select':
      return selectFilterSchema;
    default:
      return z.any();
  }
};

// Create a schema for the entire table
export const createTableFilterSchema = <T extends Record<string, any>>(columns: {
  id: keyof T;
  type: 'text' | 'number' | 'date' | 'select';
}[]) => {
  const schemaObj: Record<string, z.ZodType<any>> = {};
  
  columns.forEach((column) => {
    schemaObj[column.id as string] = createColumnFilterSchema(column.type);
  });
  
  return z.object(schemaObj);
};

// Helper function to validate a filter value against a schema
export const validateFilter = <T>(value: T, schema: z.ZodType<T>): { valid: boolean; value?: T; error?: string } => {
  try {
    const validatedValue = schema.parse(value);
    return { valid: true, value: validatedValue };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0].message };
    }
    return { valid: false, error: 'Invalid value' };
  }
};