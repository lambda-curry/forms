import { DatePicker } from '@medusajs/ui';
import type * as React from 'react';
import type { FC } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, DatePickerProps } from './types';

export type Props = DatePickerProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
  };

const Wrapper = FieldWrapper<Props>;

export const DatePickerInput: FC<Props> = ({ ref, ...props }) => {
  return <Wrapper {...props}>{(inputProps) => <DatePicker {...{ ...inputProps, ref }} />}</Wrapper>;
};
