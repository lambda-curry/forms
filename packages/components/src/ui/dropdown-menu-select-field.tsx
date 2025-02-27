// biome-ignore lint/style/noNamespaceImport: from Radix
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from '../test/button';
import { DropdownMenuContent } from './dropdown-menu';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

export interface DropdownMenuSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>, 'onChange' | 'value'> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  dropdownClassName?: string;
  components?: Partial<FieldComponents>;
}

export const DropdownMenuSelectField = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Root>,
  DropdownMenuSelectProps
>(
  (
    { control, name, label, description, children, className, labelClassName, dropdownClassName, components, ...props },
    ref,
  ) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className} ref={ref}>
            {label && (
              <FormLabel Component={components?.FormLabel} className={labelClassName}>
                {label}
              </FormLabel>
            )}
            <FormControl>
              <DropdownMenuPrimitive.Root {...field} {...props}>
                <DropdownMenuPrimitive.Trigger asChild>
                  <Button className={dropdownClassName}>{field.value ? field.value : 'Select an option'}</Button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuContent>{children}</DropdownMenuContent>
              </DropdownMenuPrimitive.Root>
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            <FormMessage Component={components?.FormMessage}>{fieldState.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    );
  },
);

DropdownMenuSelectField.displayName = 'DropdownMenuSelect';
