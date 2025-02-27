import { useRemixFormContext } from 'remix-hook-form';
import { OTPInputField, type OTPInputFieldProps } from '../ui/otp-input-field';

export type FormOTPInputFieldProps = Omit<OTPInputFieldProps, 'control'>;

export function FormOTPInputField(props: FormOTPInputFieldProps) {
  const { control } = useRemixFormContext();
  const { name, ...restProps } = props;

  if (!name) {
    throw new Error('Name is required for Input');
  }

  return <OTPInputField control={control} name={name} {...restProps} />;
}
