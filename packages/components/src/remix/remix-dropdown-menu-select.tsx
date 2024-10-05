import { useRemixFormContext } from 'remix-hook-form';
import { DropdownMenuSelect, type DropdownMenuSelectProps } from '../ui/dropdown-menu-select';

export type RemixDropdownMenuSelectProps = Omit<DropdownMenuSelectProps, 'control'>;

export function RemixDropdownMenuSelect(props: RemixDropdownMenuSelectProps) {
  const { control } = useRemixFormContext();

  return <DropdownMenuSelect control={control} {...props} />;
}