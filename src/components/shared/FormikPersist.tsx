'use client'

import { useDebounce } from '@/hooks/useDebounce'
import { FormikPersistProps } from '@/types/shared'
import { isBrowser } from '@/utils/environment'
import { useFormikContext } from 'formik'
import { useEffect, useRef } from 'react'

/**
 * Persists Formik state to localStorage.
 * Usage: Place inside <Formik> component.
 */
export const FormikPersist = ({ name, ignoreFields = [] }: FormikPersistProps) => {
  const { values, setValues } = useFormikContext<any>()
  const debouncedValues = useDebounce(values, 500)
  const isInitialLoad = useRef(true)

  const storageKey = `form-persist-${name}`

  // Load from localStorage on mount as a fallback
  useEffect(() => {
    const savedValues = localStorage.getItem(storageKey)
    if (savedValues) {
      try {
        const parsed = JSON.parse(savedValues)
        // Clean up ignored fields if any
        ignoreFields.forEach((field) => delete parsed[field])
        
        // Use a small delay to ensure Formik is fully ready and hasn't been re-initialized by parent
        const timer = setTimeout(() => {
          setValues((prev: any) => ({ ...prev, ...parsed }))
          isInitialLoad.current = false
        }, 50)
        return () => clearTimeout(timer)
      } catch (e) {
        console.error('Error parsing persisted form values', e)
        isInitialLoad.current = false
      }
    } else {
      isInitialLoad.current = false
    }
  }, [name, storageKey])

  // Save to localStorage whenever values change (debounced)
  useEffect(() => {
    if (isInitialLoad.current) return

    const valuesToSave = { ...debouncedValues }
    ignoreFields.forEach((field) => delete valuesToSave[field])

    localStorage.setItem(storageKey, JSON.stringify(valuesToSave))
  }, [debouncedValues, storageKey])

  return null
}

/**
 * Call this function to clear the persisted state (e.g., after success submission)
 */
export const clearFormPersistence = (name: string) => {
  if (isBrowser) {
    localStorage.removeItem(`form-persist-${name}`)
  }
}
