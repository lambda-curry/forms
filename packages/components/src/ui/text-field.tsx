// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
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
import { cn } from './utils';

export const FieldPrefix = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={cn("whitespace-nowrap shadow-sm font-bold rounded-md text-base flex items-center px-2.5 pr-5 -mr-2.5 bg-gray-50 text-gray-500", className)}>
      {children}
    </span>
  );
};

export const FieldSuffix = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={cn("whitespace-nowrap shadow-sm font-bold rounded-md text-base flex items-center px-2.5 pl-5 -ml-2.5 bg-gray-50 text-gray-500", className)}>
      {children}
    </span>
  );
};

export interface TextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
  ({ control, name, label, description, className, components, prefix, suffix, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className} ref={ref}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <div className={cn("flex items-stretch relative", {
                "field__input--with-prefix": prefix,
                "field__input--with-suffix": suffix,
              })}>
                {prefix && <FieldPrefix>{prefix}</FieldPrefix>}
                <TextInput 
                  {...field} 
                  {...props} 
                  ref={field.ref} 
                  className={cn(props.className, {
                    "z-10": prefix || suffix,
                    "rounded-l-none": prefix,
                    "rounded-r-none": suffix,
                  })}
                />
                {suffix && <FieldSuffix>{suffix}</FieldSuffix>}
              </div>
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
