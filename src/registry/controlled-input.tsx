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
import { Input } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledInputProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & ComponentProps<typeof Input>

/**
 * A controlled input component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledInput } from '@/components/ui/controlled-input'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledInput
 *           name="email"
 *           label="Email"
 *           placeholder="Enter your email"
 *           rules={{ required: 'Email is required' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledInput = <T extends FieldValues>({
  name,
  rules,
  onChange,
  label,
  required,
  ...props
}: ControlledInputProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>()

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={name}
            onChange={(evt) => {
              if (onChange) {
                onChange(evt)
              }
              field.onChange(evt)
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

