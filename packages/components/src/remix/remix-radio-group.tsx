import { useRemixFormContext } from 'remix-hook-form';
import { RadioGroupField, type RadioGroupFieldProps } from '../ui/radio-group-field';

export type RemixRadioGroupFieldProps = Omit<RadioGroupFieldProps, 'control'>;

export function RemixRadioGroupField(props: RemixRadioGroupFieldProps) {
  const { control } = useRemixFormContext();

  return <RadioGroupField control={control} {...props} />;
}
