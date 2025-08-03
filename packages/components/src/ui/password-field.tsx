import { Eye, EyeOff } from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { type InputProps, TextInput } from './text-input';
import { cn } from './utils';

export interface PasswordToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export const PasswordToggleButton = ({ isVisible, onToggle, className }: PasswordToggleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex h-full items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200',
        className,
      )}
      aria-label={isVisible ? 'Hide password' : 'Show password'}
    >
      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
};

// Create a specific interface for the password input props
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffix' | 'prefix'> {
  control?: Control<FieldValues>;
  name: FieldPath<FieldValues>;
  label?: string | React.ReactNode;
  description?: string;
  components?: Partial<FieldComponents> & {
    Input?: React.ComponentType<InputProps & React.RefAttributes<HTMLInputElement>>;
  };
  prefix?: React.ReactNode;
  className?: string;
}

export const PasswordField = function PasswordField({
  control,
  name,
  label,
  description,
  className,
  components,
  prefix,
  ref,
  ...props
}: PasswordInputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const [isVisible, setIsVisible] = useState(false);

  // Use the custom Input component if provided, otherwise use the default TextInput
  const InputComponent = components?.Input || TextInput;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormItem className={className}>
            {label && <FormLabel Component={components?.FormLabel}>{label}</FormLabel>}
            <div
              className={cn('flex group transition-all duration-200 rounded-md', {
                'field__input--with-prefix': prefix,
                'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background': true,
              })}
            >
              {prefix && (
                <div
                  className={cn(
                    'flex h-full text-base items-center pl-3 pr-0 text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200 border-y border-l border-input rounded-l-md bg-background',
                  )}
                >
                  <span className="whitespace-nowrap">{prefix}</span>
                </div>
              )}
              <div className="relative flex-1">
                <FormControl Component={components?.FormControl}>
                  <InputComponent
                    {...field}
                    {...props}
                    ref={ref}
                    type={isVisible ? 'text' : 'password'}
                    className={cn('focus-visible:ring-0 focus-visible:ring-offset-0 border-input pr-10', {
                      'rounded-l-none border-l-0': prefix,
                    })}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 flex items-center border-y border-r border-input rounded-r-md bg-background">
                  <PasswordToggleButton isVisible={isVisible} onToggle={toggleVisibility} />
                </div>
              </div>
            </div>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};

PasswordField.displayName = 'PasswordField';
