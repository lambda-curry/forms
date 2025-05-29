import { type ChangeEvent, type InputHTMLAttributes, useCallback, useEffect, useState } from 'react';
import { debounce } from './data-table-filter/lib/debounce';
import { TextInput } from './text-input';

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceMs = 500, // This is the wait time, not the function
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounceMs?: number;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  // Sync with initialValue when it changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Define the debounced function with useCallback
  // biome-ignore lint/correctness/useExhaustiveDependencies: from Bazza UI
  const debouncedOnChange = useCallback(
    debounce((newValue: string | number) => {
      onChange(newValue);
    }, debounceMs), // Pass the wait time here
    [debounceMs, onChange], // Dependencies
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue); // Update local state immediately
    debouncedOnChange(newValue); // Call debounced version
  };

  return <TextInput {...props} value={value} onChange={handleChange} />;
}
