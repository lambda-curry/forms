import { OTPInput as OTPInputPrimitive, type OTPInputProps } from 'input-otp';
// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import { cn } from '../../lib/utils';

export type { OTPInputProps };

export const OTPInput = React.forwardRef<
  React.ElementRef<typeof OTPInputPrimitive>,
  React.ComponentPropsWithoutRef<typeof OTPInputPrimitive>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInputPrimitive
    ref={ref}
    containerClassName={cn('flex items-center gap-2 has-[:disabled]:opacity-50', containerClassName)}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
));
OTPInput.displayName = 'InputOTP';
