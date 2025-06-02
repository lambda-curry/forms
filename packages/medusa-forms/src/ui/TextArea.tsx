import { Textarea } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, TextAreaProps as MedusaTextAreaProps } from './types';

export type TextAreaProps = MedusaTextAreaProps & BasicFieldProps;

const Wrapper = FieldWrapper<TextAreaProps>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => (
  <Wrapper {...props}>{(inputProps) => <Textarea {...inputProps} ref={ref} />}</Wrapper>
));

TextArea.displayName = 'TextArea';
