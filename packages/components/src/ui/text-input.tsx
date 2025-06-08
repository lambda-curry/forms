import type * as React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

function TextInput({ className, type, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full text-base sm:text-sm rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-slot="input"
      {...props}
    />
  );
}

TextInput.displayName = 'TextInput';

export { TextInput };
