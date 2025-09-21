import type * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { FormField, FormItem } from '../ui/form';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';
import { type CommandSelectProps, CommandSelect } from '../ui/select-command';

export interface SelectCommandProps extends Omit<CommandSelectProps, 'value' | 'onValueChange'> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  components?: Partial<{
    FormControl: React.ComponentType<React.ComponentProps<typeof FormControl>>;
    FormLabel: React.ComponentType<React.ComponentProps<typeof FormLabel>>;
    FormDescription: React.ComponentType<React.ComponentProps<typeof FormDescription>>;
    FormMessage: React.ComponentType<React.ComponentProps<typeof FormMessage>>;
  }>;
}

export function SelectCommand({ name, label, description, className, components, ...props }: SelectCommandProps) {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
          <FormControl Component={components?.FormControl}>
            <CommandSelect {...props} value={field.value} onValueChange={field.onChange} />
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          <FormMessage Component={components?.FormMessage} />
        </FormItem>
      )}
    />
  );
}
