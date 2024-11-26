import { useMemo } from 'react';
import { useRemixFormContext } from 'remix-hook-form';
import { Textarea, type TextareaProps } from '../ui/textarea';
import { RemixFormControl, RemixFormDescription, RemixFormLabel, RemixFormMessage } from './remix-form';

export type RemixTextareaProps = Omit<TextareaProps, 'control'>;

export function RemixTextarea(props: RemixTextareaProps) {
  const { control } = useRemixFormContext();

  const components = useMemo(
    () => ({
      FormControl: RemixFormControl,
      FormLabel: RemixFormLabel,
      FormDescription: RemixFormDescription,
      FormMessage: RemixFormMessage,
    }),
    []
  );

  return <Textarea control={control} components={components} {...props} />;
}
