import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { TextContent, TextTrainingProps } from '@/types'
import { FileJson, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const TextTraining = ({ textContent, setTextContent }: TextTrainingProps) => {
  const { t } = useTranslation()

  const addTextContent = () => {
    if (textContent.length > 0) {
      const lastContent = textContent[textContent.length - 1]
      if (!lastContent.title.trim() || !lastContent.content.trim()) {
        toast.error(
          t('fill_previous_text_content', {
            defaultValue: 'Please fill previous Text content fields before adding new one.',
          }),
        )
        return
      }
    }
    setTextContent([...textContent, { title: '', content: '' }])
  }

  const removeTextContent = (index: number) => {
    setTextContent(textContent.filter((_, i) => i !== index))
  }

  const updateTextContent = (index: number, field: keyof TextContent, value: string) => {
    const newContent = [...textContent]
    newContent[index] = { ...newContent[index], [field]: value }
    setTextContent(newContent)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
            <FileJson className="h-5 w-5" />
          </div>
          <Label className="text-lg font-medium text-foreground">
            {t('text_content', { defaultValue: 'Text Content' })}
          </Label>
        </div>
        <Button
          onClick={addTextContent}
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all h-10 md:h-11"
        >
          <Plus className="h-4 w-4" />
          {t('add_text_content', { defaultValue: 'Add Text Content' })}
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {textContent.length === 0 ? (
          <div className="border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center sm:p-6 p-4 glass-card glass-dark-card bg-muted/5">
            <div className="h-16 w-16 rounded-border-radius bg-light-primary flex items-center justify-center mb-4">
              <FileJson className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground ">
              {t('no_text_content_added', { defaultValue: 'No text content added' })}
            </p>
          </div>
        ) : (
          textContent.map((item, index) => (
            <div
              key={index}
              className="relative group sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card bg-muted/10 border border-border/20 transition-all hover:bg-muted/20 hover:border-blue-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium bg-light-primary text-primary px-2 py-0.5 rounded-full ">
                    {t('content', { defaultValue: 'Content' })} #{index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  onClick={() => removeTextContent(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-foreground">{t('title', { defaultValue: 'Title' })}</Label>
                  <Input
                    value={item.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateTextContent(index, 'title', e.target.value)
                    }
                    placeholder={t('enter_title', { defaultValue: 'Enter title' })}
                    className="rounded-[8px] glass-card glass-dark-card border-border/40 bg-card/60"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-foreground">
                    {t('content', { defaultValue: 'Content' })}
                  </Label>
                  <Textarea
                    value={item.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateTextContent(index, 'content', e.target.value)
                    }
                    placeholder={t('enter_content', { defaultValue: 'Enter content' })}
                    rows={5}
                    className="rounded-[8px] glass-card glass-dark-card border-border/40 bg-card/60 resize-none"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TextTraining
