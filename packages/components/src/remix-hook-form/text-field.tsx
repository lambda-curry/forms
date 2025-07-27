import type * as React from 'react';
import { TextField as BaseTextField, type TextInputProps as BaseTextFieldProps } from '../ui/text-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

import { useRemixFormContext } from 'remix-hook-form';

export type TextFieldProps = Omit<BaseTextFieldProps, 'control'>;

export const TextField = function RemixTextField(props: TextFieldProps & { ref?: React.Ref<HTMLInputElement> }) {
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

  return <BaseTextField control={control} components={components} {...props} />;
};

TextField.displayName = 'TextField';
