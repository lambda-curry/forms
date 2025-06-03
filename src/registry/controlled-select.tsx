"use client"

import type * as React from 'react'
import {
  Controller,
  type ControllerProps,
  type FieldPathValue,
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import { Select } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledSelectProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  onBlur?: () => void
  onChange?: (value: unknown) => void
} & (
  | {
      options: { label: React.ReactNode; value: FieldPathValue<T, Path<T>> }[]
      children?: never
    }
  | {
      options?: never
      children: React.ReactNode
    }
)

/**
 * A controlled select component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledSelect } from '@/components/ui/controlled-select'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   const options = [
 *     { label: 'Option 1', value: 'option1' },
 *     { label: 'Option 2', value: 'option2' },
 *   ]
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledSelect
 *           name="category"
 *           label="Category"
 *           placeholder="Select a category"
 *           options={options}
 *           rules={{ required: 'Category is required' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledSelect = <T extends FieldValues>({
  name,
  rules,
  children,
  options,
  onChange,
  onBlur,
  label,
  placeholder,
  required,
  ...props
}: ControlledSelectProps<T>) => {
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
      <Controller<T>
        control={control}
        name={name}
        rules={rules as Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>}
        render={({ field }) => {
          const handleChange = (value: unknown) => {
            if (typeof onChange === 'function') onChange(value)
            field.onChange(value)
          }

          if (options) {
            return (
              <Select {...props} onValueChange={handleChange} value={field.value}>
                <Select.Trigger>
                  <Select.Value placeholder={placeholder} />
                </Select.Trigger>
                <Select.Content>
                  {options.map((option) => (
                    <Select.Item key={String(option.value)} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )
          }

          return (
            <Select {...props} onValueChange={handleChange} value={field.value}>
              {children}
            </Select>
          )
        }}
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

