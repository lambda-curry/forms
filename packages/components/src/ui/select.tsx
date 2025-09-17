import { Popover } from '@radix-ui/react-popover';
import { Check as DefaultCheckIcon, ChevronDown as DefaultChevronIcon } from 'lucide-react';
import * as React from 'react';
import { useOverlayTriggerState } from 'react-stately';
import { PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectUIComponents {
  Trigger?: React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & React.RefAttributes<HTMLButtonElement>>;
  Item?: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean } & React.RefAttributes<HTMLButtonElement>
  >;
  SearchInput?: React.ComponentType<
    React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>
  >;
  CheckIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  ChevronIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

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
}

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
  ...buttonProps
}: SelectProps) {
  const popoverState = useOverlayTriggerState({});
  const listboxId = React.useId();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const selectedItemRef = React.useRef<HTMLButtonElement>(null);
  const listContainerRef = React.useRef<HTMLUListElement>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (triggerRef.current) setMenuWidth(triggerRef.current.offsetWidth);
  }, []);

  // Scroll to selected item when dropdown opens
  React.useEffect(() => {
    if (popoverState.isOpen && selectedItemRef.current) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: 'nearest' });
      }, 0);
    }
  }, [popoverState.isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = React.useMemo(
    () => (query ? options.filter((o) => `${o.label}`.toLowerCase().includes(query.trim().toLowerCase())) : options),
    [options, query],
  );

  // Reset activeIndex when filtered items change
  React.useEffect(() => {
    setActiveIndex(0);
  }, [filtered]);

  // Reset activeIndex when dropdown opens
  React.useEffect(() => {
    if (popoverState.isOpen) {
      setActiveIndex(0);
    }
  }, [popoverState.isOpen]);

  // Scroll active item into view when activeIndex changes
  React.useEffect(() => {
    if (popoverState.isOpen && listContainerRef.current && filtered.length > 0) {
      const activeElement = listContainerRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, popoverState.isOpen, filtered.length]);

  const Trigger =
    components?.Trigger ||
    React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => (
      <button ref={ref} type="button" {...props} />
    ));
  Trigger.displayName = Trigger.displayName || 'SelectTrigger';

  const Item =
    components?.Item ||
    React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }>(
      (props, ref) => <button ref={ref} type="button" {...props} />,
    );
  Item.displayName = Item.displayName || 'SelectItem';

  const SearchInput =
    components?.SearchInput ||
    React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
      <input ref={ref} {...props} />
    ));
  SearchInput.displayName = SearchInput.displayName || 'SelectSearchInput';

  const CheckIcon = components?.CheckIcon || DefaultCheckIcon;
  const ChevronIcon = components?.ChevronIcon || DefaultChevronIcon;

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
          // biome-ignore lint/a11y/useAriaPropsForRole: using <button> for PopoverTrigger to ensure keyboard accessibility and focus management
          // biome-ignore lint/a11y/useSemanticElements: using <button> for PopoverTrigger to ensure keyboard accessibility and focus management
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={popoverState.isOpen}
          aria-controls={listboxId}
          {...buttonProps}
        >
          {selectedOption?.label || placeholder}
          <ChevronIcon className="w-4 h-4 opacity-50" />
        </Trigger>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className={cn('z-50 p-0 shadow-md border-0', contentClassName)}
        // biome-ignore lint/a11y/useSemanticElements: using <div> for PopoverContent to ensure keyboard accessibility and focus management
        role="listbox"
        id={listboxId}
        style={{ width: menuWidth ? `${menuWidth}px` : undefined }}
      >
        <div className="bg-white p-1.5 rounded-md focus:outline-none sm:text-sm">
          <div className="px-1.5 pb-1.5">
            <SearchInput
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              ref={(el) => {
                if (el) queueMicrotask(() => el.focus());
              }}
              aria-activedescendant={filtered.length > 0 ? `${listboxId}-option-${activeIndex}` : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const toSelect = filtered[activeIndex];
                  if (toSelect) {
                    onValueChange?.(toSelect.value);
                    setQuery('');
                    popoverState.close();
                    triggerRef.current?.focus();
                  }
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setQuery('');
                  popoverState.close();
                  triggerRef.current?.focus();
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActiveIndex((prev) => Math.max(prev - 1, 0));
                }
              }}
              className="w-full h-9 rounded-md bg-white px-2 text-sm leading-none focus:ring-0 focus:outline-none border-0"
            />
          </div>
          <ul ref={listContainerRef} className="max-h-[200px] overflow-y-auto rounded-md">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No results.</li>}
            {filtered.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li key={option.value} className="list-none">
                  <Item
                    ref={isSelected ? selectedItemRef : undefined}
                    onClick={() => {
                      onValueChange?.(option.value);
                      setQuery('');
                      popoverState.close();
                    }}
                    className={cn(
                      'w-full text-left cursor-pointer select-none py-3 px-3 transition-colors duration-150 flex items-center gap-2 rounded',
                      'text-gray-900',
                      isSelected ? 'bg-gray-100' : 'hover:bg-gray-100',
                      isActive && !isSelected && 'bg-gray-50',
                      itemClassName,
                    )}
                    // biome-ignore lint/a11y/useSemanticElements: using <button> for PopoverTrigger to ensure keyboard accessibility and focus management
                    // biome-ignore lint/a11y/useAriaPropsForRole: using <button> for PopoverTrigger to ensure keyboard accessibility and focus management
                    role="option"
                    aria-selected={isSelected}
                    id={`${listboxId}-option-${index}`}
                    data-selected={isSelected ? 'true' : 'false'}
                    data-active={isActive ? 'true' : 'false'}
                    data-index={index}
                    data-value={option.value}
                    data-testid={`select-option-${option.value}`}
                    selected={isSelected}
                  >
                    {isSelected && <CheckIcon className="h-4 w-4 flex-shrink-0" />}
                    <span className={cn('block truncate', !isSelected && 'ml-6', isSelected && 'font-semibold')}>
                      {option.label}
                    </span>
                  </Item>
                </li>
              );
            })}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
