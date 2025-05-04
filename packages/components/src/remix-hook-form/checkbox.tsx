import { useRemixFormContext } from 'remix-hook-form';
import {
  CheckboxField as BaseCheckbox,
  type CheckboxProps as BaseCheckboxProps,
  type CheckboxFieldComponents,
} from '../ui/checkbox-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export type CheckboxProps = Omit<BaseCheckboxProps, 'control'>;

export function Checkbox(props: CheckboxProps) {
  const { control } = useRemixFormContext();

  // Destructure components from props to avoid it being overridden
  const { components: customComponents, ...restProps } = props;

  // Create a new components object that merges the default components with any custom components
  const mergedComponents: Partial<CheckboxFieldComponents> = {
    FormDescription,
    FormControl,
    FormLabel,
    FormMessage,
    ...customComponents, // Merge user components
  };

  // Pass the merged components to the BaseCheckbox
  return <BaseCheckbox control={control} components={mergedComponents} {...restProps} />;
}
