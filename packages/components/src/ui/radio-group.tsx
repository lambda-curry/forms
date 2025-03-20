// biome-ignore lint/style/noNamespaceImport: from Radix
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import type * as React from 'react';
import { cn } from './utils';

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} data-slot="radio-group" {...props} />;
}

function RadioGroupItem({
  className,
  indicator,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  indicator?: React.ReactNode;
}) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-slot="radio-group-item"
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center" data-slot="radio-indicator">
        {indicator || <Circle className="h-2.5 w-2.5 fill-current text-current" />}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
