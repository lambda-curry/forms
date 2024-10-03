
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react'
// biome-ignore lint/style/noNamespaceImport: from Radix
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRemixFormContext } from 'remix-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './remix-form'

const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

const ControlledRadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'onValueChange' | 'value'> & {
    name: string,
    label?: string,
    description?: string,
    className?: string,
    labelClassName?: string,
    groupClassName?: string,
  }
>(({ name, label, description, className, labelClassName, groupClassName, children, ...props }, ref) => {
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              ref={ref}
              value={field.value}
              onValueChange={field.onChange}
              className={groupClassName}
              {...props}
            >
              {children}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
})
ControlledRadioGroup.displayName = "ControlledRadioGroup"

export { RadioGroup, RadioGroupItem, ControlledRadioGroup }
