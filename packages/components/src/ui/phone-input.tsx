import * as React from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import { parsePhoneNumber, AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import { cn } from './utils';

// Import country flags
import 'country-flag-icons/css/flag-icons.min.css';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value?: string) => void;
  defaultCountry?: string;
  international?: boolean;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
}

export const PhoneNumberInput = ({
  value,
  onChange,
  defaultCountry = 'US',
  international = true,
  className,
  inputClassName,
  selectClassName,
  ...props
}: PhoneInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const [selectedCountry, setSelectedCountry] = React.useState(defaultCountry);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Get list of countries
  const countries = React.useMemo(() => getCountries(), []);

  // Format the full phone number (with country code)
  const formatFullNumber = React.useCallback((country: string, nationalNumber: string) => {
    if (!nationalNumber) return '';
    
    const formatter = new AsYouType(country);
    const formatted = formatter.input(nationalNumber);
    
    if (international) {
      return `+${getCountryCallingCode(country)}${formatted.startsWith('+') ? formatted.substring(1) : formatted}`;
    }
    
    return formatted;
  }, [international]);

  // Initialize input value from props
  React.useEffect(() => {
    if (value) {
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (phoneNumber) {
          setSelectedCountry(phoneNumber.country || defaultCountry);
          setInputValue(phoneNumber.nationalNumber || '');
        }
      } catch (error) {
        // If parsing fails, just use the value as is
        setInputValue(value);
      }
    } else {
      setInputValue('');
    }
  }, [value, defaultCountry]);

  // Handle country change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    
    // Update the full number with the new country code
    const fullNumber = formatFullNumber(newCountry, inputValue);
    onChange?.(fullNumber);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInputValue(newInput);
    
    // Update the full number
    const fullNumber = formatFullNumber(selectedCountry, newInput);
    onChange?.(fullNumber);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <select
        value={selectedCountry}
        onChange={handleCountryChange}
        className={cn(
          'flex h-10 w-auto text-base sm:text-sm rounded-md border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          selectClassName
        )}
        aria-label="Country code"
      >
        {countries.map((country) => (
          <option key={country} value={country}>
            {country} +{getCountryCallingCode(country)}
          </option>
        ))}
      </select>
      
      <input
        ref={inputRef}
        type="tel"
        value={inputValue}
        onChange={handleInputChange}
        className={cn(
          'flex h-10 w-full text-base sm:text-sm rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          inputClassName
        )}
        data-slot="input"
        {...props}
      />
    </div>
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';

