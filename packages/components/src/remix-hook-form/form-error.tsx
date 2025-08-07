import { useRemixFormContext } from 'remix-hook-form';
import type { FieldComponents } from '../ui/form';
import { FormErrorField } from '../ui/form-error-field';

export type FormErrorProps = {
  name?: string;
  className?: string;
  components?: Partial<FieldComponents>;
};

export function FormError({ name = '_form', ...props }: FormErrorProps) {
  const { control } = useRemixFormContext();

  return <FormErrorField control={control} name={name} {...props} />;
}

FormError.displayName = 'FormError';
