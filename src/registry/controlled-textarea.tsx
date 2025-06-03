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
import { Textarea } from '@medusajs/ui'
import { ErrorMessage } from '@hookform/error-message'

export type ControlledTextareaProps<T extends FieldValues> = Omit<ControllerProps, 'render'> & {
  name: Path<T>
  rules?: Omit<RegisterOptions<T, Path<T>>, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
} & ComponentProps<typeof Textarea>

/**
 * A controlled textarea component that integrates with react-hook-form.
 * 
 * @example
 * ```tsx
 * import { useForm, FormProvider } from 'react-hook-form'
 * import { ControlledTextarea } from '@/components/ui/controlled-textarea'
 * 
 * function MyForm() {
 *   const methods = useForm()
 *   
 *   return (
 *     <FormProvider {...methods}>
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <ControlledTextarea
 *           name="description"
 *           label="Description"
 *           placeholder="Enter a description"
 *           rows={4}
 *           rules={{ required: 'Description is required' }}
 *         />
 *       </form>
 *     </FormProvider>
 *   )
 * }
 * ```
 */
export const ControlledTextarea = <T extends FieldValues>({
  name,
  rules,
  onChange,
  label,
  required,
  ...props
}: ControlledTextareaProps<T>) => {
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
          <Textarea
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

