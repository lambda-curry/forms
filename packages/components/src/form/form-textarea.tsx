import { useRemixFormContext } from 'remix-hook-form';
import { TextareaField, type TextareaFieldProps } from '../ui/textarea-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';

export type FormTextareaProps = Omit<TextareaFieldProps, 'control'>;

export function FormTextarea(props: FormTextareaProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormDescription: FormDescription,
    FormMessage: FormMessage,
  };

  return <TextareaField control={control} components={components} {...props} />;
}
