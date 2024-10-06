import { useRemixFormContext } from 'remix-hook-form'
import { Checkbox, type CheckboxProps } from '../ui/checkbox'
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';
import type { FieldComponents } from '../ui/form';

export type RemixCheckboxProps = Omit<CheckboxProps, 'control'>;

export function RemixCheckbox(props: RemixCheckboxProps) {
  const { control } = useRemixFormContext();


  const components: Partial<FieldComponents> = {
    FormDescription: RemixFormDescription,
    FormControl: RemixFormControl,
    FormLabel: RemixFormLabel,
    FormMessage: RemixFormMessage,
  };

  return <Checkbox control={control} {...props} components={components} />;
}