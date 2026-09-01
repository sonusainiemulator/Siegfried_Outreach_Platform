'use client'

import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { TextAreaFieldProps } from '@/types'
import { useField } from 'formik'
import FormFieldWrapper from './widgets/FormFieldWrapper'

const TextAreaField = ({
  label,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: TextAreaFieldProps) => {
  const [field, meta] = useField(props.name)

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
      <Textarea
        {...field}
        {...props}
        id={props.id || props.name}
        className={cn(meta.touched && meta.error && 'border-destructive focus-visible:ring-destructive')}
        value={field.value ?? ''}
      />
    </FormFieldWrapper>
  )
}

export default TextAreaField
