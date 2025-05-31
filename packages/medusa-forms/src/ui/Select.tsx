import { Select as MedusaSelect } from '@medusajs/ui';
import { FieldWrapper } from './FieldWrapper';
import type { BasicFieldProps, SelectProps } from './types';

export type Props = SelectProps & BasicFieldProps & {
  ref?: React.Ref<unknown>;
};

const Wrapper = FieldWrapper<Props>;

const SelectComponent: React.FC<Props> = ({ ref, ...props }) => {
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