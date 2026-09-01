'use client'

import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TextInputProps } from '@/types'
import { useField } from 'formik'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import FormFieldWrapper from './widgets/FormFieldWrapper'

const TextInput = ({
  label,
  icon: Icon,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: TextInputProps) => {
  const [field, meta] = useField(props.name)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = props.type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type

  const toggleVisibility = () => setShowPassword((prev) => !prev)

  return (
    <FormFieldWrapper
      label={label}
      id={props.id || props.name}
      name={props.name}
      error={meta.error}
      touched={meta.touched}
      helperText={helperText}
      layout={layout}
      labelClass={labelClass}
      formGroupClass={formGroupClass}
    >
      <div className="relative w-full">
        {Icon && (
          <div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300',
              props.className?.includes('rounded-full') ? 'left-5' : 'left-3',
            )}
          >
            <Icon size={18} className="opacity-70 group-focus-within:opacity-100" />
          </div>
        )}
        <Input
          {...field}
          {...props}
          type={inputType}
          id={props.id || props.name}
          className={cn(
            meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive',
            Icon && 'pl-10',
            isPassword && 'pr-10',
          )}
          value={field.value ?? ''}
        />
        {isPassword && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  )
}

export default TextInput
