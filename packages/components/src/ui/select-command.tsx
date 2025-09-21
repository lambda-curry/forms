import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Popover } from '@radix-ui/react-popover';
import { Check as DefaultCheckIcon, ChevronDown as DefaultChevronIcon } from 'lucide-react';
import * as React from 'react';
import { PopoverTrigger } from './popover';
import { cn } from './utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';

export interface CommandSelectOption {
  label: string;
  value: string;
}

export interface CommandSelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  options: CommandSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  // Icons can be swapped if desired
  CheckIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ChevronIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function CommandSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  contentClassName,
  itemClassName,
  CheckIcon = DefaultCheckIcon,
  ChevronIcon = DefaultChevronIcon,
  ...buttonProps
}: CommandSelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const listboxId = React.useId();

  const selectedOption = options.find((o) => o.value === value);

  // Note: scroll-into-view functionality removed due to ref limitations with Command components
  // This could be re-implemented using a different approach if needed

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          className={cn(
            'flex items-center justify-between w-full sm:text-base rounded-md border border-input bg-background px-3 py-2 h-10 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          {...buttonProps}
        >
          {selectedOption?.label || placeholder}
          <ChevronIcon className="w-4 h-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'p-0 shadow-md border-0 min-w-[8rem]',
            contentClassName,
          )}
          role="listbox"
          id={listboxId}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          data-slot="popover-content"
        >
          <Command className="bg-white rounded-md focus:outline-none sm:text-sm w-full">
            <CommandInput autoFocus placeholder="Search..." />
            <CommandEmpty>No results.</CommandEmpty>
            {/* CommandList renders a div. */}
            <CommandList className="max-h-[200px] overflow-y-auto rounded-md w-full">
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <CommandItem
                      key={option.value}
                      // Keep a ref on the selected item so we can scroll it into view on open
                      value={`${option.label} ${option.value}`}
                      onSelect={() => {
                        onValueChange?.(option.value);
                        setOpen(false);
                        // Return focus to trigger for accessibility
                        requestAnimationFrame(() => triggerRef.current?.focus());
                      }}
                      className={cn(
                        'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded',
                        'text-gray-900',
                        isSelected ? 'bg-gray-100' : 'hover:bg-gray-100',
                        itemClassName,
                      )}
                      role="option"
                      aria-selected={isSelected}
                      data-value={option.value}
                      data-testid={`select-option-${option.value}`}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
                      <span className={cn('block truncate', !isSelected && 'ml-6', isSelected && 'font-semibold')}>
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}
