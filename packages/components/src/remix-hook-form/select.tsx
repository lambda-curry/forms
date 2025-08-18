import * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';
import { FormField, FormItem } from '../ui/form';
import { Select as UISelect, type SelectProps as UISelectProps } from '../ui/select';

export interface SelectProps extends Omit<UISelectProps, 'value' | 'onValueChange'> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
}

export function Select({
  name,
  label,
  description,
  className,
  ...props
}: SelectProps) {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <UISelect
              {...props}
              value={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

