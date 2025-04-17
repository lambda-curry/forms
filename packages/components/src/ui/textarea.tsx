import type * as React from 'react';
import { cn } from './utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  CustomTextarea?: React.ForwardRefExoticComponent<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & React.RefAttributes<HTMLTextAreaElement>
  >;
}

const Textarea = ({ className, CustomTextarea, ...props }: TextareaProps) => {
  if (CustomTextarea) return <CustomTextarea className={className} {...props} />;

  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
      data-slot="textarea"
    />
  );
};
Textarea.displayName = 'Textarea';

export { Textarea };
