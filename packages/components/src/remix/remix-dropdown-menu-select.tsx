import { useRemixFormContext } from 'remix-hook-form';
import { DropdownMenuSelectField, type DropdownMenuSelectProps } from '../ui/dropdown-menu-select-field';

export type RemixDropdownMenuSelectProps = Omit<DropdownMenuSelectProps, 'control'>;

export function RemixDropdownMenuSelect(props: RemixDropdownMenuSelectProps) {
  const { control } = useRemixFormContext();

  return <DropdownMenuSelectField control={control} {...props} />;
}
