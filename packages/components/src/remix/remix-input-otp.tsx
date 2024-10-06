import { useRemixFormContext } from 'remix-hook-form';
import { InputOTPField, type InputOTPFieldProps } from '../ui/input-otp';

export type RemixInputOTPFieldProps = Omit<InputOTPFieldProps, 'control'>;

export function RemixInputOTPField(props: RemixInputOTPFieldProps) {
  const { control } = useRemixFormContext();
  const { name, ...restProps } = props;

  if (!name) {
    throw new Error('Name is required for Input');
  }

  return <InputOTPField control={control} name={name} {...restProps} />;
}