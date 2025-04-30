import { TextField as BaseTextField, type TextInputProps as BaseTextFieldProps } from '../ui/text-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

import { useRemixFormContext } from 'remix-hook-form';

export type TextFieldProps = Omit<BaseTextFieldProps, 'control'>;

export function TextField(props: TextFieldProps) {
  const { control } = useRemixFormContext();

  // Merge the provided components with the default form components
  const defaultComponents = {
    FormControl,
    FormLabel,
    FormDescription,
    FormMessage,
  };
  
  const components = {
    ...defaultComponents,
    ...props.components,
  };

  return <BaseTextField control={control} components={components} {...props} />;
}
