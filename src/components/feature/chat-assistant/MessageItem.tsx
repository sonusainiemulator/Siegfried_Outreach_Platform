import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MessageItemProps } from '@/types'
import { getMediaUrl } from '@/utils'
import { downloadFile } from '@/utils/download'
import { Bot, Copy, Download } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

export const MessageItem = ({
  message,
  chatbot,
  backendApiUrl,
  onImageClick,
}: MessageItemProps) => {
  const isBot = message.role === 'bot'
  const isUser = message.role === 'user'
  const { t } = useTranslation()

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
    toast.success(t('message_copied_to_clipboard'))
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const downloadUrl = getMediaUrl(message.text) || ''
      const fileName = message.text.split('/').pop() || 'image.png'
      downloadFile(downloadUrl, fileName)
    } catch (error) {
      toast.error(t('failed_to_download_image'))
    }
  }

  return (
    <div
      className={cn(
        'group flex gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500 relative w-full',
        isUser ? 'flex-row-reverse' : '',
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white shadow-lg overflow-hidden',
          isBot ? 'bg-white' : 'bg-accent dark:bg-modal-bg-color glass-dark-card text-accent-foreground',
        )}
      >
        {isBot ? (
          chatbot?.appearance?.avatar ? (
            <Image
              src={getMediaUrl(chatbot.appearance.avatar) || ''}
              alt="Bot Avatar"
              width={25}
              height={25}
              className=" object-cover"
              unoptimized
            />
          ) : (
            <Bot className="w-5 h-5" />
          )
        ) : (
          <div className="font-bold text-xs uppercase">{t('me')}</div>
        )}
      </div>

      <div className={cn('sm:max-w-[70%] max-w-[85%] min-w-0 space-y-1 relative', isUser ? 'text-end' : '')}>
        <div
          className={cn(
            'p-4 text-sm leading-relaxed shadow-sm relative group/bubble transition-all duration-300',
            isUser
              ? 'bg-primary text-primary-foreground rounded-[20px] rounded-se-[4px] hover:shadow-primary/20 shadow-lg border border-primary/10'
              : 'bg-white dark:bg-black border border-glass-border rounded-[20px] rounded-ss-[4px] hover:border-primary/30 shadow-sm dark:text-white',
          )}
        >
          {message.text.startsWith('/uploads/') ? (
            <div
              className="group/image relative overflow-hidden rounded-lg transition-all hover:shadow-xl"
            >
              <div
                className="cursor-pointer"
                onClick={() => onImageClick(backendApiUrl + message.text)}
              >
                <Image
                  src={getMediaUrl(message.text) || ''}
                  alt="Uploaded content"
                  width={400}
                  height={300}
                  className="max-w-full rounded-lg transition-transform group-hover/image:scale-105"
                  unoptimized
                />
              </div>

              <div className="absolute top-2 end-2 opacity-0 group-hover/image:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover/image:translate-y-0">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white border border-white/20"
                  onClick={handleDownload}
                  title={t('download_image')}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'prose prose-sm max-w-none !break-words [overflow-wrap:anywhere] text-start overflow-hidden',
                isUser ? 'text-primary-foreground prose-invert' : 'dark:prose-invert',
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }: any) => <p className="mb-2 last:mb-0 font-medium">{children}</p>,
                  a: ({ href, children }: any) => (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-bold"
                    >
                      {children}
                    </Link>
                  ),
                  pre: ({ children }: any) => (
                    <pre className="bg-muted p-3 rounded-xl overflow-x-auto my-2 border border-glass-border">{children}</pre>
                  ),
                  code: ({ children }: any) => (
                    <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-bold leading-none">{children}</code>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.timestamp && (
          <span className="text-[9px] font-bold text-muted-foreground/40 px-2 uppercase tracking-wider block">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        )}

        <div className={cn(
          "absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 z-10",
          isUser
            ? "ltr:right-full ltr:mr-2 rtl:left-full rtl:ml-2"
            : "ltr:left-full ltr:ml-2 rtl:right-full rtl:mr-2"
        )}>
          <div className="flex items-center gap-1 rounded-full glass-card glass-dark-card backdrop-blur-md border border-glass-border ">
            {!message.text.startsWith('/uploads/') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200"
                title="Copy message"
              >
                <Copy className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
