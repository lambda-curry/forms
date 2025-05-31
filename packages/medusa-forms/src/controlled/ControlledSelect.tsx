import type * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPathValue,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { Select, type Props as SelectProps } from '../ui/Select';

type Props<T extends FieldValues> = SelectProps &
  Omit<ControllerProps, 'render'> & {
    name: Path<T>;
    onBlur?: () => void;
    onChange?: (value: unknown) => void;
  } & (
    | {
        options: { label: React.ReactNode; value: FieldPathValue<T, Path<T>> }[];
        children?: never;
      }
    | {
        options?: never;
        children: React.ReactNode;
      }
  );

export const ControlledSelect = <T extends FieldValues>({
  name,
  rules,
  children,
  options,
  onChange,
  onBlur,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller<T>
      control={control}
      name={name}
      rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
      render={({ field }) => {
        const handleChange = (value: unknown) => {
          if (typeof onChange === 'function') onChange(value);
          field.onChange(value);
        };

        if (options) {
          return (
            <Select {...({ ...field, ...props, onValueChange: handleChange } as SelectProps)}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {options.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          );
        }

        return <Select {...({ ...field, ...props, onValueChange: handleChange } as SelectProps)}>{children}</Select>;
      }}
    />
  );
};
