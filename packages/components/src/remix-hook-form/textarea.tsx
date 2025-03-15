import { useRemixFormContext } from 'remix-hook-form';
import {
  TextareaField as BaseTextareaField,
  type TextareaFieldProps as BaseTextareaFieldProps,
  type TextareaFieldComponents,
} from '../ui/textarea-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export type TextareaProps = Omit<BaseTextareaFieldProps, 'control'>;

export function Textarea(props: TextareaProps) {
  const { control } = useRemixFormContext();

  const components: Partial<TextareaFieldComponents> = {
    FormControl,
    FormLabel,
    FormDescription,
    FormMessage,
    ...props.components,
  };

  return <BaseTextareaField control={control} components={components} {...props} />;
}
