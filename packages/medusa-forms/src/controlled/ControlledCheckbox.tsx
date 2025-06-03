"use client"

import type { ComponentProps } from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import { Checkbox, Label } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledCheckboxProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onChange?: (checked: boolean) => void
} & ComponentProps<typeof Checkbox>

/**
 * A controlled checkbox component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledCheckbox } from '@/components/ui/controlled-checkbox'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledCheckbox
 *           name="terms"
 *           label="I agree to the terms and conditions"
 *           rules={{ required: 'You must agree to the terms' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledCheckbox = <T extends FieldValues>({
  name,
  rules,
  onChange,
  label,
  description,
  required,
  ...props
}: ControlledCheckboxProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name={name}
        rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
        render={({ field }) => (
          <div className="flex items-start space-x-2">
            <Checkbox
              {...field}
              {...props}
              id={name}
              checked={field.value}
              onCheckedChange={(checked) => {
                const booleanValue = checked === true
                if (onChange) {
                  onChange(booleanValue)
                }
                field.onChange(booleanValue)
              }}
            />
            <div className="grid gap-1.5 leading-none">
              {label && (
                <Label htmlFor={name}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <p className="text-sm text-red-500">{message}</p>
        )}
      />
    </div>
  )
}

