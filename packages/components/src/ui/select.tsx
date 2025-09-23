import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Popover } from '@radix-ui/react-popover';
import { Check as DefaultCheckIcon, ChevronDown as DefaultChevronIcon } from 'lucide-react';
import type * as React from 'react';

import { useOverlayTriggerState } from 'react-stately';
import { PopoverTrigger } from './popover';
import { cn } from './utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import {
  forwardRef,
  type Ref,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ComponentType,
  type RefAttributes,
  useId,
  useRef,
} from 'react';
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectUIComponents {
  Trigger?: ComponentType<ButtonHTMLAttributes<HTMLButtonElement> & RefAttributes<HTMLButtonElement>>;
  Item?: ComponentType<
    ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean } & RefAttributes<HTMLButtonElement>
  >;
  SearchInput?: ComponentType<React.ComponentPropsWithoutRef<typeof CommandInput>>;
  CheckIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ChevronIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export type SelectContentProps = Pick<
  React.ComponentProps<typeof PopoverPrimitive.Content>,
  'align' | 'side' | 'sideOffset'
>;

export interface SelectProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  components?: Partial<SelectUIComponents>;
  // Content positioning props (forwarded to Radix PopoverPrimitive.Content)
  contentProps?: SelectContentProps;
  // Search behavior
  searchable?: boolean;
  searchInputProps?: React.ComponentPropsWithoutRef<typeof CommandInput>;
  // Creatable behavior
  creatable?: boolean;
  onCreateOption?: (input: string) => SelectOption | Promise<SelectOption>;
  createOptionLabel?: (input: string) => string;
}

// Default search input built on top of CommandInput. Supports cmdk props at runtime.
const DefaultSearchInput = forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<typeof CommandInput>>(
  (props, _ref) => <CommandInput {...props} />,
);
DefaultSearchInput.displayName = 'SelectSearchInput';

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  contentClassName,
  itemClassName,
  components,
  contentProps,
  searchable = true,
  searchInputProps,
  creatable = false,
  onCreateOption,
  createOptionLabel,
  ...buttonProps
}: SelectProps) {
  const popoverState = useOverlayTriggerState({});
  const listboxId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // No need for JavaScript width measurement - Radix provides --radix-popover-trigger-width CSS variable

  // When opening, ensure the currently selected option is the active item for keyboard nav
  useEffect(() => {
    if (!popoverState.isOpen) return;
    requestAnimationFrame(() => {
      const selectedEl = selectedItemRef.current as HTMLElement | null;
      if (selectedEl) selectedEl.scrollIntoView({ block: 'center' });
    });
  }, [popoverState.isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  const Trigger =
    components?.Trigger ||
    forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
      <button ref={ref} type="button" {...props} />
    ));
  Trigger.displayName = Trigger.displayName || 'SelectTrigger';

  const Item =
    components?.Item ||
    forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }>((props, ref) => (
      <button ref={ref} type="button" {...props} />
    ));
  Item.displayName = Item.displayName || 'SelectItem';

  const CheckIcon = components?.CheckIcon || DefaultCheckIcon;
  const ChevronIcon = components?.ChevronIcon || DefaultChevronIcon;
  const SearchInput = components?.SearchInput || DefaultSearchInput;

  return (
    <Popover open={popoverState.isOpen} onOpenChange={popoverState.setOpen}>
      <PopoverTrigger asChild>
        <Trigger
          ref={triggerRef}
          disabled={disabled}
          className={cn(
            'flex items-center justify-between w-full sm:text-base rounded-md border border-input bg-background px-3 py-2 h-10 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={popoverState.isOpen}
          aria-controls={listboxId}
          {...buttonProps}
        >
          {value !== '' ? (selectedOption?.label ?? value) : placeholder}
          <ChevronIcon className="w-4 h-4 opacity-50" />
        </Trigger>
      </PopoverTrigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={popoverRef}
          align={contentProps?.align ?? 'start'}
          side={contentProps?.side}
          sideOffset={contentProps?.sideOffset ?? 4}
          className={cn(
            'z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'p-0 shadow-md border-0 min-w-2xs',
            contentClassName,
          )}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          data-slot="popover-content"
          data-align={contentProps?.align ?? 'start'}
        >
          <Command className="bg-white rounded-md focus:outline-none sm:text-sm w-full">
            {searchable && (
              <div className="px-1.5 pb-1.5 pt-1.5">
                <SearchInput
                  placeholder="Search..."
                  value={searchQuery}
                  onValueChange={(v: string) => {
                    setSearchQuery(v);
                    searchInputProps?.onValueChange?.(v);
                  }}
                  {...searchInputProps}
                />
              </div>
            )}
            <CommandList id={listboxId} role="listbox" className="max-h-[200px] rounded-md w-full">
              <CommandEmpty className="px-3 py-2 text-sm text-gray-500">No results.</CommandEmpty>
              <CommandGroup>
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  const commonProps = {
                    'data-selected': isSelected ? 'true' : 'false',
                    'data-value': option.value,
                    'data-testid': `select-option-${option.value}`,
                  } as const;

                  // When a custom Item is provided, use asChild to let it render as the actual item element
                  if (components?.Item) {
                    const CustomItem = Item;
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          onValueChange?.(option.value);
                          popoverState.close();
                        }}
                        value={option.label}
                        id={`${listboxId}-option-${index}`}
                        role="option"
                        {...commonProps}
                        className={cn(itemClassName)}
                        // Attach ref to CommandItem (even with asChild) so we can focus the selected item on open
                        ref={isSelected ? (selectedItemRef as unknown as Ref<HTMLDivElement>) : undefined}
                        asChild
                      >
                        <CustomItem selected={isSelected}>
                          {isSelected && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
                          <span className={cn('block truncate', !isSelected && 'ml-6', isSelected && 'font-semibold')}>
                            {option.label}
                          </span>
                        </CustomItem>
                      </CommandItem>
                    );
                  }

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        onValueChange?.(option.value);
                        popoverState.close();
                      }}
                      value={option.label}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      {...commonProps}
                      className={cn(
                        'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded',
                        'text-gray-900',
                        isSelected ? 'bg-gray-100' : 'hover:bg-gray-100',
                        itemClassName,
                      )}
                      // Ensure we can programmatically focus the selected item when opening
                      ref={isSelected ? (selectedItemRef as unknown as Ref<HTMLDivElement>) : undefined}
                    >
                      {isSelected && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
                      <span className={cn('block truncate', !isSelected && 'ml-6', isSelected && 'font-semibold')}>
                        {option.label}
                      </span>
                    </CommandItem>
                  );
                })}
                {(() => {
                  const q = searchQuery.trim();
                  const lower = q.toLowerCase();
                  const hasExactMatch =
                    q.length > 0 &&
                    options.some((o) => o.label.toLowerCase() === lower || o.value.toLowerCase() === lower);
                  if (!creatable || !q || hasExactMatch) return null;
                  const label = createOptionLabel?.(q) ?? `Select "${q}"`;
                  return (
                    <CommandItem
                      key={`__create__-${q}`}
                      data-value={`__create__-${q}`}
                      value={q}
                      role="option"
                      onSelect={async () => {
                        if (!onCreateOption) return;
                        const created = await onCreateOption(q);
                        if (created?.value) onValueChange?.(created.value);
                        popoverState.close();
                      }}
                      className={cn(
                        'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded',
                        'text-gray-900 hover:bg-gray-100',
                        itemClassName,
                      )}
                    >
                      <span className="block truncate font-semibold">{label}</span>
                    </CommandItem>
                  );
                })()}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </Popover>
  );
}
