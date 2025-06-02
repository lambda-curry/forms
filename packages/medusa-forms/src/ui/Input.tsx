import { Input as MedusaInput } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaInputProps } from './types';

export type InputProps = MedusaInputProps & BasicFieldProps;

const Wrapper = FieldWrapper<InputProps>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Wrapper {...props}>{(inputProps) => <MedusaInput {...inputProps} ref={ref} />}</Wrapper>
));

Input.displayName = 'Input';
