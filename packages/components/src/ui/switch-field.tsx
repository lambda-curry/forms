// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import type * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { type FieldComponents, FormControl, FormDescription, FormField, FormItem, FormLabel } from './form';
import { Switch } from './switch';
import { cn } from './utils';

export interface SwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.ComponentProps<typeof Switch> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  components?: Partial<FieldComponents>;
}

function SwitchField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, className, label, description, components, ...props }: SwitchProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn('flex flex-row items-center justify-between rounded-lg border p-4', className)}
          data-slot="switch-field-item"
        >
          <div className="space-y-0.5">
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          </div>
          <FormControl Component={components?.FormControl}>
            <Switch checked={field.value} onCheckedChange={field.onChange} data-slot="switch-field" {...props} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

SwitchField.displayName = 'SwitchField';

export { SwitchField };
