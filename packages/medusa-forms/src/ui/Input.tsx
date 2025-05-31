import { Input as MedusaInput } from '@medusajs/ui';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, MedusaInputProps } from './types';

export type Props = MedusaInputProps & BasicFieldProps & {
  ref?: React.Ref<HTMLInputElement>;
};

const Wrapper = FieldWrapper<Props>;

export const Input: React.FC<Props> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <MedusaInput {...inputProps} ref={ref} />}</Wrapper>
);