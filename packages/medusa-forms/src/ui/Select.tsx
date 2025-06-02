import { Select as MedusaSelect } from '@medusajs/ui';
import type * as React from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, SelectProps as MedusaSelectProps } from './types';

export type SelectProps = MedusaSelectProps &
  BasicFieldProps & {
    ref?: React.Ref<unknown>;
  };

const Wrapper = FieldWrapper<SelectProps>;

const SelectComponent: React.FC<SelectProps> = ({ ref, ...props }) => {
  return (
    <Wrapper {...props}>
      {(inputProps) => <MedusaSelect {...{ ...inputProps, ref }}>{props.children}</MedusaSelect>}
    </Wrapper>
  );
};

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
