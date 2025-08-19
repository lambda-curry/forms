import * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';
import { FormField, FormItem } from '../ui/form';
import { Select as UISelect, type SelectProps as UISelectProps, type SelectUIComponents } from '../ui/select';

export interface SelectProps extends Omit<UISelectProps, 'value' | 'onValueChange'> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  components?: Partial<
    {
      FormControl: React.ComponentType<React.ComponentProps<typeof FormControl>>;
      FormLabel: React.ComponentType<React.ComponentProps<typeof FormLabel>>;
      FormDescription: React.ComponentType<React.ComponentProps<typeof FormDescription>>;
      FormMessage: React.ComponentType<React.ComponentProps<typeof FormMessage>>;
    } & SelectUIComponents
  >;
}

export function Select({
  name,
  label,
  description,
  className,
  components,
  ...props
}: SelectProps) {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
          <FormControl Component={components?.FormControl}>
            <UISelect
              {...props}
              value={field.value}
              onValueChange={field.onChange}
              components={{
                Trigger: components?.Trigger,
                Item: components?.Item,
                SearchInput: components?.SearchInput,
                CheckIcon: components?.CheckIcon,
                ChevronIcon: components?.ChevronIcon,
              }}
            />
          </FormControl>
          {description && (
            <FormDescription Component={components?.FormDescription}>{description}</FormDescription>
          )}
          <FormMessage Component={components?.FormMessage} />
        </FormItem>
      )}
    />
  );
}
