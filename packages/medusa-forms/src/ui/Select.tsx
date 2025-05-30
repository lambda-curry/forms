import { Select as MedusaSelect } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, SelectProps } from './types';

export type Props = SelectProps & BasicFieldProps;

const Wrapper = FieldWrapper<Props>;

const SelectComponent = forwardRef<unknown, Props>((props, ref) => {
  return (
    <Wrapper {...props}>
      {(inputProps) => <MedusaSelect {...{ ...inputProps, ref }}>{props.children}</MedusaSelect>}
    </Wrapper>
  );
});

type SelectComponent = typeof SelectComponent & {
  Trigger: typeof MedusaSelect.Trigger;
  Value: typeof MedusaSelect.Value;
  Content: typeof MedusaSelect.Content;
  Item: typeof MedusaSelect.Item;
};

export const Select: SelectComponent = Object.assign(SelectComponent, {
  Trigger: MedusaSelect.Trigger,
  Value: MedusaSelect.Value,
  Content: MedusaSelect.Content,
  Item: MedusaSelect.Item,
});
