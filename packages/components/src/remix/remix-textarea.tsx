import { useRemixFormContext } from 'remix-hook-form';
import { TextField, type TextFieldProps } from '../ui/text-field';
import type { FieldComponents } from '../ui/form';
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';

export type RemixTextareaProps = Omit<TextFieldProps, 'control'>;

export function RemixTextarea(props: RemixTextareaProps) {
  const { control } = useRemixFormContext();

  const components: Partial<FieldComponents> = {
    FormControl: RemixFormControl,
    FormLabel: RemixFormLabel,
    FormDescription: RemixFormDescription,
    FormMessage: RemixFormMessage,
  };

  return <TextField control={control} components={components} {...props} />;
}
