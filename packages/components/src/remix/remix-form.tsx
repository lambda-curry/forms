import { type ReactNode, useContext, forwardRef } from 'react';
import type {
  KeepStateOptions,
  FieldValues,
  UseFormReturn,
  UseFormRegister,
} from 'react-hook-form';
import { useRemixFormContext } from 'remix-hook-form';
import { FormLabel, FormControl, FormDescription, FormMessage, FormFieldContext, FormItemContext } from '@/src/ui/form';
import type { BaseSyntheticEvent, ComponentPropsWithoutRef, } from 'react';

export interface RemixFormProviderProps<T extends FieldValues>
  extends Omit<UseFormReturn<T>, 'handleSubmit' | 'reset'> {
  children: ReactNode;
  handleSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<T>;
  reset: (values?: T, keepStateOptions?: KeepStateOptions) => void;
}

export const useRemixFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
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


export const RemixFormLabel = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<typeof FormLabel>>((props, ref) => (
  <FormLabel ref={ref} {...props} />
));
RemixFormLabel.displayName = 'RemixFormLabel';

export const RemixFormControl = forwardRef<HTMLElement, ComponentPropsWithoutRef<typeof FormControl>>((props, ref) => {
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
});
RemixFormControl.displayName = 'RemixFormControl';

export const RemixFormDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof FormDescription>>((props, ref) => {
  const { formDescriptionId } = useRemixFormField();
  return <FormDescription ref={ref} formDescriptionId={formDescriptionId} {...props} />;
});
RemixFormDescription.displayName = 'RemixFormDescription';

export const RemixFormMessage = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<typeof FormMessage>>((props, ref) => {
  const { error, formMessageId } = useRemixFormField();
  return <FormMessage ref={ref} formMessageId={formMessageId} error={error?.message} {...props} />;
});
RemixFormMessage.displayName = 'RemixFormMessage';

