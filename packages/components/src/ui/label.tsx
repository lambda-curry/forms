// biome-ignore lint/style/noNamespaceImport: from Radix
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { cn } from '../../lib/utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
