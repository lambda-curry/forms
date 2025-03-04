import { useRemixFormContext } from 'remix-hook-form';
import { TextField as BaseTextField, type TextFieldProps as BaseTextFieldProps } from '../ui/text-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export type TextFieldProps = Omit<BaseTextFieldProps, 'control'>;

export function TextField(props: TextFieldProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormDescription: FormDescription,
    FormMessage: FormMessage,
  };

  return <BaseTextField control={control} components={components} {...props} />;
}
