// biome-ignore lint/style/noNamespaceImport: prevents React undefined errors when exporting as a component library
import * as React from 'react';
import type { FieldValues, KeepStateOptions, UseFormRegister, UseFormReturn } from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';
import { FormControl, FormDescription, FormFieldContext, FormItemContext, FormLabel, FormMessage } from '../ui/form';

export interface RemixFormProviderProps<T extends FieldValues>
  extends Omit<UseFormReturn<T>, 'handleSubmit' | 'reset'> {
  children: React.ReactNode;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<T>;
  reset: (values?: T, keepStateOptions?: KeepStateOptions) => void;
}

export const useRemixFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
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

export const RemixFormLabel = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<typeof FormLabel>>(
  (props, ref) => <FormLabel ref={ref} {...props} />,
);
RemixFormLabel.displayName = 'RemixFormLabel';

export const RemixFormControl = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof FormControl>>(
  (props, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useRemixFormField();
    return (
      <FormControl
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
RemixFormControl.displayName = 'RemixFormControl';

export const RemixFormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FormDescription>
>((props, ref) => {
  const { formDescriptionId } = useRemixFormField();
  return <FormDescription ref={ref} formDescriptionId={formDescriptionId} {...props} />;
});
RemixFormDescription.displayName = 'RemixFormDescription';

export const RemixFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof FormMessage>
>((props, ref) => {
  const { error, formMessageId } = useRemixFormField();
  return <FormMessage ref={ref} formMessageId={formMessageId} error={error?.message} {...props} />;
});
RemixFormMessage.displayName = 'RemixFormMessage';
