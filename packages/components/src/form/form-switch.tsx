import type * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { SwitchField } from '../ui/switch-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';

export interface FormSwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof SwitchField>, 'control'> {
  name: string;
  label?: string;
  description?: string;
}

export function FormSwitch({ name, label, description, className, ...props }: FormSwitchProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormDescription: FormDescription,
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormMessage: FormMessage,
  };

  return (
    <SwitchField
      control={control}
      name={name}
      label={label}
      description={description}
      components={components}
      {...props}
    />
  );
}
