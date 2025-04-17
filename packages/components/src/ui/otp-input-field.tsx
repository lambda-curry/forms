import { OTPInputContext, type OTPInputProps } from 'input-otp';
import { Dot } from 'lucide-react';
// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormItemContext,
  FormLabel,
  FormMessage,
} from './form';
import { OTPInput } from './otp-input';
import { cn } from './utils';

export type { OTPInputProps };

export function OTPInputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center', className)} data-slot="otp-input-group" {...props} />;
}

export function OTPInputSlot({ index, className, ...props }: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      data-slot="otp-input-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

export function OTPInputSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: from ShadCN
    // biome-ignore lint/a11y/useSemanticElements: from ShadCN
    <div role="separator" data-slot="otp-input-separator" {...props}>
      <Dot />
    </div>
  );
}

export interface OTPInputFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<React.ComponentProps<typeof OTPInput>, 'onChange' | 'value'> {
  control: Control<TFieldValues>;
  name: string;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  maxLength: number;
  components?: Partial<FieldComponents>;
}

export function OTPInputField({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  inputClassName,
  maxLength,
  components,
  ...props
}: OTPInputFieldProps) {
  const isEightSlots = maxLength === 8;
  const { formItemId } = React.useContext(FormItemContext);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel Component={components?.FormLabel} className={labelClassName}>
              {label}
            </FormLabel>
          )}
          <FormControl Component={components?.FormControl}>
            <OTPInput
              id={formItemId}
              aria-describedby={formItemId}
              value={field.value}
              onChange={field.onChange}
              className={inputClassName}
              maxLength={maxLength}
              data-slot="otp-input-field"
            >
              <OTPInputGroup>
                <OTPInputSlot index={0} />
                <OTPInputSlot index={1} />
                <OTPInputSlot index={2} />
                {isEightSlots && <OTPInputSlot index={3} />}
              </OTPInputGroup>
              <OTPInputSeparator />
              <OTPInputGroup>
                <OTPInputSlot index={isEightSlots ? 4 : 3} />
                <OTPInputSlot index={isEightSlots ? 5 : 4} />
                <OTPInputSlot index={isEightSlots ? 6 : 5} />
                {isEightSlots && <OTPInputSlot index={7} />}
              </OTPInputGroup>
            </OTPInput>
          </FormControl>
          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
OTPInputField.displayName = 'OTPInputField';
