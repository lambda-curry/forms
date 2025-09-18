import { useEffect, useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';
import type { UseRemixFormReturn } from 'remix-hook-form';
import { type ScrollToErrorOptions, scrollToFirstError } from '../../utils/scrollToError';

export interface UseScrollToErrorOnSubmitOptions extends ScrollToErrorOptions {
  delay?: number;
  enabled?: boolean;
  scrollOnServerErrors?: boolean;
  scrollOnMount?: boolean;
  methods?: UseRemixFormReturn<FieldValues>; // Optional methods parameter
}

export const useScrollToErrorOnSubmit = (options: UseScrollToErrorOnSubmitOptions = {}) => {
  // Use provided methods or fall back to context
  const contextMethods = useRemixFormContext();
  const {
    methods,
    delay = 100,
    enabled = true,
    scrollOnServerErrors = true,
    scrollOnMount = true,
    ...scrollOptions
  } = options;
  const formMethods = methods || contextMethods;

  const { formState } = formMethods;

  // Memoize scroll options to prevent unnecessary re-renders
  const { behavior, block, inline, offset, shouldFocus, retryAttempts, selectors } = scrollOptions;

  // biome-ignore lint: Compare `selectors` by value via join to avoid unstable array identity.
  const memoizedScrollOptions = useMemo(
    () => ({
      behavior,
      block,
      inline,
      offset,
      shouldFocus,
      retryAttempts,
      selectors,
    }),
    [behavior, block, inline, offset, shouldFocus, retryAttempts, selectors?.join(',')],
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
    if (!(enabled && scrollOnMount && scrollOnServerErrors)) return;
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
