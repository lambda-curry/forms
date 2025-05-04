import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
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
import { cn } from './utils';

export interface CheckboxFieldComponents extends FieldComponents {
  Checkbox?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>;
  CheckboxIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>>;
}

export interface CheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  components?: Partial<CheckboxFieldComponents>;
  indicatorClassName?: string;
  checkClassName?: string;
}

const CheckboxField = ({
  control,
  name,
  className,
  label,
  description,
  components,
  indicatorClassName,
  checkClassName,
  ...props
}: CheckboxProps) => {
  // Extract custom components with fallbacks
  const CheckboxComponent = components?.Checkbox || CheckboxPrimitive.Root;
  const IndicatorComponent = components?.CheckboxIndicator || CheckboxPrimitive.Indicator;

  // Determine if we're using custom components
  const isCustomCheckbox = components?.Checkbox !== undefined;
  const isCustomIndicator = components?.CheckboxIndicator !== undefined;

  // Default checkbox className
  const defaultCheckboxClassName =
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground';

  // Default indicator className
  const defaultIndicatorClassName = cn('flex items-center justify-center text-current', indicatorClassName);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('flex flex-row items-start space-y-0', className)}>
          <FormControl Component={components?.FormControl}>
            <CheckboxComponent
              ref={field.ref}
              className={isCustomCheckbox ? undefined : defaultCheckboxClassName}
              checked={field.value}
              onCheckedChange={field.onChange}
              data-slot="checkbox"
              {...props}
            >
              <IndicatorComponent
                className={isCustomIndicator ? undefined : defaultIndicatorClassName}
                data-slot="checkbox-indicator"
              >
                <Check className={cn('h-4 w-4', checkClassName)} />
              </IndicatorComponent>
            </CheckboxComponent>
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && (
              <FormLabel Component={components?.FormLabel} className="!text-inherit">
                {label}
              </FormLabel>
            )}
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};

CheckboxField.displayName = CheckboxPrimitive.Root.displayName;

export { CheckboxField };
