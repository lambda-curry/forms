import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormLabel, FormMessage } from '../ui/form';
import {
  RadioGroupField as BaseRadioGroupField,
  type RadioGroupFieldProps as BaseRadioGroupFieldProps,
  type RadioGroupFieldComponents,
} from '../ui/radio-group-field';
import { RadioGroupItem } from './radio-group-item';

export type RadioOption = {
  value: string;
  label: string;
  id?: string;
  disabled?: boolean;
};

export type RadioGroupFieldProps = Omit<BaseRadioGroupFieldProps, 'control'> & {
  options?: RadioOption[];
  itemClassName?: string;
  labelClassName?: string;
};

export function RadioGroup(props: RadioGroupFieldProps) {
  const { control } = useRemixFormContext();
  const { options, itemClassName, labelClassName, children, ...restProps } = props;

  const components: Partial<RadioGroupFieldComponents> = {
    FormControl,
    FormDescription,
    FormLabel,
    FormMessage,
    ...props.components,
  };

  return (
    <BaseRadioGroupField control={control} {...restProps} components={components}>
      {options
        ? options.map((option) => (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={option.id || option.value}
              disabled={option.disabled}
              label={option.label}
              labelClassName={labelClassName}
              wrapperClassName={itemClassName}
            />
          ))
        : children}
    </BaseRadioGroupField>
  );
}
