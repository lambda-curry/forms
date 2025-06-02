import { Select as MedusaSelect } from '@medusajs/ui';
import { forwardRef } from 'react';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, SelectProps as MedusaSelectProps } from './types';

export type SelectProps = MedusaSelectProps & BasicFieldProps;

const Wrapper = FieldWrapper<SelectProps>;

const SelectComponent = forwardRef<unknown, SelectProps>((props, ref) => {
  return (
    <Wrapper {...props}>
      {(inputProps) => <MedusaSelect {...{ ...inputProps, ref }}>{props.children}</MedusaSelect>}
    </Wrapper>
  );
});

SelectComponent.displayName = 'Select';

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
