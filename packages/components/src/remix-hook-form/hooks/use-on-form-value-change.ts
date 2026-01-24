import { useEffect, useRef } from 'react';
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseFormReturn,
  type WatchObserver,
} from 'react-hook-form';

/**
 * Minimal interface for form methods required by useOnFormValueChange.
 * This helps avoid type conflicts between react-hook-form and remix-hook-form.
 */
export interface WatchableFormMethods<TFieldValues extends FieldValues = FieldValues> {
  watch: UseFormReturn<TFieldValues>['watch'];
  getValues: UseFormReturn<TFieldValues>['getValues'];
}

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
  methods?: WatchableFormMethods<TFieldValues>;
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
  const formMethods = (providedMethods || contextMethods) as WatchableFormMethods<TFieldValues> | null;

  // Store previous value in a ref
  const prevValueRef = useRef<PathValue<TFieldValues, TName> | undefined>(
    formMethods?.getValues ? formMethods.getValues(name) : undefined,
  );

  useEffect(() => {
    // Early return if no form methods are available or hook is disabled
    if (!enabled || !formMethods || !formMethods.watch || !formMethods.getValues) return;

    const { watch } = formMethods;

    // Subscribe to the field value changes
    const subscription = watch(((value, { name: changedFieldName }) => {
      // Only trigger onChange if the watched field changed
      if (changedFieldName === name) {
        const currentValue = value[name] as PathValue<TFieldValues, TName>;
        // Get previous value from the ref
        const prevValue = prevValueRef.current as PathValue<TFieldValues, TName>;

        onChange(currentValue, prevValue);

        // Update ref with new value
        prevValueRef.current = currentValue;
      }
    }) as WatchObserver<TFieldValues>);

    // Cleanup subscription on unmount

    return () => subscription.unsubscribe();
  }, [name, onChange, enabled, formMethods]);
};
