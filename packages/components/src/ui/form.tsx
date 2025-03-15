import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import { Label } from './label';
import { cn } from './utils';

export interface FieldComponents {
  FormControl: React.ForwardRefExoticComponent<FormControlProps & React.RefAttributes<HTMLDivElement>>;
  FormDescription: React.ForwardRefExoticComponent<FormDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
  FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
  FormMessage: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
}

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

export type FormItemContextValue = {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  Component?: React.ComponentType<FormItemProps>;
}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(({ Component, className, ...props }, ref) => {
  const id = React.useId();

  if (Component) {
    return <Component id={id} {...props} />;
  }

  return (
    <FormItemContext.Provider
      value={{
        id,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
      }}
    >
      <div ref={ref} className={cn('form-item grid gap-2 w-full', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: string;
  Component?: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
}

export const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ Component, htmlFor, className, error, ...props }, ref) => {
    const { formItemId } = React.useContext(FormItemContext);

    if (Component) {
      return (
        <Component
          ref={ref}
          htmlFor={htmlFor || formItemId}
          className={cn(error && 'text-destructive', className)}
          {...props}
        />
      );
    }

    return (
      <Label
        ref={ref}
        htmlFor={htmlFor || formItemId}
        className={cn(error && 'text-destructive', className)}
        {...props}
      />
    );
  },
);
FormLabel.displayName = 'FormLabel';

export interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {
  error?: boolean;
  formItemId?: string;
  formDescriptionId?: string;
  formMessageId?: string;
  Component?: React.ForwardRefExoticComponent<FormControlProps & React.RefAttributes<HTMLDivElement>>;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(({ Component, ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId, error, ...restProps } = props;

  const ariaProps = {
    id: formItemId,
    'aria-describedby': error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId,
    'aria-invalid': !!error,
  };

  if (Component) {
    return <Component {...restProps} {...ariaProps} />;
  }

  return <Slot ref={ref} {...restProps} {...ariaProps} />;
});
FormControl.displayName = 'FormControl';

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  formDescriptionId?: string;
  Component?: React.ForwardRefExoticComponent<FormDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
}

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ Component, className, formDescriptionId, ...props }, ref) => {
    if (Component) {
      return (
        <Component
          ref={ref}
          id={formDescriptionId}
          className={cn('text-sm text-muted-foreground', className)}
          {...props}
        />
      );
    }

    return <p ref={ref} id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />;
  },
);
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  formMessageId?: string;
  error?: string;
  Component?: React.ForwardRefExoticComponent<FormMessageProps & React.RefAttributes<HTMLParagraphElement>>;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ Component, className, ...props }, ref) => {
    const { formMessageId, error, children } = props;

    if (Component) {
      return <Component ref={ref} id={formMessageId} className={className} {...props} />;
    }

    const body = error ? error : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('form-message text-sm font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  Component?: React.ComponentType<FormFieldProps<TFieldValues, TName>>;
}

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  Component,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  if (Component) {
    return <Component {...props} />;
  }

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
FormField.displayName = 'FormField';
