import { useRemixFormContext } from 'remix-hook-form';
import { FormErrorField } from '../ui/form-error-field';
import type { FormErrorFieldProps } from '../ui/form-error-field';

export type FormErrorProps = Omit<FormErrorFieldProps, 'control'> & {
  name?: string;
};

export function FormError({ name = '_form', ...props }: FormErrorProps) {
  const { control } = useRemixFormContext();

  return <FormErrorField control={control} name={name} {...props} />;
}

FormError.displayName = 'FormError';
