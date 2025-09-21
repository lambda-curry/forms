import type * as React from 'react';
import type { FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';

export interface HiddenFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> {
  /**
   * The field name to register with react-hook-form
   */
  name: FieldPath<FieldValues>;
  /**
   * Optional register options to pass to react-hook-form's register
   */
  registerOptions?: RegisterOptions;
}

/**
 * HiddenField
 *
 * A minimal field that only renders a native hidden input and registers it with remix-hook-form.
 * This avoids any extra DOM wrappers so it won't affect page layout.
 */
export const HiddenField = function HiddenField({
  name,
  registerOptions,
  ref,
  ...props
}: HiddenFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  const { register } = useRemixFormContext();

  // Intentionally render a plain input to avoid any additional wrappers or styling
  return <input type="hidden" {...register(name, registerOptions)} ref={ref} {...props} />;
};

HiddenField.displayName = 'HiddenField';
export type { HiddenFieldProps as HiddenInputProps }; // legacy-friendly alias
