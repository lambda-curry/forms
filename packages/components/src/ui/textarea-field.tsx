// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
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
import { Textarea } from './textarea';

export interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Textarea>, 'name'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
}

function TextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, description, className, components, ...props }: TextareaFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
          <FormControl Component={components?.FormControl}>
            <Textarea {...field} {...props} data-slot="textarea-field" />
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}

TextareaField.displayName = 'TextareaField';

export { TextareaField };
