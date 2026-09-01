'use client'

import LanguageModal from '@/components/feature/languages/LanguageModal'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { LanguageModalsProps } from '@/types/language'
import { useTranslation } from 'react-i18next'

export const LanguageModals = ({
  isModalOpen,
  setIsModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedLanguage,
  setSelectedLanguage,
  onSave,
  onDeleteConfirm,
  isSaving,
  isDeleting,
}: LanguageModalsProps) => {
  const { t } = useTranslation()

  return (
    <>
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedLanguage(null)
        }}
        onSave={onSave}
        language={selectedLanguage}
        isLoading={isSaving}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
        }}
        onConfirm={onDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_language_title')}
        description={t('delete_language_description')}
      />
    </>
  )
}
