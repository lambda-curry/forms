import { Textarea } from '@medusajs/ui';
import type * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, TextAreaProps } from './types';

export type Props = TextAreaProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLTextAreaElement>;
  };

const Wrapper = FieldWrapper<Props>;

export const TextArea: React.FC<Props> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <Textarea {...inputProps} ref={ref} />}</Wrapper>
);
