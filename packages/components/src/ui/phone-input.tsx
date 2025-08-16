import { AsYouType } from 'libphonenumber-js';
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from './utils';

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Controlled value. For US numbers this should be the digits-only 10-char string. For international, E.164 string (e.g. "+12025550123") is recommended. */
  value?: string;
  /** onChange fires with a normalized value. US: digits-only (max 10). International: E.164 with leading + when possible, otherwise a '+'-prefixed digits string. */
  onChange?: (value?: string) => void;
  /** When true, enables international entry (+country code, spaced groups, no strict length cap). Defaults to false (US). */
  isInternational?: boolean;
  className?: string;
  inputClassName?: string;
}

const DIGITS_REGEX = /\d/g;
const NUMBER_KEY_REGEX = /^[0-9]$/;

function extractDigits(input: string): string {
  return (input.match(DIGITS_REGEX) || []).join('');
}

function formatUS(digits: string): string {
  const d = digits.slice(0, 10);
  if (d.length === 0) return '';
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function normalizeInternationalInput(raw: string): string {
  // Keep a single leading +, strip other non-digits
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = extractDigits(trimmed);
  return hasPlus ? `+${digits}` : digits.length > 0 ? `+${digits}` : '+';
}

export const PhoneNumberInput = ({
  value,
  onChange,
  isInternational = false,
  className,
  inputClassName,
  ...props
}: PhoneInputProps & { ref?: Ref<HTMLInputElement> }) => {
  const [display, setDisplay] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync controlled value - handle autofill and external changes
  useEffect(() => {
    if (value == null || value === '') {
      setDisplay('');
      return;
    }

    if (isInternational) {
      const normalized = normalizeInternationalInput(String(value));
      const typer = new AsYouType();
      const formatted = typer.input(normalized);
      setDisplay(formatted);
    } else {
      const digits = extractDigits(String(value)).slice(0, 10);
      setDisplay(formatUS(digits));
    }
  }, [value, isInternational]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value ?? '';

    if (isInternational) {
      const normalized = normalizeInternationalInput(raw);
      const typer = new AsYouType();
      const formatted = typer.input(normalized);
      setDisplay(formatted);
      const numberValue = typer.getNumberValue(); // E.164 including leading + when recognized
      onChange?.(numberValue || normalized);
      return;
    }

    const digits = extractDigits(raw).slice(0, 10);
    const formatted = formatUS(digits);
    setDisplay(formatted);
    onChange?.(digits || undefined);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isInternational) {
      const currentDigits = extractDigits(display);
      const isNumberKey = NUMBER_KEY_REGEX.test(e.key);
      const isModifier = e.ctrlKey || e.metaKey || e.altKey;
      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];
      if (!isModifier && isNumberKey && currentDigits.length >= 10) {
        // Prevent adding more digits once 10-digit US number is complete
        e.preventDefault();
        return;
      }
      if (allowed.includes(e.key)) return;
      // Allow other typical keys; restriction handled by formatting and slice(0,10)
    }
  };

  return (
    <input
      ref={inputRef}
      type="tel"
      inputMode={isInternational ? 'tel' : 'numeric'}
      className={cn(
        'flex h-10 w-full text-base sm:text-sm rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        inputClassName,
      )}
      data-slot="input"
      aria-label={props['aria-label']}
      {...props}
      value={display}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';
