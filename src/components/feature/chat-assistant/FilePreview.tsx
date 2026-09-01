import { Button } from '@/components/ui/button'
import { FilePreviewProps } from '@/types'
import { Paperclip, X } from 'lucide-react'
import Image from 'next/image'

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const FilePreview = ({ selectedFiles, onRemoveFile }: FilePreviewProps) => {
  if (selectedFiles.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-background/40 backdrop-blur-xl border border-glass-border rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
      {selectedFiles.map((file, index) => (
        <div key={`${file.name}-${index}`} className="relative group/file">
          <div className="h-20 w-20 rounded-xl border border-glass-border bg-accent/20 flex flex-col items-center justify-center p-2 text-center overflow-hidden transition-all group-hover/file:bg-accent/40">
            {file.type.startsWith('image/') ? (
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <>
                <Paperclip className="w-6 h-6 text-primary mb-1" />
                <p className="text-[8px] font-bold truncate w-full px-1">{file.name}</p>
                <p className="text-[7px] text-muted-foreground">{formatFileSize(file.size)}</p>
              </>
            )}
          </div>
          <Button
            onClick={() => onRemoveFile(index)}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 py-2 px-2 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover/file:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
