import { useEffect, useMemo } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import type { UseRemixFormReturn } from 'remix-hook-form';
import { type ScrollToErrorOptions, scrollToFirstError } from '../../utils/scrollToError';

export interface UseScrollToErrorOnSubmitOptions extends ScrollToErrorOptions {
  delay?: number;
  enabled?: boolean;
  scrollOnServerErrors?: boolean;
  scrollOnMount?: boolean;
  methods?: UseRemixFormReturn<any>; // Optional methods parameter
}

export const useScrollToErrorOnSubmit = (options: UseScrollToErrorOnSubmitOptions = {}) => {
  // Use provided methods or fall back to context
  const contextMethods = useRemixFormContext();
  const { methods, delay = 100, enabled = true, scrollOnServerErrors = true, scrollOnMount = true, ...scrollOptions } = options;
  const formMethods = methods || contextMethods;
  
  // Early return if no form methods are available
  if (!formMethods) {
    console.warn('useScrollToErrorOnSubmit: No form methods available. Make sure you are either inside a RemixFormProvider or passing methods explicitly.');
    return;
  }
  
  const { formState } = formMethods;

  // Memoize scroll options to prevent unnecessary re-renders
  const memoizedScrollOptions = useMemo(
    () => scrollOptions,
    [
      scrollOptions.behavior,
      scrollOptions.block,
      scrollOptions.inline,
      scrollOptions.offset,
      scrollOptions.shouldFocus,
      scrollOptions.retryAttempts,
    ],
  );

  // Handle form submission errors
  useEffect(() => {
    if (!enabled) return;
    const hasErrors = Object.keys(formState.errors).length > 0;

    // Scroll after submission attempt when errors exist
    if (!formState.isSubmitting && hasErrors) {
      const timeoutId = setTimeout(() => {
        scrollToFirstError(formState.errors, memoizedScrollOptions);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [formState.errors, formState.isSubmitting, enabled, delay, memoizedScrollOptions]);

  // Handle server-side validation errors on mount (Remix SSR)
  useEffect(() => {
    if (!(enabled && scrollOnMount) || !scrollOnServerErrors) return;
    const hasErrors = Object.keys(formState.errors).length > 0;

    if (hasErrors && !formState.isSubmitting) {
      const timeoutId = setTimeout(() => {
        scrollToFirstError(formState.errors, memoizedScrollOptions);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [
    enabled,
    scrollOnMount,
    scrollOnServerErrors,
    formState.errors,
    formState.isSubmitting,
    delay,
    memoizedScrollOptions,
  ]);
};
