import { LucideIcon } from 'lucide-react'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: React.ReactNode
  icon?: LucideIcon
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
}

export interface OtpInputProps {
  value: string[]
  onChange: (value: string[]) => void
  digits?: number
  className?: string
}

export interface FormFieldWrapperProps {
  label?: React.ReactNode
  id: string
  name: string
  error?: string
  touched?: boolean
  helperText?: string
  layout?: 'horizontal' | 'vertical'
  labelClass?: string
  formGroupClass?: string
  children: React.ReactNode
}

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: React.ReactNode
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  label?: React.ReactNode
  placeholder?: string
  options: { label: string; value: string }[]
  formGroupClass?: string
  labelClass?: string
  helperText?: string
  layout?: 'horizontal' | 'vertical'
}
