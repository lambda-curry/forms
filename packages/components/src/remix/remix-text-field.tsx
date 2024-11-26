import { useMemo } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { TextField, type TextFieldProps } from '../ui/text-field';
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';

export type RemixTextFieldProps = Omit<TextFieldProps, 'control'>;

export function RemixTextField(props: RemixTextFieldProps) {
  const { control } = useRemixFormContext();

  const components = useMemo(
    () => ({
      FormControl: RemixFormControl,
      FormLabel: RemixFormLabel,
      FormDescription: RemixFormDescription,
      FormMessage: RemixFormMessage,
    }),
    []
  );

  return <TextField control={control} components={components} {...props} />;
}
