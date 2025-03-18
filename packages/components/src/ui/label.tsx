// biome-ignore lint/style/noNamespaceImport: from Radix
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import { cn } from './utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

export interface LabelProps 
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root 
      className={cn(labelVariants(), className)} 
      data-slot="label"
      {...props} 
    />
  );
}

Label.displayName = LabelPrimitive.Root.displayName;

export { labelVariants };