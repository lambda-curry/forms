import { OTPInput as OTPInputPrimitive, type OTPInputProps } from 'input-otp';
import { cn } from './utils';

export type { OTPInputProps };

export function OTPInput({ className, containerClassName, ...props }: OTPInputProps) {
  return (
    <OTPInputPrimitive
      containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
      className={cn('disabled:cursor-not-allowed', className)}
      data-slot="otp-input"
      {...props}
    />
  );
}
OTPInput.displayName = 'InputOTP';
