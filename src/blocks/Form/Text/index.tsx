import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

export const Text: React.FC<
  TextField & {
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
    register: UseFormRegister<FieldValues>
    placeholder?: string
  }
> = ({ name, defaultValue, errors, label, register, required: requiredFromProps, width, placeholder }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name} className="sr-only">{label}</Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="text"
        placeholder={placeholder || label}
        {...register(name, { required: requiredFromProps })}
      />
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}
