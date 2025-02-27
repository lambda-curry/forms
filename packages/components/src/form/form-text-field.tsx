import { useRemixFormContext } from 'remix-hook-form';
import { TextField, type TextFieldProps } from '../ui/text-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';

export type FormTextFieldProps = Omit<TextFieldProps, 'control'>;

export function FormTextField(props: FormTextFieldProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormDescription: FormDescription,
    FormMessage: FormMessage,
  };

  return <TextField control={control} components={components} {...props} />;
}
