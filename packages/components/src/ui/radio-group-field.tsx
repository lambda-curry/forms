import { type ComponentPropsWithoutRef, forwardRef } from 'react';
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
> extends Omit<ComponentPropsWithoutRef<typeof RadioGroup>, 'onValueChange'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
}

const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
  ({ control, name, label, description, className, components, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className} ref={ref}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <RadioGroup ref={field.ref} onValueChange={field.onChange} defaultValue={field.value} {...props} />
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  },
);
RadioGroupField.displayName = 'RadioGroupField';

export { RadioGroupField };
