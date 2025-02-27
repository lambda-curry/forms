import { useRemixFormContext } from 'remix-hook-form';
import { RadioGroupField, type RadioGroupFieldProps } from '../ui/radio-group-field';

export type FormRadioGroupFieldProps = Omit<RadioGroupFieldProps, 'control'>;

export function FormRadioGroupField(props: FormRadioGroupFieldProps) {
  const { control } = useRemixFormContext();

  return <RadioGroupField control={control} {...props} />;
}
