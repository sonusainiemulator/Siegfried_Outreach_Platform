import { LucideIcon } from "lucide-react"
import { DataTableProps } from "./components"
import { VariantProps } from "class-variance-authority"
import { badgeVariants } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import Input from "@/components/ui/input"

export interface HistoryDetailDialogProps {
  item: any
  onClose: () => void
  promptLabel: string
  isCopied: boolean
  onCopy: (content: string) => void
  onDownload: (item: any) => void
}

export interface HistoryEmptyStateProps {
  startRoute: string
}

export interface HistoryTableProps {
  items: any[]
  isLoading: boolean
  isFetching: boolean
  page: number
  setPage: (fn: (p: number) => number) => void
  totalPages: number
  currentPage: number
  onView: (item: any) => void
  onCopy: (content: string) => void
  onDownload: (item: any) => void
}

export interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'primary' | 'destructive' | 'premium'
}

export interface CopyEmailCellProps {
  email: string
  truncate?: boolean
}

export interface CreditLimitPillProps {
  className?: string
}

export interface DataLoaderProps {
  className?: string
  height?: string
  text?: string
  size?: 'sm' | 'md' | 'lg'
  textClassName?: string
  fullPage?: boolean
  variant?: 'full' | 'spinner'
}

export interface FlagProps {
  countryCode: string // ISO 3166-1 alpha-2 code (e.g. "IN", "US")
  className?: string
  size?: number
}

export interface NoDataFoundProps {
  message?: string
  className?: string
  icon?: LucideIcon
  height?: string
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
  icon?: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    className?: string
  }
  endContent?: React.ReactNode
}

export interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
}

export interface SharedStatusSwitchProps {
  isActive: boolean
  onToggle: () => Promise<void>
  canManage: boolean
  disabled?: boolean
}

export interface TableLayoutProps<T> extends Omit<DataTableProps<T>, 'title'> {
  title: string
  subtitle?: string
  headerIcon?: React.ReactNode
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    className?: string
  }
  endContent?: React.ReactNode
}

export interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  onDownloadTemplate?: () => void
  isLoading?: boolean
  title?: string
}

export interface InquiryDetailModalProps {
  inquiryId: string | null
  isOpen: boolean
  onClose: () => void
}

export interface FormikPersistProps {
  name: string
  ignoreFields?: string[]
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (checked: boolean) => void
  onCheckedChange?: (checked: boolean) => void
  indeterminate?: boolean
}

export interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  icon?: React.ElementType
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

export interface SectionRefsContextType {
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  registerRef: (id: string, el: HTMLElement | null) => void
}