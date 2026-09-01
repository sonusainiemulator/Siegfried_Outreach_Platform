import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { QAPair, QATrainingProps } from '@/types'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const QATraining = ({ qaPairs, setQaPairs }: QATrainingProps) => {
  const { t } = useTranslation()

  const addQaPair = () => {
    if (qaPairs.length > 0) {
      const lastPair = qaPairs[qaPairs.length - 1]
      if (!lastPair.question.trim() || !lastPair.answer.trim()) {
        toast.error(
          t('fill_previous_qa_pair', { defaultValue: 'Please fill previous Q&A pair fields before adding new one.' }),
        )
        return
      }
    }
    setQaPairs([...qaPairs, { question: '', answer: '' }])
  }

  const removeQaPair = (index: number) => {
    setQaPairs(qaPairs.filter((_, i) => i !== index))
  }

  const updateQaPair = (index: number, field: keyof QAPair, value: string) => {
    const newPairs = [...qaPairs]
    newPairs[index] = { ...newPairs[index], [field]: value }
    setQaPairs(newPairs)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <MessageSquare className="h-5 w-5" />
          </div>
          <Label className="text-lg font-medium text-foreground">{t('qa_pairs', { defaultValue: 'Q&A Pairs' })}</Label>
        </div>
        <Button
          onClick={addQaPair}
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto gap-2 rounded-xl font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all h-10 md:h-11"
        >
          <Plus className="h-4 w-4" />
          {t('add_qa_pair', { defaultValue: 'Add Q&A Pair' })}
        </Button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {qaPairs.length === 0 ? (
          <div className="border-2 border-dashed glass-card glass-dark-card border-border/40 rounded-border-radius flex flex-col items-center justify-center p-12 bg-muted/5">
            <div className="h-16 w-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm font-medium text-foreground ">
              {t('no_qa_pairs_added', { defaultValue: 'No Q&A pairs added' })}
            </p>
          </div>
        ) : (
          qaPairs.map((pair, index) => (
            <div
              key={index}
              className="relative group sm:p-6 p-4 rounded-border-radius glass-card glass-dark-card bg-muted/10 border border-border/20 transition-all hover:bg-muted/20 hover:border-primary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium bg-light-primary text-primary px-2 py-0.5 rounded-full ">
                    {t('pair', { defaultValue: 'Pair' })} #{index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  onClick={() => removeQaPair(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-foreground">
                    {t('question', { defaultValue: 'Question' })}
                  </Label>
                  <Input
                    value={pair.question}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateQaPair(index, 'question', e.target.value)
                    }
                    placeholder={t('enter_question', { defaultValue: 'Enter question' })}
                    className="rounded-[8px] glass-card glass-dark-card border-border/40 bg-card/60"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Label className="text-sm font-medium text-foreground">
                    {t('answer', { defaultValue: 'Answer' })}
                  </Label>
                  <Textarea
                    value={pair.answer}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateQaPair(index, 'answer', e.target.value)
                    }
                    placeholder={t('enter_answer', { defaultValue: 'Enter answer' })}
                    rows={3}
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

export default QATraining
