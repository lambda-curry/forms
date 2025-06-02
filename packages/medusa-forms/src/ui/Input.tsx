import { Input as MedusaInput } from '@medusajs/ui';
import type * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaInputProps } from './types';

export type InputProps = MedusaInputProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
  };

const Wrapper = FieldWrapper<InputProps>;

export const Input: React.FC<InputProps> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <MedusaInput {...inputProps} ref={ref} />}</Wrapper>
);
