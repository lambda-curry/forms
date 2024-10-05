import { useRemixFormContext } from 'remix-hook-form';
import { RadioGroupField, type RadioGroupFieldProps } from '../ui/radio-group';

export type RemixRadioGroupFieldProps = Omit<RadioGroupFieldProps, 'control'>;

export function RemixRadioGroupField(props: RemixRadioGroupFieldProps) {
  const { control } = useRemixFormContext();

  return <RadioGroupField control={control} {...props} />;
}