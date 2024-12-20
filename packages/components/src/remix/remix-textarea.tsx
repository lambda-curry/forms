import { useRemixFormContext } from 'remix-hook-form';
import { TextareaField, type TextareaFieldProps } from '../ui/textarea-field';
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';

export type RemixTextareaProps = Omit<TextareaFieldProps, 'control'>;

export function RemixTextarea(props: RemixTextareaProps) {
  const { control } = useRemixFormContext();

  const components = {
    FormControl: RemixFormControl,
    FormLabel: RemixFormLabel,
    FormDescription: RemixFormDescription,
    FormMessage: RemixFormMessage,
  };

  return <TextareaField control={control} components={components} {...props} />;
}
