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
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from './input-group';
import { cn } from './utils';

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
        // Use the new InputGroup pattern when prefix or suffix is provided
        const hasAddon = prefix || suffix;

        return (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            {hasAddon ? (
              // New shadcn/ui InputGroup pattern
              // Note: Addons are placed after input in DOM for focus management, but align prop handles visual positioning
              <FormControl Component={components?.FormControl}>
                <InputGroup>
                  {prefix && (
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>{prefix}</InputGroupText>
                    </InputGroupAddon>
                  )}
                  <InputGroupInput
                    {...field}
                    {...props}
                    ref={ref}
                    aria-invalid={fieldState.error ? 'true' : 'false'}
                    className={cn({
                      'rounded-l-none border-l-0': prefix,
                      'rounded-r-none border-r-0': suffix,
                    })}
                  />
                  {suffix && (
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>{suffix}</InputGroupText>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </FormControl>
            ) : (
              // Original pattern without addons
              <FormControl Component={components?.FormControl}>
                <InputComponent {...field} {...props} ref={ref} className={className} />
              </FormControl>
            )}
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
