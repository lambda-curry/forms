import { useRemixFormContext } from 'remix-hook-form';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../ui/dropdown-menu';

// Re-export all base components
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};

// Create Remix-specific versions of form-related items
export type RemixDropdownMenuCheckboxItemProps = Omit<
  React.ComponentPropsWithRef<typeof DropdownMenuCheckboxItem>,
  'checked' | 'onCheckedChange'
> & {
  name: string;
};

export function RemixDropdownMenuCheckboxItem({ name, ...props }: RemixDropdownMenuCheckboxItemProps) {
  const { control } = useRemixFormContext();

  return (
    <DropdownMenuCheckboxItem
      checked={control._formValues[name]}
      onCheckedChange={(checked) => {
        control._formValues[name] = checked;
      }}
      {...props}
    />
  );
}

export type RemixDropdownMenuRadioItemProps = Omit<
  React.ComponentPropsWithRef<typeof DropdownMenuRadioItem>,
  'value'
> & {
  name: string;
  value: string;
};

export function RemixDropdownMenuRadioItem({ name, value, ...props }: RemixDropdownMenuRadioItemProps) {
  const { control } = useRemixFormContext();

  return <DropdownMenuRadioItem control={control} value={value} {...props} />;
}
