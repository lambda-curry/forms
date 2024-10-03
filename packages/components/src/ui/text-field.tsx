import { type InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './input';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './remix-form';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  name: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
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