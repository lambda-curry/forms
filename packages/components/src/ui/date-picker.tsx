import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRemixFormContext } from "remix-hook-form";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./remix-form";
import { Button } from './button';

interface DatePickerProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
}

export function ControlledDatePicker({ name, label, description, className, labelClassName, buttonClassName }: DatePickerProps) {
  const { control } = useRemixFormContext();

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
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    buttonClassName
                  )}
                  {...field}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : <span>{label || "Pick a date"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
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