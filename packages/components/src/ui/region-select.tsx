import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from './utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export interface RegionOption {
  label: string;
  value: string;
}

export interface RegionSelectProps {
  options: RegionOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export function RegionSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select a region',
  disabled = false,
  className,
  contentClassName,
  itemClassName,
}: RegionSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent 
        className={cn(
          'max-h-[200px] overflow-y-auto divide-y rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          contentClassName
        )}
      >
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className={cn(
              'cursor-pointer select-none py-3 px-3 transition-colors duration-150',
              'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
              'data-[selected]:bg-gray-200 data-[selected]:text-gray-900 data-[selected]:font-semibold',
              'hover:bg-gray-50',
              itemClassName
            )}
          >
            <div className="flex items-center">
              <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
              <span className={cn('block truncate', value === option.value && 'font-semibold')}>
                {option.label}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

