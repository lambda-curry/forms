import { useRemixFormContext } from 'remix-hook-form';
import { Textarea, type TextareaProps } from '../ui/textarea';
import { FormField, FormItem } from '../ui/form';
export interface RemixTextareaProps extends Omit<TextareaProps, 'control'> {
  label?: string;
  description?: string;
}

export function RemixTextarea(props: RemixTextareaProps) {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={props.name ?? ''}
      render={({ field }) => (
        <FormItem>
          <Textarea {...field} {...props} />
        </FormItem>
      )}
    />
  );
}
