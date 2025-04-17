import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type * as React from 'react';
import { Label } from './label';
import { cn } from './utils';

export interface RadioGroupItemFieldComponents {
  RadioGroupItem?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>;
  RadioGroupIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>>;
  Label?: React.ComponentType<React.ComponentPropsWithoutRef<typeof Label>>;
}

export interface RadioGroupItemFieldProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: React.ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
  components?: Partial<RadioGroupItemFieldComponents>;
}

const RadioGroupItemField = ({
  label,
  labelClassName,
  wrapperClassName,
  components,
  className,
  children,
  ...props
}: RadioGroupItemFieldProps) => {
  // Extract custom components with fallbacks
  const RadioGroupItemComponent = components?.RadioGroupItem || RadioGroupPrimitive.Item;
  const RadioGroupIndicatorComponent = components?.RadioGroupIndicator || RadioGroupPrimitive.Indicator;
  const LabelComponent = components?.Label || Label;

  return (
    <div className={cn('flex items-center space-x-2', wrapperClassName)}>
      <RadioGroupItemComponent
        className={cn(
          'h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <RadioGroupIndicatorComponent className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-current" />
        </RadioGroupIndicatorComponent>
      </RadioGroupItemComponent>
      {label && (
        <LabelComponent
          htmlFor={props.id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            labelClassName,
          )}
        >
          {label}
        </LabelComponent>
      )}
      {children}
    </div>
  );
};

RadioGroupItemField.displayName = 'RadioGroupItemField';

export { RadioGroupItemField };
