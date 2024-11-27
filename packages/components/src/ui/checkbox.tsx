import { type ComponentPropsWithoutRef, type ReactNode, forwardRef, } from 'react';
// biome-ignore lint/style/noNamespaceImport: from Radix
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { cn } from '../../lib/utils';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface CheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: ReactNode;
  description?: string;
  className?: string;
  components?: Partial<FieldComponents>;
}

const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  ({ control, name, className, label, description, components, ...props }, ref) => (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn('flex flex-row items-start space-x-3 space-y-0', className)} ref={ref}>
          <FormControl Component={components?.FormControl}>
            <CheckboxPrimitive.Root
              ref={field.ref}
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              checked={field.value}
              onCheckedChange={field.onChange}
              {...props}
            >
              <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
                <Check className="h-4 w-4" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && (
              <FormLabel
                Component={components?.FormLabel}
                className="!text-inherit" // Note: adding text-inherit here so the checkbox labels aren't also red during an error state since they are closer to their error text
              >
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
  ),
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
