import { useRemixFormContext } from 'remix-hook-form';
import { Checkbox, type CheckboxProps } from '../ui/checkbox-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';

export type FormCheckboxProps = Omit<CheckboxProps, 'control'>;

export function FormCheckbox(props: FormCheckboxProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormDescription: FormDescription,
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormMessage: FormMessage,
  };

  return <Checkbox control={control} {...props} components={components} />;
}
