import { AsYouType } from 'libphonenumber-js';
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
import { useEffect, useRef } from 'react';

import { cn } from './utils';

// Constants
const US_PHONE_LENGTH = 10;
const US_PHONE_WITH_COUNTRY = 11;
const US_AREA_CODE_LENGTH = 3;
const US_PREFIX_LENGTH = 6;
const DIGITS_REGEX = /\d/g;
const NUMBER_KEY_REGEX = /^[0-9]$/;

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

// ============================================================================
// Pure utility functions for phone formatting
// ============================================================================

/** Extract only digits from input string */
function extractDigits(input: string): string {
  return (input.match(DIGITS_REGEX) || []).join('');
}

/** Normalize US digits: remove leading 1 from 11-digit numbers, cap at 10 */
function normalizeUSDigits(digits: string): string {
  if (digits.length === US_PHONE_WITH_COUNTRY && digits.startsWith('1')) {
    return digits.slice(1);
  }
  return digits.slice(0, US_PHONE_LENGTH);
}

/** Format US phone number to (XXX) XXX-XXXX */
function formatUS(digits: string): string {
  const d = normalizeUSDigits(digits);

  if (!d) return '';
  if (d.length <= US_AREA_CODE_LENGTH) return `(${d}`;
  if (d.length <= US_PREFIX_LENGTH) {
    return `(${d.slice(0, US_AREA_CODE_LENGTH)}) ${d.slice(US_AREA_CODE_LENGTH)}`;
  }
  return `(${d.slice(0, US_AREA_CODE_LENGTH)}) ${d.slice(US_AREA_CODE_LENGTH, US_PREFIX_LENGTH)}-${d.slice(US_PREFIX_LENGTH)}`;
}

function normalizeInternationalInput(raw: string): string {
  // Keep a single leading +, strip other non-digits
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = extractDigits(trimmed);
  return hasPlus ? `+${digits}` : digits.length > 0 ? `+${digits}` : '+';
}

/**
 * Calculate cursor position after formatting
 * Preserves cursor location relative to digits when formatting changes
 */
function getCursorPosition(oldValue: string, newValue: string, oldCursor: number): number {
  // Count how many digits were before the cursor in the old value
  const digitsBeforeCursor = extractDigits(oldValue.slice(0, oldCursor)).length;

  // Find the position in the new value that has the same number of digits before it
  let digitCount = 0;
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i])) {
      digitCount++;
      if (digitCount > digitsBeforeCursor) {
        return i;
      }
    }
  }

  return newValue.length;
}

/** Set cursor position preserving user's typing position */
function setCursorPosition(input: HTMLInputElement, position: number): void {
  requestAnimationFrame(() => {
    if (input === document.activeElement) {
      input.setSelectionRange(position, position);
    }
  });
}

/** Format phone number based on type (US or international) */
function formatPhoneNumber(value: string, isInternational: boolean): string {
  if (!value) return '';

  if (isInternational) {
    const normalized = normalizeInternationalInput(value);
    return new AsYouType().input(normalized);
  }

  const digits = extractDigits(value);
  return formatUS(digits);
}

// ============================================================================
// Component
// ============================================================================

export const PhoneNumberInput = ({
  value,
  onChange,
  isInternational = false,
  className,
  inputClassName,
  ...props
}: PhoneInputProps & { ref?: Ref<HTMLInputElement> }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Sync external value changes to uncontrolled input.
   *
   * **Why necessary**: Allows parent components to programmatically set the phone number
   * (e.g., loading saved user data, autofill, form reset).
   *
   * **Why safe**: Only updates when input is not focused, preventing interference with
   * user typing. Early returns prevent unnecessary DOM updates.
   *
   * **Triggers**: [value, isInternational] - when parent passes new value or mode changes.
   */
  useEffect(() => {
    if (!inputRef.current || document.activeElement === inputRef.current) return;

    const newValue = value == null || value === '' ? '' : formatPhoneNumber(value, isInternational);

    // Only update if different to avoid unnecessary DOM changes
    if (newValue !== inputRef.current.value) {
      inputRef.current.value = newValue;
    }
  }, [value, isInternational]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const raw = input.value;
    const oldCursor = input.selectionStart ?? 0;
    const oldValue = input.value;

    let formatted: string;
    let normalizedValue: string | undefined;

    if (isInternational) {
      const normalized = normalizeInternationalInput(raw);
      const typer = new AsYouType();
      formatted = typer.input(normalized);
      normalizedValue = typer.getNumberValue() || normalized;
    } else {
      const digits = extractDigits(raw);
      const normalizedDigits = normalizeUSDigits(digits);
      formatted = formatUS(digits);
      normalizedValue = normalizedDigits.length > 0 ? normalizedDigits : undefined;
    }

    // Single update path: calculate cursor position, update value, restore cursor
    const newCursor = getCursorPosition(oldValue, formatted, oldCursor);
    input.value = formatted;
    setCursorPosition(input, newCursor);
    onChange?.(normalizedValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isInternational) {
      const input = e.currentTarget;
      const currentValue = input.value;
      const currentDigits = extractDigits(currentValue);
      const isNumberKey = NUMBER_KEY_REGEX.test(e.key);
      const isModifier = e.ctrlKey || e.metaKey || e.altKey;
      const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];

      // Check if there's a text selection
      const hasSelection = input.selectionStart !== input.selectionEnd;

      // Allow typing if we have fewer than 10 digits or if we have 11 digits but the first is '1'
      const isComplete =
        currentDigits.length >= US_PHONE_LENGTH &&
        !(currentDigits.length === US_PHONE_WITH_COUNTRY && currentDigits.startsWith('1'));

      // If text is selected, allow typing (selected text will be replaced)
      // Otherwise, prevent adding more digits once 10-digit US number is complete
      if (!isModifier && isNumberKey && isComplete && !hasSelection) {
        e.preventDefault();
        return;
      }
      if (allowed.includes(e.key)) return;
      // Allow other typical keys; restriction handled by formatting
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
      onInput={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';
