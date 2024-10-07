import { cn } from '@/lib/utils';
import { Label } from '@/src/ui/label';
import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { createContext, forwardRef, type HTMLAttributes, useId, type ElementRef, type ComponentPropsWithoutRef, type ComponentType, useContext } from 'react';
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';

export interface FieldComponents {
  FormControl: typeof FormControl;
  FormDescription: typeof FormDescription;
  FormLabel: typeof FormLabel;
  FormMessage: typeof FormMessage;
}

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

export type FormItemContextValue = {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  Component?: ComponentType<FormItemProps>;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ Component, className, ...props }, ref) => {
    const id = useId();

    if (Component) {
      return <Component id={id} {...props} />;
    }

    return (
      <FormItemContext.Provider value={{ id, formItemId: `${id}-form-item`, formDescriptionId: `${id}-form-item-description`, formMessageId: `${id}-form-item-message` }}>
        <div ref={ref} className={cn('form-item grid gap-2 w-full', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

export interface FormLabelProps extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: string;
  Component?: ComponentType<FormLabelProps>;
}

export const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(({ Component, htmlFor, className, ...props }, ref) => {

  const { formItemId } = useContext(FormItemContext);

  if (Component) {
    return <Component {...props} />;
  }

  const { error } = props;

  return <Label ref={ref} htmlFor={htmlFor || formItemId} className={cn(error && 'text-destructive', className)} {...props} />;
});
FormLabel.displayName = 'FormLabel';

export interface FormControlProps extends ComponentPropsWithoutRef<typeof Slot> {
  error?: boolean;
  formItemId?: string;
  formDescriptionId?: string;
  formMessageId?: string;
  Component?: ComponentType<FormControlProps>;
}

export const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  FormControlProps
>(({ Component, ...props }, ref) => {

  if (Component) {
    return <Component {...props} />;
  }

  const { formItemId, error, formDescriptionId, formMessageId, } = props;

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : `${formDescriptionId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  formDescriptionId?: string;
  Component?: ComponentType<FormDescriptionProps>;
}

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ Component, className, ...props }, ref) => {
  if (Component) {
    return <Component {...props} />;
  }

  const { formDescriptionId } = props;

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  formMessageId?: string;
  error?: string;
  Component?: ComponentType<FormMessageProps>;
}

export const FormMessage = forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ Component, className, ...props }, ref) => {

  if (Component) {
    return <Component {...props} />;
  }

  const { formMessageId, error, children } = props;


  const body = error ? error : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends ControllerProps<TFieldValues, TName> {
  Component?: ComponentType<FormFieldProps<TFieldValues, TName>>;
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


