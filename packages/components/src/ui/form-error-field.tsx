import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import type { FieldComponents } from './form';
import { FormField, FormItem, FormMessage } from './form';

export interface FormErrorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name?: TName;
  message?: string;
  className?: string;
  components?: Partial<FieldComponents>;
}

export const FormErrorField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  message,
  className,
  components,
}: FormErrorFieldProps<TFieldValues, TName>) => {
  if (message) {
    return (
      <FormItem className={className}>
        <FormMessage Component={components?.FormMessage}>{message}</FormMessage>
      </FormItem>
    );
  }

  if (!name) {
    return null;
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem className={className}>
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

FormErrorField.displayName = 'FormErrorField';
