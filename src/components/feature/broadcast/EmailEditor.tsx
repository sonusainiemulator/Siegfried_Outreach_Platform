'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textArea'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { EmailEditorProps } from '@/types'
import DOMPurify from 'dompurify'
import { Code, Eye } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const EmailEditor: React.FC<EmailEditorProps> = ({ value, onChange, placeholder, className }) => {
  const direction = useAppDirection()
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const { t } = useTranslation()

  const sanitizedContent = DOMPurify.sanitize(value || "", {
                      ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
                    })

  return (
    <Card className={cn('border-2', className)}>
      <CardContent className="p-0">
        <Tabs
          value={activeTab}
          onValueChange={(v: any) => setActiveTab(v as 'code' | 'preview')}
          className="w-full"
          dir={direction}
        >
          <div className="border-b px-4 py-2 bg-muted/30">
            <TabsList className="h-9">
              <TabsTrigger value="code" className="text-xs">
                <Code className="w-3.5 h-3.5 mr-1.5" />
                {t('html_code')}
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                {t('preview')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="m-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[450px] font-mono text-sm border-0 rounded-none resize-none focus-visible:ring-0 p-4"
            />
          </TabsContent>

          <TabsContent value="preview" className="m-0">
            <div className="min-h-[450px] p-4 overflow-auto bg-background">
              {value ? (
                <div
                  className="email-preview"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizedContent
                  }}
                  style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-[450px] text-muted-foreground text-sm">
                  {t('no_content_to_preview')}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EmailEditor
