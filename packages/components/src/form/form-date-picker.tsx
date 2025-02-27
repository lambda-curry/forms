import { useRemixFormContext } from 'remix-hook-form';
import { DatePickerField, type DatePickerFieldProps } from '../ui/date-picker-field';

export type FormDatePickerProps = Omit<DatePickerFieldProps, 'control'>;

export function FormDatePicker(props: FormDatePickerProps) {
  const { control } = useRemixFormContext();

  return <DatePickerField control={control} {...props} />;
}
