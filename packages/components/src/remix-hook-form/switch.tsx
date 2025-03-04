import type * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { SwitchField as BaseSwitchField } from '../ui/switch-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseSwitchField>, 'control'> {
  name: string;
  label?: string;
  description?: string;
}

export function Switch({ name, label, description, className, ...props }: SwitchProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormDescription: FormDescription,
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormMessage: FormMessage,
  };

  return (
    <BaseSwitchField
      control={control}
      name={name}
      label={label}
      description={description}
      components={components}
      {...props}
    />
  );
}
