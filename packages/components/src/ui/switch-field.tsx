import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { type FieldComponents, FormControl, FormDescription, FormField, FormItem, FormLabel } from './form';
import { Switch } from './switch';

export interface SwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ComponentPropsWithoutRef<typeof Switch> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  description?: string;
  className?: string;
  components?: Partial<FieldComponents>;
}

const SwitchField = forwardRef<HTMLDivElement, SwitchProps>(
  ({ control, name, className, label, description, components, ...props }, ref) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn('flex flex-row items-center justify-between rounded-lg border p-4', className)}
          ref={ref}
        >
          <div className="space-y-0.5">
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          </div>
          <FormControl Component={components?.FormControl}>
            <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} {...props} />
          </FormControl>
        </FormItem>
      )}
    />
  ),
);

SwitchField.displayName = 'SwitchField';

export { SwitchField };
