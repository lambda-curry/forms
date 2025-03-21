import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import type * as React from 'react';
import { cn } from './utils';

export interface RadioGroupItemComponents {
  RadioGroupItem?: React.ComponentType<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
      indicator?: React.ReactNode;
    }
  >;
  RadioGroupIndicator?: React.ComponentType<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>>;
}

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  className?: string;
}

const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} />;
};
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  indicator?: React.ReactNode;
  components?: Partial<RadioGroupItemComponents>;
  className?: string;
}

const RadioGroupItem = ({ className, indicator, components, ...props }: RadioGroupItemProps) => {
  // Extract custom components with fallbacks
  const RadioItem = components?.RadioGroupItem || RadioGroupPrimitive.Item;
  const RadioIndicator = components?.RadioGroupIndicator || RadioGroupPrimitive.Indicator;

  // Determine the indicator content
  const indicatorContent = indicator || <Circle className="h-2.5 w-2.5 fill-current text-current" />;

  return (
    <RadioItem
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioIndicator className="flex items-center justify-center">{indicatorContent}</RadioIndicator>
    </RadioItem>
  );
};
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
