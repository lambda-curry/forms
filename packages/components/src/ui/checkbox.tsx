
import { type ComponentPropsWithoutRef, type ReactNode, forwardRef, type ElementRef } from 'react'
// biome-ignore lint/style/noNamespaceImport: from Radix
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { FormLabel } from './remix-form'
import { useRemixFormContext } from 'remix-hook-form'
import { cn } from "@/lib/utils"
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from './remix-form'

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: ReactNode
}

const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <CheckboxPrimitive.Root
      ref={ref}
      id={id}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
  </div>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

export const ControlledCheckbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<CheckboxProps, 'onChange' | 'checked'> & {
    name: string,
    label?: string,
    description?: string,
    className?: string,
    labelClassName?: string,
    checkboxClassName?: string
  }
>(({ name, label, description, className, labelClassName, checkboxClassName, ...props }, ref) => {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <Checkbox
              ref={ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={checkboxClassName}
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
ControlledCheckbox.displayName = "ControlledCheckbox"
