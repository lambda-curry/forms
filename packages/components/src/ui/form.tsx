import type * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementRef,
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useId,
} from 'react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Label } from './label';

export interface FieldComponents {
  FormControl: ForwardRefExoticComponent<FormControlProps & RefAttributes<HTMLDivElement>>;
  FormDescription: ForwardRefExoticComponent<FormDescriptionProps & RefAttributes<HTMLParagraphElement>>;
  FormLabel: ForwardRefExoticComponent<FormLabelProps & RefAttributes<HTMLLabelElement>>;
  FormMessage: ForwardRefExoticComponent<FormMessageProps & RefAttributes<HTMLParagraphElement>>;
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

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(({ Component, className, ...props }, ref) => {
  const id = useId();

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

export interface FormLabelProps extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: string;
  Component?: ForwardRefExoticComponent<FormLabelProps & RefAttributes<HTMLLabelElement>>;
}

export const FormLabel = forwardRef<ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ Component, htmlFor, className, error, ...props }, ref) => {
    const { formItemId } = useContext(FormItemContext);

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

export interface FormControlProps extends ComponentPropsWithoutRef<typeof Slot> {
  error?: boolean;
  formItemId?: string;
  formDescriptionId?: string;
  formMessageId?: string;
  Component?: ForwardRefExoticComponent<FormControlProps & RefAttributes<HTMLDivElement>>;
}

export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(({ Component, ...props }, ref) => {
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

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  formDescriptionId?: string;
  Component?: ForwardRefExoticComponent<FormDescriptionProps & RefAttributes<HTMLParagraphElement>>;
}

export const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
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

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  formMessageId?: string;
  error?: string;
  Component?: ForwardRefExoticComponent<FormMessageProps & RefAttributes<HTMLParagraphElement>>;
}

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
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
