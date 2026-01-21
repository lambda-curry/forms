import { useEffect } from 'react';
import { useFormContext, type FieldPath, type FieldValues, type PathValue } from 'react-hook-form';
import type { UseRemixFormReturn } from 'remix-hook-form';

export interface UseOnFormValueChangeOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  /**
   * The name of the form field to watch
   */
  name: TName;
  /**
   * Callback function that runs when the field value changes
   * @param value - The new value of the watched field
   * @param prevValue - The previous value of the watched field
   */
  onChange: (value: PathValue<TFieldValues, TName>, prevValue: PathValue<TFieldValues, TName>) => void;
  /**
   * Optional form methods if not using RemixFormProvider context
   */
  methods?: any;
  /**
   * Whether the hook is enabled (default: true)
   */
  enabled?: boolean;
}

/**
 * A hook that watches a specific form field and executes a callback when its value changes.
 * This is useful for creating reactive form behaviors where one field's value affects another field.
 *
 * @example
 * ```tsx
 * // Make a discount field appear when order total exceeds $100
 * useOnFormValueChange({
 *   name: 'orderTotal',
 *   onChange: (value) => {
 *     if (value > 100) {
 *       methods.setValue('discountCode', '');
 *     }
 *   }
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Update a full name field when first or last name changes
 * useOnFormValueChange({
 *   name: 'firstName',
 *   onChange: (value) => {
 *     const lastName = methods.getValues('lastName');
 *     methods.setValue('fullName', `${value} ${lastName}`);
 *   }
 * });
 * ```
 */
export const useOnFormValueChange = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  options: UseOnFormValueChangeOptions<TFieldValues, TName>,
) => {
  const { name, onChange, methods: providedMethods, enabled = true } = options;

  // Use provided methods or fall back to context.
  // We use useFormContext from react-hook-form instead of useRemixFormContext from remix-hook-form
  // because useRemixFormContext crashes if it's called outside of a provider.
  const contextMethods = useFormContext<TFieldValues>();
  const formMethods = (providedMethods || contextMethods) as any;

  useEffect(() => {
    // Early return if no form methods are available or hook is disabled
    if (!enabled || !formMethods || !formMethods.watch || !formMethods.getValues) return;

    const { watch, getValues } = formMethods;

    // Subscribe to the field value changes
    const subscription = watch((value: TFieldValues, { name: changedFieldName }: { name?: string }) => {
      // Only trigger onChange if the watched field changed
      if (changedFieldName === name) {
        const currentValue = value[name] as PathValue<TFieldValues, TName>;
        // Get previous value from the form state
        const prevValue = getValues(name);

        onChange(currentValue, prevValue);
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [name, onChange, enabled, formMethods]);
};
