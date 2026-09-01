'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { SelectFieldProps } from '@/types'
import { useField } from 'formik'
import FormFieldWrapper from './widgets/FormFieldWrapper'

const SelectField = ({
  label,
  options,
  formGroupClass,
  labelClass,
  helperText,
  layout = 'vertical',
  ...props
}: SelectFieldProps) => {
  const [field, meta, helpers] = useField(props.name)

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
      <Select
        value={field.value || undefined}
        onValueChange={(value) => helpers.setValue(value)}
      >
        <SelectTrigger
          id={props.id || props.name}
          className={cn(
            'flex h-12 w-full rounded-[8px] px-3 text-sm shadow-none! inner-card glass-dark-card focus:ring-0 focus:outline-none dark:text-subtitle-color',
            meta.touched &&
              meta.error &&
              'border-destructive ring-destructive',
            props.className
          )}
        >
          <SelectValue placeholder={props.placeholder || 'Select option'} />
        </SelectTrigger>

        <SelectContent className="bg-white dark:bg-black rounded-[8px]">
          {options
            .filter((option: { label: string; value: string }) => option.value !== '')
            .map(
              (
                option: { label: string; value: string },
                index: number
              ) => (
                <SelectItem
                  key={`${option.value}-${index}`}
                  value={option.value}
                  className="rounded-[8px] focus:text-black dark:focus:bg-transparent dark:focus:text-white!  data-[state=checked]:bg-primary focus:data-[state=checked]:bg-primary! data-[state=checked]:text-white!"
                >
                  {option.label}
                </SelectItem>
              )
            )}
        </SelectContent>
      </Select>
    </FormFieldWrapper>
  )
}

export default SelectField
