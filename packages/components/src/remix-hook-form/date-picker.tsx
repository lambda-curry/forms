import { useRemixFormContext } from 'remix-hook-form';
import {
  DatePickerField as BaseDatePickerField,
  type DatePickerFieldProps as BaseDatePickerFieldProps,
} from '../ui/date-picker-field';

export type DatePickerProps = Omit<BaseDatePickerFieldProps, 'control'>;

export function DatePicker({ components, ...props }: DatePickerProps) {
  const { control } = useRemixFormContext();

  return <BaseDatePickerField control={control} components={{ ...components }} {...props} />;
}
