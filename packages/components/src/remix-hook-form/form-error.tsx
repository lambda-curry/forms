import { useRemixFormContext } from 'remix-hook-form';
import type { FieldComponents } from '../ui/form';
import { FormErrorField } from '../ui/form-error-field';

export type FormErrorProps = {
  name?: string;
  message?: string;
  className?: string;
  components?: Partial<FieldComponents>;
};

export function FormError({ name, message, ...props }: FormErrorProps) {
  const context = useRemixFormContext();
  const control = context?.control;

  const effectiveName = name ?? (message ? undefined : '_form');

  return <FormErrorField control={control} name={effectiveName} message={message} {...props} />;
}

FormError.displayName = 'FormError';
