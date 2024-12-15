import { useRemixFormContext } from 'remix-hook-form';
import { DatePickerField, type DatePickerFieldProps } from '../ui/date-picker-field';

export type RemixDatePickerProps = Omit<DatePickerFieldProps, 'control'>;

export function RemixDatePicker(props: RemixDatePickerProps) {
  const { control } = useRemixFormContext();

  return <DatePickerField control={control} {...props} />;
}
