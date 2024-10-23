import { forwardRef, type ElementRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
// biome-ignore lint/style/noNamespaceImport: from Radix
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';
import { type FieldComponents, FormControl, FormDescription, FormField, FormItem, FormLabel } from './form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface SwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  description?: string;
  className?: string;
  components?: Partial<FieldComponents>;
}

const Switch = forwardRef<ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ control, name, className, label, description, components, ...props }, ref) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-row items-center justify-between rounded-lg border p-4', className)}>
          <div className="space-y-0.5">
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          </div>
          <FormControl Component={components?.FormControl}>
            <SwitchPrimitives.Root
              ref={ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={cn(
                'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
                className,
              )}
              {...props}
            >
              <SwitchPrimitives.Thumb
                className={cn(
                  'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
                )}
              />
            </SwitchPrimitives.Root>
          </FormControl>
        </FormItem>
      )}
    />
  ),
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
