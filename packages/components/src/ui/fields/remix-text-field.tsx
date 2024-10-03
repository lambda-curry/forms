import React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { Input } from '../input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../remix-form';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  name: string;
  error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, name, description, className, error, ...props }, ref) => {
    return (
      <FormItem className={className}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input name={name} {...props} ref={ref} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    );
  },
);

TextField.displayName = 'TextField';

export interface ControlledTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  name: string;
}

export const ControlledTextField = React.forwardRef<HTMLInputElement, ControlledTextFieldProps>(
  ({ name, label, description, ...props }, ref) => {
    const { control } = useRemixFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input {...field} {...props} ref={ref} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

ControlledTextField.displayName = 'TextField';
