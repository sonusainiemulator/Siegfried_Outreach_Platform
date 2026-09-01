import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Label from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scrollArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textArea'
import { useGenerateEmailContentMutation } from '@/redux/api/campaignApi'
import { ApiError, CampaignInput } from '@/types'
import { useFormikContext } from 'formik'
import { Code2, Eye, Loader2, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type CampaignFormValues = CampaignInput & { prompt?: string }

import { useAppDirection } from '@/hooks/useAppDirection'
import DOMPurify from 'dompurify'

const StepContent = () => {
  const { t } = useTranslation()
  const direction = useAppDirection()

  const { values, setFieldValue, touched, errors } = useFormikContext<CampaignFormValues>()
  const [generateEmail, { isLoading: isGenerating }] = useGenerateEmailContentMutation()

  const sanitizedContent = DOMPurify.sanitize(values.htmlTemplate || "", {
                      ALLOWED_TAGS: ['p', 'h1', 'h2', 'strong', 'ul', 'li', 'br'],
                    })

  const handleGenerateAI = async () => {
    const prompt = values.prompt
    if (!prompt) return toast.error(t('please_enter_a_prompt'))

    try {
      const res = await generateEmail({ prompt }).unwrap()

      if (res.data) {
        setFieldValue('htmlTemplate', res.data.html)
        setFieldValue('subject', res.data.subject)
        toast.success(res.message || t('email_content_generated_successfully'))
      } else {
        toast.error(res.message || t('failed_to_generate_content'))
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error('Generate email error:', error)
      toast.error(apiError?.data?.message || t('failed_to_generate_content'))
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4">
      <CardHeader>
        <CardTitle>{t('email_content')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('generate_with_ai')}</h3>
            </div>
            <div className="space-y-3">
              <Textarea
                value={values.prompt || ''}
                onChange={(e) => setFieldValue('prompt', e.target.value)}
                placeholder={t('ai_prompt_placeholder')}
                className="min-h-25 resize-none"
              />
              <Button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating || !values.prompt}
                size="lg"
                className='btn-color sm:h-12 h-10 p-button-padding! text-white'
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('generate_content')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* HTML Editor with Preview */}
        <div className="space-y-6">
          <Label className="text-base font-semibold">{t('html_content')}</Label>
          <Tabs defaultValue="code" className="w-full" dir={direction}>


            <TabsList className="bg-[unset] grid w-full grid-cols-2">
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code2 className="w-6 h-6" />
                {t('code')}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-6 h-6" />
                {t('preview')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="mt-3">
              <Card className="border-2">
                <CardContent className="p-0">
                  <Textarea
                    name="htmlTemplate"
                    value={values.htmlTemplate}
                    onChange={(e) => setFieldValue('htmlTemplate', e.target.value)}
                    placeholder={t('html_template_placeholder')}
                    className="min-h-100 font-mono text-sm border-0 rounded-[8px] resize-none focus-visible:ring-0"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview" className="mt-3">
              <Card className="border-2">
                <CardContent className="p-0">
                  <ScrollArea className="h-100">
                    <div className="sm:p-6 p-4">
                      {values.htmlTemplate ? (
                        <div
                          className="bg-white dark:bg-light-primary rounded-lg shadow-sm p-6 prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                              __html: sanitizedContent
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-88 text-muted-foreground">
                          <div className="text-center space-y-2">
                            <Eye className="w-12 h-12 mx-auto opacity-20" />
                            <p className="text-sm">{t('no_content_to_preview')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {touched.htmlTemplate && errors.htmlTemplate && (
            <p className="text-sm font-medium text-destructive">{errors.htmlTemplate}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {values.htmlTemplate?.length || 0} {t('characters')}
          </p>
        </div>
      </CardContent>
    </div>
  )
}

export default StepContent
