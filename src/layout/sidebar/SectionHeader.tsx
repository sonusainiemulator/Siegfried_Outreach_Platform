import { cn } from '@/lib/utils'
import { ExtendedSectionHeaderProps } from '@/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const SectionHeader: FC<ExtendedSectionHeaderProps> = ({ label, isCollapsed }) => {
  const { t } = useTranslation()
  const i18nKey = label.toLowerCase().replace(/ /g, '_')

  return (
    <div
      className={cn(
        'px-2 m-0 mb-2 mt-3 transition-all duration-500 overflow-hidden',
        isCollapsed ? 'opacity-0 h-0 my-0 mb-0 mt-0' : 'opacity-100',
      )}
    >
      <p className="text-xs text-subtitle-color dark:opacity-100 opacity-60 uppercase font-semibold whitespace-nowrap">
        {t(i18nKey, { defaultValue: label })}
      </p>
    </div>
  )
}

export default SectionHeader
