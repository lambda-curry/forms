import { useEffect, useMemo } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { type ScrollToErrorOptions, scrollToFirstError } from '../../utils/scrollToError';

export interface UseScrollToErrorOnSubmitOptions extends ScrollToErrorOptions {
  delay?: number;
  enabled?: boolean;
  scrollOnServerErrors?: boolean;
  scrollOnMount?: boolean;
}

export const useScrollToErrorOnSubmit = (options: UseScrollToErrorOnSubmitOptions = {}) => {
  const { formState } = useRemixFormContext();
  const { delay = 100, enabled = true, scrollOnServerErrors = true, scrollOnMount = true, ...scrollOptions } = options;

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
