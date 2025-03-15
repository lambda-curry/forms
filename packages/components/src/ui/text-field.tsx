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
import { TextInput } from './text-input';

export interface TextFieldComponents extends FieldComponents {
  Input?: React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;
}

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<TextFieldComponents>;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  ({ control, name, label, description, className, components, ...props }, ref) => {
    const InputComponent = components?.Input || TextInput;

    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className} ref={ref}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <InputComponent {...field} {...props} ref={field.ref} />
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

TextField.displayName = 'TextField';
