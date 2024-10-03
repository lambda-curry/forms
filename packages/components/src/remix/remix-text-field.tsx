import React from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { TextField } from '../ui/text-field';
import { FormField } from '../ui/remix-form';

export interface ControlledTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  name: string;
}

export const RemixTextField = React.forwardRef<HTMLInputElement, ControlledTextFieldProps>(
  ({ name, label, description, ...props }, ref) => {
    const { control } = useRemixFormContext();

    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            {...props}
            ref={ref}
            label={label}
            description={description}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  },
);

RemixTextField.displayName = 'RemixTextField';
