import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField, type FieldComponents } from './form';
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface TextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ control, name, label, description, className, components, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <textarea
                className={cn(
                  'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  className,
                )}
                {...field}
                {...props}
                ref={field.ref}
              />
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
