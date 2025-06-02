import { DatePicker } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, DatePickerProps as MedusaDatePickerProps } from './types';

export type DatePickerProps = MedusaDatePickerProps & BasicFieldProps;

const Wrapper = FieldWrapper<DatePickerProps>;

export const DatePickerInput = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  return <Wrapper {...props}>{(inputProps) => <DatePicker {...{ ...inputProps, ref }} />}</Wrapper>;
});

DatePickerInput.displayName = 'DatePickerInput';
