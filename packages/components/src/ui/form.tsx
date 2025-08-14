import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

import { cn } from './utils';
import { Label } from './label';

export type FieldComponents = {
  FormControl: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
  FormLabel: React.ComponentType<React.LabelHTMLAttributes<HTMLLabelElement>>;
  FormDescription: React.ComponentType<React.HTMLAttributes<HTMLParagraphElement>>;
  FormMessage: React.ComponentType<React.HTMLAttributes<HTMLParagraphElement>>;
};

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

// Export the context so it can be used by remix-hook-form
export const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// Update the FormItemContextValue to include the IDs needed by remix-hook-form
export type FormItemContextValue = {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
};

// Export the context so it can be used by remix-hook-form
export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ 
        id,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`
      }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    Component?: React.ComponentType<React.LabelHTMLAttributes<HTMLLabelElement>>;
    showRequiredIndicator?: boolean;
  }
>(({ className, Component, showRequiredIndicator = true, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  const { formState } = useFormContext();
  
  // Check if the field is required by examining the validation rules
  const isFieldRequired = React.useMemo(() => {
    if (!formState.defaultValues) return false;
    
    // Try to determine if the field is required by checking the validation rules
    const fieldName = props.htmlFor?.toString() || '';
    
    // Access the rules through the resolver or other means
    // This is a simplified approach and may need to be adjusted based on your validation setup
    const isRequired = fieldName && formState.errors && formState.errors[fieldName]?.type === 'required';
    
    return isRequired;
  }, [formState, props.htmlFor]);

  const LabelComponent = Component || Label;

  return (
    <LabelComponent
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {props.children}
      {showRequiredIndicator && isFieldRequired && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </LabelComponent>
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.HTMLAttributes<HTMLElement> & {
    Component?: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  }
>(({ Component, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  const ControlComponent = Component || Slot;

  return (
    <ControlComponent
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    Component?: React.ComponentType<React.HTMLAttributes<HTMLParagraphElement> & { formDescriptionId?: string }>;
  }
>(({ className, Component, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  const DescriptionComponent = Component || 'p';

  return (
    <DescriptionComponent
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      formDescriptionId={formDescriptionId}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    Component?: React.ComponentType<React.HTMLAttributes<HTMLParagraphElement> & { formMessageId?: string, error?: string }>;
  }
>(({ className, children, Component, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  const MessageComponent = Component || 'p';

  return (
    <MessageComponent
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      formMessageId={formMessageId}
      error={error?.message}
      {...props}
    >
      {body}
    </MessageComponent>
  );
});
FormMessage.displayName = 'FormMessage';

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
