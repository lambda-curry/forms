import { CurrencyInput as MedusaCurrencyInput } from '@medusajs/ui';
import { type FC } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaCurrencyInputProps } from './types';

export type Props = MedusaCurrencyInputProps & BasicFieldProps & {
  ref?: React.Ref<HTMLInputElement>;
};

const Wrapper = FieldWrapper<Props>;

export const CurrencyInput: FC<Props> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <MedusaCurrencyInput {...inputProps} ref={ref} />}</Wrapper>
);

