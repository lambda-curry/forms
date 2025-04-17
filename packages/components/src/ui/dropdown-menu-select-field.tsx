// biome-ignore lint/style/noNamespaceImport: from Radix
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type * as React from 'react';
import { createContext, useContext, useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from './button';
import { DropdownMenuContent } from './dropdown-menu';
import {
  DropdownMenuCheckboxItem as BaseDropdownMenuCheckboxItem,
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuRadioItem as BaseDropdownMenuRadioItem,
} from './dropdown-menu';
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
> extends Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Root>, 'onChange' | 'value'> {
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

export function DropdownMenuSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  children,
  className,
  labelClassName,
  dropdownClassName,
  components,
  ...props
}: DropdownMenuSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel Component={components?.FormLabel} className={labelClassName}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <DropdownMenuPrimitive.Root
              {...field}
              open={open}
              onOpenChange={setOpen}
              {...props}
              data-slot="dropdown-menu-select-root"
            >
              <DropdownMenuSelectContext.Provider value={{ onValueChange: field.onChange, value: field.value }}>
                <DropdownMenuPrimitive.Trigger asChild>
                  <Button className={dropdownClassName} data-slot="dropdown-select-trigger">
                    {field.value ? field.value : 'Select an option'}
                  </Button>
                </DropdownMenuPrimitive.Trigger>
                <DropdownMenuContent data-slot="dropdown-select-content">{children}</DropdownMenuContent>
              </DropdownMenuSelectContext.Provider>
            </DropdownMenuPrimitive.Root>
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          <FormMessage Component={components?.FormMessage}>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}

DropdownMenuSelectField.displayName = 'DropdownMenuSelect';

// Context to wire menu items to form field
interface DropdownMenuSelectContextValue<T> {
  onValueChange: (value: T) => void;
  value: T;
}
const DropdownMenuSelectContext = createContext<DropdownMenuSelectContextValue<unknown> | null>(null);

/** Hook to access select context in item wrappers */
export function useDropdownMenuSelectContext<T = unknown>() {
  const ctx = useContext(DropdownMenuSelectContext);
  if (!ctx) {
    throw new Error('useDropdownMenuSelectContext must be used within DropdownMenuSelectField');
  }
  return ctx as { onValueChange: (value: T) => void; value: T };
}

/** Single-select menu item */
export function DropdownMenuSelectItem({
  value,
  children,
  ...props
}: { value: string; children: React.ReactNode } & React.ComponentProps<typeof BaseDropdownMenuItem>) {
  const { onValueChange } = useDropdownMenuSelectContext<string>();
  return (
    <BaseDropdownMenuItem {...props} onSelect={() => onValueChange(value)}>
      {children}
    </BaseDropdownMenuItem>
  );
}

/** Multi-select checkbox menu item */
export function DropdownMenuSelectCheckboxItem({
  value,
  children,
  ...props
}: { value: string; children: React.ReactNode } & React.ComponentProps<typeof BaseDropdownMenuCheckboxItem>) {
  const { onValueChange, value: selected } = useDropdownMenuSelectContext<string[]>();
  const isChecked = Array.isArray(selected) && selected.includes(value);
  const handleChange = () => {
    const newValue = isChecked ? selected.filter((v) => v !== value) : [...(selected || []), value];
    onValueChange(newValue);
  };
  return (
    <BaseDropdownMenuCheckboxItem {...props} checked={isChecked} onCheckedChange={handleChange}>
      {children}
    </BaseDropdownMenuCheckboxItem>
  );
}

/** Radio-select menu item */
export function DropdownMenuSelectRadioItem({
  value: itemValue,
  children,
  ...props
}: { value: string; children: React.ReactNode } & React.ComponentProps<typeof BaseDropdownMenuRadioItem>) {
  const { onValueChange } = useDropdownMenuSelectContext<string>();
  return (
    <BaseDropdownMenuRadioItem value={itemValue} {...props} onSelect={() => onValueChange(itemValue)}>
      {children}
    </BaseDropdownMenuRadioItem>
  );
}
