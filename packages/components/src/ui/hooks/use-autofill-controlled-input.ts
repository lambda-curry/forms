import { useEffect, useState } from 'react';
import { type FieldValues, type UseControllerReturn } from 'react-hook-form';

/**
 * Hook to detect browser autofill using controlled inputs with useController.
 * This technique works by monitoring the controlled input's value changes
 * and detecting when they happen without user interaction.
 * 
 * @param controller - The controller returned from useController
 * @returns Object containing isAutofilled state and reset function
 */
export function useAutofillControlledInput<TFieldValues extends FieldValues = FieldValues>(
  controller: UseControllerReturn<TFieldValues>
) {
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Monitor value changes from the controller
  useEffect(() => {
    const { field } = controller;
    
    // If the field has a value but the user hasn't interacted with it yet,
    // it might be autofilled
    if (field.value && !userInteracted) {
      setIsAutofilled(true);
    }
  }, [controller.field.value, userInteracted]);

  // Create handlers to track user interaction
  const handleUserInteraction = () => {
    setUserInteracted(true);
    
    // If the user interacts with the field, it's no longer considered autofilled
    if (isAutofilled) {
      setIsAutofilled(false);
    }
  };

  // Enhanced onChange handler that tracks user interaction
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUserInteraction();
    controller.field.onChange(e);
  };

  // Enhanced onBlur handler that tracks user interaction
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleUserInteraction();
    controller.field.onBlur();
  };

  // Function to reset the autofilled state
  const resetAutofilled = () => {
    setIsAutofilled(false);
    setUserInteracted(true);
  };

  return {
    isAutofilled,
    resetAutofilled,
    fieldProps: {
      ...controller.field,
      onChange,
      onBlur,
      onFocus: handleUserInteraction,
      onKeyDown: handleUserInteraction,
      onPaste: handleUserInteraction,
    },
  };
}

