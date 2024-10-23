import type { Control, FieldValues } from 'react-hook-form';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef, useContext } from 'react';
import { OTPInput, OTPInputContext, type OTPInputProps } from 'input-otp';
import { Dot } from 'lucide-react';
import { cn } from '../../lib/utils';
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

export type { OTPInputProps };

export const InputOTP = forwardRef<ElementRef<typeof OTPInput>, ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  ),
);
InputOTP.displayName = 'InputOTP';

export const InputOTPGroup = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center', className)} {...props} />,
);
InputOTPGroup.displayName = 'InputOTPGroup';

export const InputOTPSlot = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'> & { index: number }>(
  ({ index, className, ...props }, ref) => {
    const inputOTPContext = useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
          isActive && 'z-10 ring-2 ring-ring ring-offset-background',
          className,
        )}
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
  },
);
InputOTPSlot.displayName = 'InputOTPSlot';

export const InputOTPSeparator = forwardRef<ElementRef<'div'>, ComponentPropsWithoutRef<'div'>>(({ ...props }, ref) => (
  // biome-ignore lint/a11y/useFocusableInteractive: from ShadCN
  // biome-ignore lint/a11y/useSemanticElements: from ShadCN
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export interface InputOTPFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ComponentPropsWithoutRef<typeof OTPInput>, 'onChange' | 'value'> {
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

export const InputOTPField = forwardRef<ElementRef<typeof OTPInput>, InputOTPFieldProps>(
  (
    { control, name, label, description, className, labelClassName, inputClassName, maxLength, components, ...props },
    ref,
  ) => {
    const isEightSlots = maxLength === 8;
    const { formItemId } = useContext(FormItemContext);
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
              <InputOTP
                ref={ref}
                id={formItemId}
                aria-describedby={formItemId}
                value={field.value}
                onChange={field.onChange}
                className={inputClassName}
                maxLength={maxLength}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  {isEightSlots && <InputOTPSlot index={3} />}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={isEightSlots ? 4 : 3} />
                  <InputOTPSlot index={isEightSlots ? 5 : 4} />
                  <InputOTPSlot index={isEightSlots ? 6 : 5} />
                  {isEightSlots && <InputOTPSlot index={7} />}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    );
  },
);
InputOTPField.displayName = 'InputOTPField';
