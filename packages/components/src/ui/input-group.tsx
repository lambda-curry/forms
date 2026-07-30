'use client';

import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';
import { Button } from './button';
import { TextInput } from './text-input';
import { Textarea } from './textarea';

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" is appropriate for input groups per WAI-ARIA
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        // Simple wrapper with focus-within ring, matching original design
        'group flex w-full min-w-0 rounded-md transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & { align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' }) {
  const isInlineStart = align === 'inline-start';
  const isInlineEnd = align === 'inline-end';
  const isBlockStart = align === 'block-start';
  const isBlockEnd = align === 'block-end';

  return (
    <div
      className={cn(
        // Base styling matching original FieldPrefix/FieldSuffix
        'flex h-10 items-center text-base text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200',
        'border border-input bg-background',
        // Inline-start styling (left side)
        isInlineStart && 'pl-3 pr-0 rounded-l-md border-r-0',
        // Inline-end styling (right side)
        isInlineEnd && 'pr-3 pl-0 rounded-r-md border-l-0',
        // Block-start styling (above)
        isBlockStart && 'border-b-0 rounded-b-none',
        // Block-end styling (below)
        isBlockEnd && 'border-t-0 rounded-t-none',
        className,
      )}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva('flex items-center gap-2 text-sm shadow-none', {
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
      sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> & VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return <span className={cn('whitespace-nowrap', className)} {...props} />;
}

function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <TextInput
      data-slot="input-group-control"
      className={cn(
        // Match original input styling but remove focus ring/offset (handled by wrapper)
        // Border removal for prefix/suffix should be handled by the parent component
        'flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 border-input',
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };
