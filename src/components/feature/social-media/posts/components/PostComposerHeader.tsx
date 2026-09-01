'use client'

import { CreditLimitPill } from '@/components/reusable/CreditLimitPill'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PostComposerHeaderProps } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const PostComposerHeader = ({ editId, onNavigateToDashboard }: PostComposerHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="flex items-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all w-11 h-9"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
          <div className="flex items-start flex-col">
            <h1 className="text-3xl font-bold tracking-tight title-color text-title-color dark:text-white leading-[1.1]">
              {editId ? t('social_recalibrate_dispatch') : t('social_content_wizard')}
            </h1>
          </div>
        </div>
      </div>
      <div className='flex gap-2'>
        <Badge className="sm:h-12 h-10 rounded-[8px] p-button-padding! bg-unset text-primary font-medium capitalize! text-sm border-primary whitespace-nowrap">
          {editId ? t('social_edit_mode') : t('social_create_mode')}
        </Badge>
        <CreditLimitPill />
      </div>
    </div>
  )
}

export default PostComposerHeader