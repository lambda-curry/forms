import { useRemixFormContext } from 'remix-hook-form';
import { DropdownMenuSelectField, type DropdownMenuSelectProps } from '../ui/dropdown-menu-select-field';

export type FormDropdownMenuSelectProps = Omit<DropdownMenuSelectProps, 'control'>;

export function FormDropdownMenuSelect(props: FormDropdownMenuSelectProps) {
  const { control } = useRemixFormContext();

  return <DropdownMenuSelectField control={control} {...props} />;
}
