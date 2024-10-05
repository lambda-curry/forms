import { useRemixFormContext } from 'remix-hook-form';
import { TextField, type TextFieldProps } from '../ui/text-field';

export type RemixTextFieldProps = Omit<TextFieldProps, 'control'>;

export function RemixTextField(props: RemixTextFieldProps) {
  const { control } = useRemixFormContext();

  return <TextField control={control} {...props} />;
}
