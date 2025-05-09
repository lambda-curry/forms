import { type ChangeEvent, type InputHTMLAttributes, useEffect, useMemo, useState } from 'react';
import { TextInput } from '../..';
import { debounce } from '../lib/debounce';

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

  // Define the debounced function with useMemo
  const debouncedOnChange = useMemo(
    () => debounce((newValue: string | number) => onChange(newValue), debounceMs),
    [debounceMs, onChange],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue); // Update local state immediately
    debouncedOnChange(newValue); // Call debounced version
  };

  return <TextInput {...props} value={value} onChange={handleChange} />;
}
