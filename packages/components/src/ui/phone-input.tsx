import * as React from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';
import { cn } from './utils';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value?: string) => void;
  defaultCountry?: string;
  international?: boolean;
  className?: string;
  inputClassName?: string;
}

export const PhoneNumberInput = ({
  value,
  onChange,
  defaultCountry = 'US',
  international = true,
  className,
  inputClassName,
  ...props
}: PhoneInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  return (
    <div className={cn('phone-input-container', className)}>
      <PhoneInput
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry}
        international={international}
        className={cn('phone-input', inputClassName)}
        {...props}
      />
    </div>
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';
