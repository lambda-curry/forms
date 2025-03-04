// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import type { FieldValues, KeepStateOptions, UseFormReturn } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';
import { FormControl as BaseFormControl, FormDescription as BaseFormDescription, FormFieldContext as BaseFormFieldContext, FormItemContext as BaseFormItemContext, FormLabel as BaseFormLabel, FormMessage as BaseFormMessage } from '../ui/form';

export interface FormProviderProps<T extends FieldValues>
  extends Omit<UseFormReturn<T>, 'handleSubmit' | 'reset'> {
  children: React.ReactNode;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  reset: (values?: T, keepStateOptions?: KeepStateOptions) => void;
}

export const useFormField = () => {
  const fieldContext = React.useContext(BaseFormFieldContext);
  const itemContext = React.useContext(BaseFormItemContext);
  const { getFieldState, formState } = useRemixFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id, formItemId, formDescriptionId, formMessageId } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId,
    formDescriptionId,
    formMessageId,
    ...fieldState,
  };
};

export const FormLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof BaseFormLabel>>(
  (props, ref) => <BaseFormLabel ref={ref} {...props} />,
);
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseFormControl>>(
  (props, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (
      <BaseFormControl
        ref={ref}
        error={!!error}
        formItemId={formItemId}
        formDescriptionId={formDescriptionId}
        formMessageId={formMessageId}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseFormDescription>
>((props, ref) => {
  const { formDescriptionId } = useFormField();
  return <BaseFormDescription ref={ref} formDescriptionId={formDescriptionId} {...props} />;
});
FormDescription.displayName = 'FormDescription';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseFormMessage>
>((props, ref) => {
  const { error, formMessageId } = useFormField();
  return <BaseFormMessage ref={ref} formMessageId={formMessageId} error={error?.message || (error ? String(error) : undefined)} {...props} />;
});
FormMessage.displayName = 'FormMessage';