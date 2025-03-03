import { useRemixFormContext } from 'remix-hook-form';
import { Checkbox as BaseCheckbox, type CheckboxProps as BaseCheckboxProps } from '../ui/checkbox-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';

export type CheckboxProps = Omit<BaseCheckboxProps, 'control'>;

export function Checkbox(props: CheckboxProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormDescription: FormDescription,
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormMessage: FormMessage,
  };

  return <BaseCheckbox control={control} {...props} components={components} />;
}
