import { useEffect, useRef, useState } from 'react';
import { type FieldValues, type UseFormReturn, type FieldPath } from 'react-hook-form';

/**
 * Hook to detect browser autofill by monitoring form state changes.
 * This technique works by watching for changes in the form state that
 * weren't triggered by user interaction.
 * 
 * @param form - The form instance from useForm or useRemixForm
 * @param name - The field name to monitor
 * @returns Object containing isAutofilled state and reset function
 */
export function useAutofillFormState<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  form: UseFormReturn<TFieldValues, TContext>,
  name: FieldPath<TFieldValues>
) {
  const [isAutofilled, setIsAutofilled] = useState(false);
  const userInteractionRef = useRef(false);
  const previousValueRef = useRef<any>(form.getValues(name));
  const touchedRef = useRef(false);

  // Subscribe to form state changes
  useEffect(() => {
    const subscription = form.watch((values, { name: changedField, type }) => {
      // Only process changes for the field we're monitoring
      if (changedField !== name) return;
      
      const currentValue = values[name as keyof typeof values];
      
      // Skip if value hasn't changed
      if (currentValue === previousValueRef.current) return;
      
      // If the field was changed programmatically (not by user interaction)
      // and the value is not empty, it might be autofill
      if (
        !userInteractionRef.current && 
        currentValue && 
        type !== 'change' && 
        type !== 'blur' &&
        !touchedRef.current
      ) {
        setIsAutofilled(true);
      }
      
      // Update previous value
      previousValueRef.current = currentValue;
    });
    
    return () => subscription.unsubscribe();
  }, [form, name]);

  // Track user interactions with the form
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractionRef.current = true;
      touchedRef.current = true;
      
      // Reset after a short delay to catch only immediate changes
      setTimeout(() => {
        userInteractionRef.current = false;
      }, 50);
    };

    // Track events that indicate user interaction
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('input', handleUserInteraction);
    document.addEventListener('paste', handleUserInteraction);
    document.addEventListener('cut', handleUserInteraction);
    document.addEventListener('mouseup', handleUserInteraction);

    return () => {
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('input', handleUserInteraction);
      document.removeEventListener('paste', handleUserInteraction);
      document.removeEventListener('cut', handleUserInteraction);
      document.removeEventListener('mouseup', handleUserInteraction);
    };
  }, []);

  // Function to reset the autofilled state
  const resetAutofilled = () => {
    setIsAutofilled(false);
    touchedRef.current = true;
  };

  return { isAutofilled, resetAutofilled };
}

