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
import { type InputProps, TextInput } from './text-input';
import { cn } from './utils';

export const FieldPrefix = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex h-full text-base items-center pl-3 pr-0 text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200 border-y border-l border-input rounded-l-md bg-background',
        className,
      )}
    >
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};

export const FieldSuffix = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'flex h-full text-base items-center pr-3 pl-0 text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200 border-y border-r border-input rounded-r-md bg-background',
        className,
      )}
    >
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
};

// Create a specific interface for the input props that includes className explicitly
export interface TextInputProps extends Omit<InputProps, 'prefix' | 'suffix'> {
  control?: Control<FieldValues>;
  name: FieldPath<FieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  components?: Partial<FieldComponents> & {
    Input?: React.ComponentType<InputProps & React.RefAttributes<HTMLInputElement>>;
  };
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
}

export const TextField = function TextField({
  control,
  name,
  label,
  description,
  className,
  components,
  prefix,
  suffix,
  ref,
  ...props
}: TextInputProps & { ref?: React.Ref<HTMLInputElement> }) {
  // Use the custom Input component if provided, otherwise use the default TextInput
  const InputComponent = components?.Input || TextInput;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <div
              className={cn('flex group transition-all duration-200 rounded-md', {
                'field__input--with-prefix': prefix,
                'field__input--with-suffix': suffix,
                'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background': true,
              })}
            >
              {prefix && <FieldPrefix>{prefix}</FieldPrefix>}
              <FormControl Component={components?.FormControl}>
                <InputComponent
                  {...field}
                  {...props}
                  ref={ref}
                  className={cn('focus-visible:ring-0 focus-visible:ring-offset-0 border-input', {
                    'rounded-l-none border-l-0': prefix,
                    'rounded-r-none border-r-0': suffix,
                  })}
                />
              </FormControl>
              {suffix && <FieldSuffix>{suffix}</FieldSuffix>}
            </div>
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

TextField.displayName = 'TextField';
