import { DatePicker } from '@medusajs/ui';
import type * as React from 'react';
import type { FC } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, DatePickerProps as MedusaDatePickerProps } from './types';

export type DatePickerProps = MedusaDatePickerProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
  };

const Wrapper = FieldWrapper<DatePickerProps>;

export const DatePickerInput: FC<DatePickerProps> = ({ ref, ...props }) => {
  return <Wrapper {...props}>{(inputProps) => <DatePicker {...{ ...inputProps, ref }} />}</Wrapper>;
};
