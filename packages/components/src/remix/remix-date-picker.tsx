import { useRemixFormContext } from "remix-hook-form";
import { DatePicker, type DatePickerProps } from "../ui/date-picker";

export type RemixDatePickerProps = Omit<DatePickerProps, 'control'>;

export function RemixDatePicker(props: RemixDatePickerProps) {
  const { control } = useRemixFormContext();

  return <DatePicker control={control} {...props} />;
}