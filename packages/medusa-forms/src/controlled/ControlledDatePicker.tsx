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
import { DatePicker, Label } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledDatePickerProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onChange?: (date: Date | undefined) => void
} & ComponentProps<typeof DatePicker>

/**
 * A controlled date picker component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledDatePicker } from '@/components/ui/controlled-datepicker'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledDatePicker
 *           name="birthDate"
 *           label="Birth Date"
 *           placeholder="Select your birth date"
 *           rules={{ required: 'Birth date is required' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledDatePicker = <T extends FieldValues>({
  name,
  rules,
  onChange,
  label,
  placeholder,
  required,
  ...props
}: ControlledDatePickerProps<T>) => {
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
          <DatePicker
            {...field}
            {...props}
            value={field.value}
            onChange={(date) => {
              if (onChange) {
                onChange(date)
              }
              field.onChange(date)
            }}
            placeholder={placeholder}
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

