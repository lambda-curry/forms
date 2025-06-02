import { Textarea } from '@medusajs/ui';
import type * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, TextAreaProps as MedusaTextAreaProps } from './types';

export type TextAreaProps = MedusaTextAreaProps &
  BasicFieldProps & {
    ref?: React.Ref<HTMLTextAreaElement>;
  };

const Wrapper = FieldWrapper<TextAreaProps>;

export const TextArea: React.FC<TextAreaProps> = ({ ref, ...props }) => (
  <Wrapper {...props}>{(inputProps) => <Textarea {...inputProps} ref={ref} />}</Wrapper>
);
