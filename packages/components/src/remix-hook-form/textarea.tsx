import { useRemixFormContext } from 'remix-hook-form';
import { TextareaField as BaseTextareaField, type TextareaFieldProps as BaseTextareaFieldProps } from '../ui/textarea-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export type TextareaProps = Omit<BaseTextareaFieldProps, 'control'>;

export function Textarea(props: TextareaProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormControl: FormControl,
    FormLabel: FormLabel,
    FormDescription: FormDescription,
    FormMessage: FormMessage,
  };

  return <BaseTextareaField control={control} components={components} {...props} />;
}
