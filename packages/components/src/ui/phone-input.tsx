import { AsYouType } from 'libphonenumber-js';
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent, Ref } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { cn } from './utils';

// Constants
const US_PHONE_LENGTH = 10;
const US_PHONE_WITH_COUNTRY = 11;
const US_AREA_CODE_LENGTH = 3;
const US_PREFIX_LENGTH = 6;
const DIGITS_REGEX = /\d/g;
const NUMBER_KEY_REGEX = /^[0-9]$/;

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /**
   * Controlled value. `null` or `undefined` represents empty.
   *
   * **Format by mode:**
   * - **US mode** (`isInternational={false}`): 10-digit string (e.g., `"2025550123"`)
   * - **International mode** (`isInternational={true}`): E.164 format with `+` (e.g., `"+12025550123"`)
   */
  value?: string | null;
  /**
   * onChange fires with a normalized value:
   * - **US mode** (`isInternational={false}`): digits-only, 10 characters max (e.g., `"2025550123"`)
   * - **International mode** (`isInternational={true}`): E.164 format with leading `+` (e.g., `"+12025550123"`)
   * - Returns `undefined` when input is empty
   *
   * ⚠️ **Important**: Switching modes changes output format. Ensure backend validation handles both.
   */
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
  ref: forwardedRef,
  onBlur: externalOnBlur,
  ...props
}: PhoneInputProps & { ref?: Ref<HTMLInputElement> }) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const pendingValueRef = useRef<string | undefined>(undefined);

  /**
   * Compose forwarded ref with internal ref at commit time.
   * Preserves React 19 callback ref cleanup semantics by returning cleanup
   * that invokes forwarded cleanup (if exists) instead of calling ref(null).
   */
  const inputRef = useCallback(
    (element: HTMLInputElement | null) => {
      internalRef.current = element;

      if (!element) return; // No cleanup needed on detach

      // Forward to external ref and capture any cleanup
      let forwardedCleanup: (() => void) | undefined;

      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          const cleanup = forwardedRef(element);
          // Only capture if it's actually a function (not void)
          if (typeof cleanup === 'function') {
            forwardedCleanup = cleanup;
          }
        } else {
          forwardedRef.current = element;
        }
      }

      // Return composed cleanup
      return () => {
        internalRef.current = null;

        if (forwardedCleanup) {
          // Cleanup-returning callback - invoke its cleanup
          forwardedCleanup();
        } else if (forwardedRef) {
          // Non-cleanup callback or object ref - manual cleanup
          if (typeof forwardedRef === 'function') {
            forwardedRef(null);
          } else {
            forwardedRef.current = null;
          }
        }
      };
    },
    [forwardedRef],
  );

  /**
   * Sync external value changes to uncontrolled input.
   *
   * **Why necessary**: Allows parent components to programmatically set the phone number
   * (e.g., loading saved user data, autofill, form reset).
   *
   * **Why safe**: Updates immediately when not focused. When focused, defers the update
   * to pendingValueRef and applies it on blur to avoid interrupting user typing.
   *
   * **Triggers**: [value, isInternational] - when parent passes new value or mode changes.
   */
  useEffect(() => {
    if (!internalRef.current) return;

    const newValue = value == null || value === '' ? '' : formatPhoneNumber(value, isInternational);

    // If input is focused, defer the update until blur
    if (document.activeElement === internalRef.current) {
      pendingValueRef.current = newValue;
      return;
    }

    // Apply update immediately when not focused
    if (newValue !== internalRef.current.value) {
      internalRef.current.value = newValue;
    }
    pendingValueRef.current = undefined;
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
      const international = typer.getNumberValue() || normalized;
      normalizedValue = international === '+' ? undefined : international;
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Apply any pending value changes that were deferred while focused
    if (pendingValueRef.current !== undefined && internalRef.current) {
      if (pendingValueRef.current !== internalRef.current.value) {
        internalRef.current.value = pendingValueRef.current;
      }
      pendingValueRef.current = undefined;
    }

    // Call original onBlur if provided
    externalOnBlur?.(e);
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
      onBlur={handleBlur}
    />
  );
};

PhoneNumberInput.displayName = 'PhoneNumberInput';
