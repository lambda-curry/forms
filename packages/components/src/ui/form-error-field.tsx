import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormMessage } from './form';
import type { FieldComponents } from './form';

export interface FormErrorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  className?: string;
  components?: Partial<FieldComponents>;
}

export const FormErrorField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  className,
  components,
}: FormErrorFieldProps<TFieldValues, TName>) => {
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
