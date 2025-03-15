import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { type FieldComponents, FormControl, FormDescription, FormField, FormItem, FormLabel } from './form';
import type { Switch } from './switch';
import { cn } from './utils';

// Default styled Switch component
const DefaultSwitchPrimitive = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>((props, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      props.className,
    )}
    {...props}
  >
    {props.children}
  </SwitchPrimitives.Root>
));
DefaultSwitchPrimitive.displayName = 'DefaultSwitchPrimitive';

// Default styled Switch Thumb component
const DefaultSwitchThumbPrimitive = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb>
>((props, ref) => (
  <SwitchPrimitives.Thumb
    ref={ref}
    className={cn(
      'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      props.className,
    )}
    {...props}
  />
));
DefaultSwitchThumbPrimitive.displayName = 'DefaultSwitchThumbPrimitive';

export interface SwitchFieldComponents extends FieldComponents {
  Switch?: React.ComponentType<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>>;
  SwitchThumb?: React.ComponentType<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb>>;
}

export interface SwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentPropsWithoutRef<typeof Switch>, 'checked' | 'defaultChecked' | 'onCheckedChange'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  components?: Partial<SwitchFieldComponents>;
}

const SwitchField = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ control, name, className, label, description, components, ...props }, ref) => {
    // Extract custom components with fallbacks
    const SwitchComponent = components?.Switch || DefaultSwitchPrimitive;
    const SwitchThumbComponent = components?.SwitchThumb || DefaultSwitchThumbPrimitive;

    return (
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
              <SwitchComponent ref={field.ref} checked={field.value} onCheckedChange={field.onChange} {...props}>
                <SwitchThumbComponent />
              </SwitchComponent>
            </FormControl>
          </FormItem>
        )}
      />
    );
  },
);

SwitchField.displayName = 'SwitchField';

export { SwitchField };
