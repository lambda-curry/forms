import { Label } from '../ui/label';
import {
  RadioGroupItemField,
  type RadioGroupItemFieldComponents,
  type RadioGroupItemFieldProps,
} from '../ui/radio-group-item-field';

export type RadioGroupItemProps = RadioGroupItemFieldProps;

export function RadioGroupItem(props: RadioGroupItemProps) {
  // Ensure we preserve any custom components passed in while providing defaults
  const components: Partial<RadioGroupItemFieldComponents> = {
    Label,
    ...props.components,
  };

  return <RadioGroupItemField {...props} components={components} />;
}

RadioGroupItem.displayName = 'RadioGroupItem';
