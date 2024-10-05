import { useRemixFormContext } from 'remix-hook-form';
import { InputOTPField, type InputOTPFieldProps } from '../ui/input-otp';

export type RemixInputOTPFieldProps = Omit<InputOTPFieldProps, 'control'>;

export function RemixInputOTPField(props: RemixInputOTPFieldProps) {
  const { control } = useRemixFormContext();

  return <InputOTPField control={control} {...props} />;
}