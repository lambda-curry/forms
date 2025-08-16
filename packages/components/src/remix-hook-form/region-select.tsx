import * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { RegionSelect as UIRegionSelect, type RegionSelectProps as UIRegionSelectProps } from '../ui/region-select';

export interface RegionSelectProps extends Omit<UIRegionSelectProps, 'value' | 'onValueChange'> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
}

export function RegionSelect({
  name,
  label,
  description,
  className,
  ...props
}: RegionSelectProps) {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <UIRegionSelect
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

