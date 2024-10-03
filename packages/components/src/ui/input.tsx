import { type InputHTMLAttributes, forwardRef } from 'react'
import { useRemixFormContext } from 'remix-hook-form'
import { cn } from "@/lib/utils"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './remix-form'

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> { }

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

export const ControlledInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'onChange' | 'value'> & {
    name: string,
    label?: string,
    description?: string,
    className?: string,
    labelClassName?: string,
    inputClassName?: string
  }
>(({ name, label, description, className, labelClassName, inputClassName, ...props }, ref) => {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <Input
              ref={ref}
              value={field.value}
              onChange={field.onChange}
              className={inputClassName}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
})
ControlledInput.displayName = "ControlledInput"
