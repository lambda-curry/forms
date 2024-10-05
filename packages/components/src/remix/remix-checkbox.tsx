import { useRemixFormContext } from 'remix-hook-form'
import { Checkbox, type CheckboxProps } from '../ui/checkbox'

export type RemixCheckboxProps = Omit<CheckboxProps, 'control'>;

export function RemixCheckbox(props: RemixCheckboxProps) {
  const { control } = useRemixFormContext();

  return <Checkbox control={control} {...props} />;
}