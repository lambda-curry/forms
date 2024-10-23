// biome-ignore lint/style/noNamespaceImport: from Radix
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';

const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export interface RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ComponentPropsWithoutRef<typeof RadioGroup>, 'onValueChange'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  components?: Partial<FieldComponents>;
}

const RadioGroupField = forwardRef<ElementRef<typeof RadioGroup>, RadioGroupFieldProps>(
  ({ control, name, label, description, className, components, ...props }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <FormControl Component={components?.FormControl}>
              <RadioGroup ref={ref} onValueChange={field.onChange} defaultValue={field.value} {...props} />
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            <FormMessage Component={components?.FormMessage} />
          </FormItem>
        )}
      />
    );
  },
);
RadioGroupField.displayName = 'RadioGroupField';

export { RadioGroup, RadioGroupItem, RadioGroupField };
