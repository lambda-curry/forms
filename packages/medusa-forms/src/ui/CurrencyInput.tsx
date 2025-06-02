import { CurrencyInput as MedusaCurrencyInput } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaCurrencyInputProps } from './types';

export type CurrencyInputProps = MedusaCurrencyInputProps & BasicFieldProps;

const Wrapper = FieldWrapper<CurrencyInputProps>;

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>((props, ref) => (
  <Wrapper {...props}>{(inputProps) => <MedusaCurrencyInput {...inputProps} ref={ref} />}</Wrapper>
));

CurrencyInput.displayName = 'CurrencyInput';
