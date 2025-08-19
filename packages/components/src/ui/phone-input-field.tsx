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
import { type PhoneInputProps, PhoneNumberInput } from './phone-input';
import { cn } from './utils';

export interface PhoneInputFieldProps extends Omit<PhoneInputProps, 'value' | 'onChange'> {
  control?: Control<FieldValues>;
  name: FieldPath<FieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  components?: Partial<FieldComponents> & {
    Input?: (props: PhoneInputProps & { ref?: React.Ref<HTMLInputElement> }) => React.ReactElement;
  };
  className?: string;
  inputClassName?: string;
}

export const PhoneInputField = function PhoneInputField({
  control,
  name,
  label,
  description,
  className,
  inputClassName,
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
            <div
              className={cn(
                'flex group transition-all duration-200 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
              )}
            >
              <FormControl Component={components?.FormControl}>
                <InputComponent
                  {...field}
                  {...props}
                  ref={ref}
                  className={cn('w-full', inputClassName)}
                  inputClassName={cn('focus-visible:ring-0 focus-visible:ring-offset-0 border-input', inputClassName)}
                />
              </FormControl>
            </div>
            {description && (
              <FormDescription Component={components?.FormDescription}>{description}</FormDescription>
            )}
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
