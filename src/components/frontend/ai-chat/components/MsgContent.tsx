import { Button } from '@/components/ui/button'
import { BACKEND_API_URL } from '@/constants'
import { Download } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const MsgContent = ({ text, onOpenLightbox }: { text: string; onOpenLightbox?: (url: string) => void }) => {
  const { t } = useTranslation()
  if (!text) return null

  const isImageUrl = (t: string) => {
    const trimmed = t.trim()
    return (
      (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) &&
      /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(trimmed)
    )
  }

  return (
    <div className="space-y-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-all">
      {text.split('\n').map((line: string, i: number) => {
        const trimmedLine = line.trim()

        if (isImageUrl(trimmedLine)) {
          const fullUrl = trimmedLine.startsWith('http')
            ? trimmedLine
            : `${BACKEND_API_URL}/${trimmedLine.startsWith('/') ? trimmedLine.slice(1) : trimmedLine}`
          return (
            <div key={i} className="my-2 rounded-2xl overflow-hidden border border-border/40 shadow-md max-w-lg relative group/image">
              <Image
                src={fullUrl}
                alt="Generated AI Content"
                width={800}
                height={800}
                className="w-full h-auto object-contain cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                unoptimized
                onClick={() => onOpenLightbox?.(fullUrl)}
              />
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch(fullUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `generated-image-${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    toast.success(t('image_downloaded_successfully'));
                  } catch {
                    toast.error(t('failed_to_download_image'));
                  }
                }}
                className="absolute h-12! top-3 right-3 p-2 bg-primary/50! hover:bg-black/70 text-white rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm"
                title="Download Image"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )
        }

        if (line.startsWith('**') && line.endsWith('**'))
          return <p key={i} className="font-bold">{line.slice(2, -2)}</p>

        if (line.startsWith('- ') || line.startsWith('• '))
          return (
            <p key={i} className="flex gap-2 pl-2">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span>{line.slice(2)}</span>
            </p>
          )

        return <p key={i}>{line || <br />}</p>
      })}
    </div>
  )
}
