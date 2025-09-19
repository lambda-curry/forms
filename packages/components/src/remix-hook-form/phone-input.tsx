import type * as React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import {
  PhoneInputField as BasePhoneInputField,
  type PhoneInputFieldProps as BasePhoneInputFieldProps,
} from '../ui/phone-input-field';
import { FormControl, FormDescription, FormLabel, FormMessage } from './form';

export type PhoneInputProps = Omit<BasePhoneInputFieldProps, 'control'>;

export const PhoneInput = function RemixPhoneInput(props: PhoneInputProps & { ref?: React.Ref<HTMLInputElement> }) {
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

  return <BasePhoneInputField control={control} components={components} {...props} />;
};

PhoneInput.displayName = 'PhoneInput';
