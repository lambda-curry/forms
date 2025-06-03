import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { DatePickerInput, type DatePickerProps } from '../ui/DatePicker';

export type ControlledDatePickerProps<T extends FieldValues> = DatePickerProps &
  Omit<ControllerProps, 'render' | 'control'> & {
    name: Path<T>;
  };

export const ControlledDatePicker = <T extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledDatePickerProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller<T>
      control={control}
      name={name}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
      render={({ field }) => <DatePickerInput {...field} {...props} />}
    />
  );
};

