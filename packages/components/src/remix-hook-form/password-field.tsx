import type * as React from 'react';
import {
  PasswordField as BasePasswordField,
  type PasswordInputProps as BasePasswordFieldProps,
} from '../ui/password-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

import { useRemixFormContext } from 'remix-hook-form';

export type PasswordFieldProps = Omit<BasePasswordFieldProps, 'control'>;

export const PasswordField = function RemixPasswordField(
  props: PasswordFieldProps & { ref?: React.Ref<HTMLInputElement> },
) {
  const { control } = useRemixFormContext();

  // Merge the provided components with the default form components
  const defaultComponents = {
    FormControl,
    FormLabel,
    FormDescription,
    FormMessage,
  };

  const components = {
    ...defaultComponents,
    ...props.components,
  };

  return <BasePasswordField control={control} components={components} {...props} />;
};

PasswordField.displayName = 'PasswordField';
