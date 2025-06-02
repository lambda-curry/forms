import { CurrencyInput as MedusaCurrencyInput } from '@medusajs/ui';
import type * as React from 'react';
import type { FC } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaCurrencyInputProps } from './types';

export type CurrencyInputProps = MedusaCurrencyInputProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
  };

const Wrapper = FieldWrapper<CurrencyInputProps>;

export const CurrencyInput: FC<CurrencyInputProps> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <MedusaCurrencyInput {...inputProps} ref={ref} />}</Wrapper>
);
