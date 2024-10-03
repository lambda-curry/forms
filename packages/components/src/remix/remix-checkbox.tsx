import React from 'react'
import { useRemixFormContext } from 'remix-hook-form'
import { Checkbox, type CheckboxProps } from '../ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/remix-form'

export interface RemixCheckboxProps extends Omit<CheckboxProps, 'onChange' | 'checked'> {
  name: string
  label?: string
  description?: string
  className?: string
  labelClassName?: string
  checkboxClassName?: string
}

export const RemixCheckbox = React.forwardRef<HTMLButtonElement, RemixCheckboxProps>(
  ({ name, label, description, className, labelClassName, checkboxClassName, ...props }, ref) => {
    const { control } = useRemixFormContext()



    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={className} >
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            < FormControl >
              <Checkbox
                ref={ref}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={checkboxClassName}
                {...props}
              />
            </FormControl >
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </FormItem >
        )
        }
      />
    )
  }
)

RemixCheckbox.displayName = "RemixCheckbox"