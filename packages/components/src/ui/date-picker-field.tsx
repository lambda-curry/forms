import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Button } from './button';
import { DatePicker } from './date-picker';
import {
  type FieldComponents,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from './utils';

export interface DatePickerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  components?: Partial<FieldComponents>;
}

export function DatePickerField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  className,
  labelClassName,
  buttonClassName,
  components,
}: DatePickerFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel Component={components?.FormLabel} className={labelClassName}>
              {label}
            </FormLabel>
          )}
          <FormControl Component={components?.FormControl}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground',
                    buttonClassName,
                  )}
                  data-slot="date-picker-trigger"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, 'PPP') : <span>{label || 'Pick a date'}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <DatePicker
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  data-slot="date-picker-field"
                />
              </PopoverContent>
            </Popover>
          </FormControl>

          {description && <FormDescription Component={components?.FormDescription}>{description}</FormDescription>}
          {fieldState.error && (
            <FormMessage Component={components?.FormMessage}>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}

DatePickerField.displayName = 'DatePickerField';
