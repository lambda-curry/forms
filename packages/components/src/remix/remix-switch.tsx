import { useMemo, type ComponentPropsWithoutRef } from 'react';
import { useRemixFormContext } from 'remix-hook-form'
import { Switch } from '../ui/switch'
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';

export interface RemixSwitchProps extends Omit<ComponentPropsWithoutRef<typeof Switch>, 'control'> {
  name: string;
  label?: string;
  description?: string;
}

export function RemixSwitch({ name, label, description, ...props }: RemixSwitchProps) {
  const { control } = useRemixFormContext();

  const components = useMemo(
    () => ({
      FormDescription: RemixFormDescription,
      FormControl: RemixFormControl,
      FormLabel: RemixFormLabel,
      FormMessage: RemixFormMessage,
    }),
    []
  );

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

