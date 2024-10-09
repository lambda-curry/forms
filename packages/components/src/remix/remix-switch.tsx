import type { ComponentPropsWithoutRef } from 'react';
import { useRemixFormContext } from 'remix-hook-form'
import { Switch } from '../ui/switch'
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';
import type { FieldComponents } from '../ui/form';

export interface RemixSwitchProps extends Omit<ComponentPropsWithoutRef<typeof Switch>, 'control'> {
  name: string;
  label?: string;
  description?: string;
}

export function RemixSwitch({ name, label, description, ...props }: RemixSwitchProps) {
  const { control } = useRemixFormContext();

  const components: Partial<FieldComponents> = {
    FormDescription: RemixFormDescription,
    FormControl: RemixFormControl,
    FormLabel: RemixFormLabel,
    FormMessage: RemixFormMessage,
  };

  return (
    <Switch
      control={control}
      name={name}
      label={label}
      description={description}
      components={components}
      {...props}
    />
  );
}

