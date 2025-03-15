import type * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { SwitchField as BaseSwitchField, type SwitchFieldComponents } from '../ui/switch-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseSwitchField>, 'control'> {
  name: string;
  label?: string;
  description?: string;
}

export function Switch({ name, label, description, className, components, ...props }: SwitchProps) {
  const { control } = useRemixFormContext();

  const mergedComponents: Partial<SwitchFieldComponents> = {
    FormDescription,
    FormControl,
    FormLabel,
    FormMessage,
    ...components,
  };

  return (
    <BaseSwitchField
      control={control}
      name={name}
      label={label}
      description={description}
      components={mergedComponents}
      className={className}
      {...props}
    />
  );
}
