import type { ComponentProps } from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { Input, type InputProps } from '../ui/Input';

export type ControlledInputProps<T extends FieldValues> = InputProps &
  Omit<ControllerProps, 'render'> & {
    name: Path<T>;
    rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  } & ComponentProps<typeof Input> &
  Omit<ControllerProps<T>, 'render'>;

export const ControlledInput = <T extends FieldValues>({
  name,
  rules,
  onChange,
  ...props
}: ControlledInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
      render={({ field }) => (
        <Input
          {...field}
          {...props}
          labelClassName={props.labelClassName}
          formErrors={errors}
          onChange={(evt) => {
            if (onChange) {
              onChange(evt);
            }
            field.onChange(evt);
          }}
        />
      )}
    />
  );
};

