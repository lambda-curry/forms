import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
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
import { cn } from './utils';

export interface RadioGroupFieldComponents extends FieldComponents {
  RadioGroup?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>;
}

export interface RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof RadioGroup>, 'onValueChange'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<RadioGroupFieldComponents>;
  radioGroupClassName?: string;
}
const RadioGroupField = ({
  control,
  name,
  label,
  description,
  className,
  radioGroupClassName,
  components,
  children,
  ...props
}: RadioGroupFieldProps) => {
  // Extract custom components with fallbacks
  const RadioGroupComponent = components?.RadioGroup || RadioGroup;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
          <FormControl Component={components?.FormControl}>
            <RadioGroupComponent
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn('grid gap-2', radioGroupClassName)}
              {...props}
            >
              {children}
            </RadioGroupComponent>
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};
RadioGroupField.displayName = 'RadioGroupField';

export { RadioGroupField };
