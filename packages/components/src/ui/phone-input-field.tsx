import * as React from 'react';
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
import { type PhoneInputProps, PhoneNumberInput } from './phone-input';
import { cn } from './utils';

export interface PhoneInputFieldProps extends Omit<PhoneInputProps, 'value' | 'onChange'> {
  control?: Control<FieldValues>;
  name: FieldPath<FieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  components?: Partial<FieldComponents> & {
    Input?: React.ComponentType<PhoneInputProps & React.RefAttributes<HTMLInputElement>>;
  };
  className?: string;
}

export const PhoneInputField = function PhoneInputField({
  control,
  name,
  label,
  description,
  className,
  components,
  ref,
  ...props
}: PhoneInputFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  // Use the custom Input component if provided, otherwise use the default PhoneNumberInput
  const InputComponent = components?.Input || PhoneNumberInput;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <InputComponent
                {...field}
                {...props}
                ref={ref}
                className={cn('focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2')}
              />
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

PhoneInputField.displayName = 'PhoneInputField';

