import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from './button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./remix-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

export interface DatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ control, name, label, description, className, labelClassName, buttonClassName }, ref) => {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    ref={ref}
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      buttonClassName
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>{label || "Pick a date"}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem>
        )}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";