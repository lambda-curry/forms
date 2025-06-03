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
import { CurrencyInput, Label } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledCurrencyInputProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  currency?: string
  onChange?: (value: number | undefined) => void
} & ComponentProps<typeof CurrencyInput>

/**
 * A controlled currency input component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledCurrencyInput } from '@/components/ui/controlled-currency-input'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledCurrencyInput
 *           name="price"
 *           label="Price"
 *           placeholder="Enter price"
 *           currency="USD"
 *           rules={{ required: 'Price is required' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledCurrencyInput = <T extends FieldValues>({
  name,
  rules,
  onChange,
  label,
  required,
  ...props
}: ControlledCurrencyInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
        render={({ field }) => (
          <CurrencyInput
            {...field}
            {...props}
            id={name}
            value={field.value}
            onValueChange={(value) => {
              if (onChange) {
                onChange(value)
              }
              field.onChange(value)
            }}
          />
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

