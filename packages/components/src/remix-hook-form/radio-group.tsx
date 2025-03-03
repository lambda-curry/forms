import { useRemixFormContext } from 'remix-hook-form';
import { RadioGroupField as BaseRadioGroupField, type RadioGroupFieldProps as BaseRadioGroupFieldProps } from '../ui/radio-group-field';

export type RadioGroupFieldProps = Omit<BaseRadioGroupFieldProps, 'control'>;

export function RadioGroup(props: RadioGroupFieldProps) {
  const { control } = useRemixFormContext();

  return <BaseRadioGroupField control={control} {...props} />;
}
