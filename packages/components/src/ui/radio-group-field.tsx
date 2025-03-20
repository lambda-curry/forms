import type * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { RadioGroup } from './radio-group';

export interface RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof RadioGroup>, 'onValueChange'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
}

function RadioGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, description, className, components, ...props }: RadioGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
          <FormControl Component={components?.FormControl}>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              data-slot="radio-group-field"
              {...props}
            />
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}

export { RadioGroupField };

RadioGroupField.displayName = 'RadioGroupField';
