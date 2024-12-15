import { OTPInput as OTPInputPrimitive, type OTPInputProps } from 'input-otp';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export type { OTPInputProps };

export const OTPInput = forwardRef<
  ElementRef<typeof OTPInputPrimitive>,
  ComponentPropsWithoutRef<typeof OTPInputPrimitive>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInputPrimitive
    ref={ref}
    containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
));
OTPInput.displayName = 'InputOTP';
