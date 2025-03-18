import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import { Label } from './label';
import { cn } from './utils';

export interface FieldComponents {
  FormControl: React.ComponentType<FormControlProps>;
  FormDescription: React.ComponentType<FormDescriptionProps>;
  FormLabel: React.ComponentType<FormLabelProps>;
  FormMessage: React.ComponentType<FormMessageProps>;
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

export function FormItem({ Component, className, ...props }: FormItemProps) {
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
      <div 
        className={cn('form-item grid gap-2 w-full', className)} 
        data-slot="form-item"
        {...props} 
      />
    </FormItemContext.Provider>
  );
}
FormItem.displayName = 'FormItem';

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: string;
  Component?: React.ComponentType<FormLabelProps>;
}

export function FormLabel({ Component, htmlFor, className, error, ...props }: FormLabelProps) {
  const { formItemId } = React.useContext(FormItemContext);

  if (Component) {
    return (
      <Component
        htmlFor={htmlFor || formItemId}
        className={cn(error && 'text-destructive', className)}
        {...props}
      />
    );
  }

  return (
    <Label
      htmlFor={htmlFor || formItemId}
      className={cn(error && 'text-destructive', className)}
      data-slot="form-label"
      {...props}
    />
  );
}
FormLabel.displayName = 'FormLabel';

export interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {
  error?: boolean;
  formItemId?: string;
  formDescriptionId?: string;
  formMessageId?: string;
  Component?: React.ComponentType<FormControlProps>;
}

export function FormControl({ Component, ...props }: FormControlProps) {
  const { formItemId, formDescriptionId, formMessageId, error, ...restProps } = props;

  const ariaProps = {
    id: formItemId,
    'aria-describedby': error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId,
    'aria-invalid': !!error,
  };

  if (Component) {
    return <Component {...restProps} {...ariaProps} />;
  }

  return <Slot data-slot="form-control" {...restProps} {...ariaProps} />;
}
FormControl.displayName = 'FormControl';

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  formDescriptionId?: string;
  Component?: React.ComponentType<FormDescriptionProps>;
}

export function FormDescription({ Component, className, formDescriptionId, ...props }: FormDescriptionProps) {
  if (Component) {
    return (
      <Component
        id={formDescriptionId}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    );
  }

  return (
    <p 
      id={formDescriptionId} 
      className={cn('text-sm text-muted-foreground', className)} 
      data-slot="form-description"
      {...props} 
    />
  );
}
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  formMessageId?: string;
  error?: string;
  Component?: React.ComponentType<FormMessageProps>;
}

export function FormMessage({ Component, className, ...props }: FormMessageProps) {
  const { formMessageId, error, children } = props;

  if (Component) {
    return <Component id={formMessageId} className={className} {...props} />;
  }

  const body = error ? error : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className={cn('form-message text-sm font-medium text-destructive', className)}
      data-slot="form-message"
      {...props}
    >
      {body}
    </p>
  );
}
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