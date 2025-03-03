import { useRemixFormContext } from 'remix-hook-form';
import { OTPInputField as BaseOTPInputField, type OTPInputFieldProps as BaseOTPInputFieldProps } from '../ui/otp-input-field';

export type OTPInputFieldProps = Omit<BaseOTPInputFieldProps, 'control'>;

export function OTPInput(props: OTPInputFieldProps) {
  const { control } = useRemixFormContext();
  const { name, ...restProps } = props;

  if (!name) {
    throw new Error('Name is required for Input');
  }

  return <BaseOTPInputField control={control} name={name} {...restProps} />;
}
