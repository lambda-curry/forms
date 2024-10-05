import { type InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './input';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from './remix-form';
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ control, name, label, description, className, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input {...field} {...props} ref={ref} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    );
  },
);

TextField.displayName = 'TextField';