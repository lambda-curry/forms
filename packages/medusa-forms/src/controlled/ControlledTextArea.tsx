import type * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { TextArea, type TextAreaProps } from '../ui/TextArea';

export type ControlledTextAreaProps<T extends FieldValues> = TextAreaProps &
  Omit<ControllerProps, 'render'> & {
    name: Path<T>;
    rules?: RegisterOptions<T, Path<T>>;
  } & React.ComponentProps<typeof TextArea> &
  Omit<ControllerProps<T>, 'render'>;

export const ControlledTextArea = <T extends FieldValues>({ name, rules, ...props }: ControlledTextAreaProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller<T>
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => <TextArea {...field} {...props} />}
    />
  );
};

