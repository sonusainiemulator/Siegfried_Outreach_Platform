'use client'

import RichTextEditor from '@/components/shared/form-fields/RichTextEditor'
import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useCreatePageMutation, useUpdatePageMutation } from '@/redux/api/pageApi'
import { ApiError } from '@/types'
import { PageFormProps } from '@/types/components/pages'
import { authUtils } from '@/utils'
import { pageSchemas } from '@/utils/validation-schemas'
import { Form, Formik } from 'formik'
import { ArrowLeft, Globe, Loader2, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function PageForm({ page, onClose }: PageFormProps) {
  const { t } = useTranslation()
  const [createPage, { isLoading: isCreating }] = useCreatePageMutation()
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation()
  const user = authUtils.getUser()

  const isEditing = !!page

  const initialValues = {
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
    status: page?.status ?? true,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing && page) {
        const id = page._id || page.id
        const res = await updatePage({ id, ...values }).unwrap()
        toast.success(res.message || t('page_updated_successfully'))
      } else {
        const res = await createPage({ ...values, created_by: user?.id }).unwrap()
        toast.success(res.message || t('page_created_successfully'))
      }
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const isLoading = isCreating || isUpdating

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between gap-6">
        <div className="space-y-1">

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 bg-primary/10 text-primary hover:bg-primary/10 dark:bg-primary/20 hover:text-primary rounded-[8px] transition-all shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-medium tracking-tight title-color">
              {isEditing ? t('edit_page') : t('create_page')}
            </h1>
          </div>
        </div>
            <p className="text-subtitle-color font-medium text-base">
              {isEditing ? t('update_page_description_form') : t('create_page_description_form')}
            </p>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={pageSchemas.create(t)}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] border border-border/40 bg-card/40 overflow-hidden p-4 sm:p-6 space-y-8 glass-dark-card">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <TextInput
                        name="title"
                        label={t('page_title')}
                        placeholder={t('enter_page_title')}
                        className="h-14 rounded-2xl bg-background/50 border-border/40 focus:bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <TextInput
                        name="slug"
                        label={t('page_slug')}
                        placeholder={t('enter_page_slug')}
                        className="h-14 rounded-2xl bg-background/50 border-border/40 focus:bg-background font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <RichTextEditor
                      label={t('page_content')}
                      value={values.content}
                      onChange={(val) => setFieldValue('content', val)}
                      placeholder={t('start_typing_content')}
                    />
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2.5rem] border border-border/40 bg-card/40 overflow-hidden p-4 sm:p-6 space-y-8 border-t-secondary/10 glass-dark-card">
                <div className="flex items-center gap-3 text-secondary">
                  <Globe className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-medium text-title-color dark:text-white">
                    {t('seo_optimization_settings')}
                  </h3>
                </div>

                <div className="space-y-6">
                  <TextInput
                    name="meta_title"
                    label={t('search_engine_title')}
                    placeholder={t('enter_meta_title')}
                    className="h-14 rounded-2xl bg-background/50 border-border/40"
                  />
                  <TextAreaField
                    name="meta_description"
                    label={t('search_engine_description')}
                    placeholder={t('enter_meta_description')}
                    rows={4}
                    className="rounded-2xl bg-background/50 border-border/40"
                  />
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="rounded-border-radius border border-border/40 bg-card/40 p-4 sm:p-6 space-y-8 sticky top-24 glass-dark-card">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 glass-dark-card bg-muted/30 rounded-border-radius border border-border/40">
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-title-color dark:text-white">
                        {t('page_visibility')}
                      </span>
                    </div>
                    <Switch
                      checked={values.status}
                      onCheckedChange={(checked) => setFieldValue('status', checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>

                  <div className="space-y-4 flex gap-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-[8px] text-base font-medium btn-color text-white transition-all flex items-center justify-center gap-2 group"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5" />
                      ) : (
                        <>
                          <Save className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          {isEditing ? t('update_page_btn') : t('publish_page_btn')}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      disabled={isLoading}
                      className="w-full h-12 rounded-[8px] bg-gray-200 glass-dark-card hover:bg-primary hover:text-white dark:bg-modal-bg-color font-medium border border-transparent hover:border-border/40"
                    >
                      {t('cancel_changes')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
