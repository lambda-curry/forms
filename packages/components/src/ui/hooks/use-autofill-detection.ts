import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect browser autofill by comparing the current value with the previous value
 * and checking if the change was triggered by a user event.
 * 
 * @param inputRef - Reference to the input element
 * @param value - Current value of the input
 * @returns Object containing isAutofilled state and reset function
 */
export function useAutofillDetection(
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>,
  value: string
) {
  const [isAutofilled, setIsAutofilled] = useState(false);
  const previousValueRef = useRef(value);
  const userInteractionRef = useRef(false);

  // Track user interactions
  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;

    const handleUserInteraction = () => {
      userInteractionRef.current = true;
      // Reset after a short delay to catch only immediate changes
      setTimeout(() => {
        userInteractionRef.current = false;
      }, 50);
    };

    // Track events that indicate user interaction
    element.addEventListener('keydown', handleUserInteraction);
    element.addEventListener('input', handleUserInteraction);
    element.addEventListener('paste', handleUserInteraction);
    element.addEventListener('cut', handleUserInteraction);
    element.addEventListener('mouseup', handleUserInteraction); // For context menu paste

    return () => {
      element.removeEventListener('keydown', handleUserInteraction);
      element.removeEventListener('input', handleUserInteraction);
      element.removeEventListener('paste', handleUserInteraction);
      element.removeEventListener('cut', handleUserInteraction);
      element.removeEventListener('mouseup', handleUserInteraction);
    };
  }, [inputRef]);

  // Detect value changes that weren't triggered by user interaction
  useEffect(() => {
    // Skip initial render
    if (previousValueRef.current === value) return;

    // If value changed but no user interaction was detected, it might be autofill
    if (value && value !== previousValueRef.current && !userInteractionRef.current) {
      setIsAutofilled(true);
    }

    // Update previous value reference
    previousValueRef.current = value;
  }, [value]);

  // Function to reset the autofilled state
  const resetAutofilled = () => {
    setIsAutofilled(false);
  };

  return { isAutofilled, resetAutofilled };
}

