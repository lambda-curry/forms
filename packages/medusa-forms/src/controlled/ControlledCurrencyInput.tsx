import type * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { CurrencyInput, type CurrencyInputProps } from '../ui/CurrencyInput';

export type ControlledCurrencyInputProps<T extends FieldValues> = CurrencyInputProps &
  Omit<ControllerProps, 'render' | 'control'> & {
    name: Path<T>;
  };

export const ControlledCurrencyInput = <T extends FieldValues>({
  name,
  rules,
  ...props
}: ControlledCurrencyInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller<T>
      control={control}
      name={name}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
      render={({ field }) => {
        return (
          <CurrencyInput
            {...field}
            {...props}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(e.target.value.replace(/[^0-9.-]+/g, ''));
            }}
          />
        );
      }}
    />
  );
};
