import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';
import {
  RadioGroupField as BaseRadioGroupField,
  type RadioGroupFieldProps as BaseRadioGroupFieldProps,
  type RadioGroupFieldComponents,
} from '../ui/radio-group-field';

export type RadioGroupFieldProps = Omit<BaseRadioGroupFieldProps, 'control'>;

export function RadioGroup(props: RadioGroupFieldProps) {
  const { control } = useRemixFormContext();

  const components: Partial<RadioGroupFieldComponents> = {
    FormControl,
    FormDescription,
    FormLabel,
    FormMessage,
    ...props.components,
  };

  return <BaseRadioGroupField control={control} {...props} components={components} />;
}
