import { useRemixFormContext } from 'remix-hook-form';
import {
  DropdownMenuSelectField as BaseDropdownMenuSelectField,
  type DropdownMenuSelectProps as BaseDropdownMenuSelectProps,
} from '../ui/dropdown-menu-select-field';

export type DropdownMenuSelectProps = Omit<BaseDropdownMenuSelectProps, 'control'>;

export function DropdownMenuSelect(props: DropdownMenuSelectProps) {
  const { control } = useRemixFormContext();

  return <BaseDropdownMenuSelectField control={control} {...props} />;
}
