import { useRemixFormContext } from 'remix-hook-form';
import { DatePickerField, type DatePickerProps } from '../ui/date-picker-field';

export type RemixDatePickerProps = Omit<DatePickerProps, 'control'>;

export function RemixDatePicker(props: RemixDatePickerProps) {
  const { control } = useRemixFormContext();

  return <DatePickerField control={control} {...props} />;
}
