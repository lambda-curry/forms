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
        // Match original TextField wrapper styling: simple border with focus-within ring
        'group/input-group flex w-full rounded-md transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',

        // Variants based on alignment - simplified to match original behavior
        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  // Match original FieldPrefix/FieldSuffix styling: simple borders with gray text
  'flex h-full text-base items-center text-gray-500 group-focus-within:text-gray-700 transition-colors duration-200 border-y border-input bg-background',
  {
    variants: {
      align: {
        // inline-start = prefix (left side)
        'inline-start': 'order-first pl-3 pr-0 border-l rounded-l-md',
        // inline-end = suffix (right side)
        'inline-end': 'order-last pr-3 pl-0 border-r rounded-r-md',
        // block alignment for advanced use cases
        'block-start': 'order-first w-full justify-start px-3 pt-3 pb-2',
        'block-end': 'order-last w-full justify-start px-3 pt-2 pb-3',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
);

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" is appropriate for input group addons per WAI-ARIA
    // biome-ignore lint/a11y/useKeyWithClickEvents: onClick is for focus management, not interactive action
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
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
  return (
    <span
      className={cn(
        // Match original FieldPrefix/FieldSuffix inner span: simple whitespace-nowrap
        'whitespace-nowrap',
        className,
      )}
      {...props}
    />
  );
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
