import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { CampaignMediaUploadProps } from '@/types/components/campaigns'
import { Link, Upload, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export const CampaignMediaUpload = ({
  mediaMode,
  setMediaMode,
  mediaPreview,
  setMediaPreview,
  setFieldValue,
  mediaValue,
  t,
}: CampaignMediaUploadProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="image">{t('media')}</Label>
        <div className="flex bg-light-gray rounded-[8px] p-1 pointer-events-auto glass-dark-card">
          <Button
            type="button"
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-lg transition-all mr-2',
              mediaMode === 'file'
                ? 'bg-primary! glass-dark-card shadow text-white dark:text-white'
                : ' bg-unset! text-black hover:bg-unset dark:text-white',
            )}
            onClick={() => setMediaMode?.('file')}
          >
            {t('file')}
          </Button>
          <Button
            type="button"
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-lg transition-all',
              mediaMode === 'url'
                ? 'bg-primary! glass-dark-card shadow text-white dark:text-white'
                : 'bg-unset! text-black dark:text-white hover:bg-unset ',
            )}
            onClick={() => setMediaMode?.('url')}
          >
            {t('url')}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {mediaMode === 'file' ? (
          <Label
            htmlFor="image"
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] border border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30 hover:bg-primary/5"
          >
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {mediaValue && !mediaValue.startsWith('http')
                ? mediaValue
                : t('choose_image_file', { defaultValue: 'Choose an image file…' })}
            </span>
            <Input
              id="image"
              name="media"
              type="file"
              accept="image/*,video/*,video/mp4,video/x-m4v,video/*,audio/*"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.currentTarget.files?.[0]
                if (file) {
                  setFieldValue('mediaFile', file)
                  const previewUrl = URL.createObjectURL(file)
                  setMediaPreview(previewUrl)
                }
              }}
            />
          </Label>
        ) : (
          <div className="relative flex items-center">
            <Link className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              id="mediaUrl"
              name="media"
              placeholder="https://example.com/image.jpg"
              value={mediaValue || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('media', e.target.value)
                setMediaPreview(e.target.value)
              }}
              className="pl-9"
            />
          </div>
        )}

        {mediaPreview && (
          <div className="relative inline-block mt-2">
            {mediaPreview.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={mediaPreview}
                className="h-24 rounded-lg object-cover border border-border"
                controls
                disablePictureInPicture
              />
            ) : (
              <Image src={mediaPreview} alt="Preview" width={100} height={100} unoptimized className="h-24 rounded-[8px] object-cover border border-border" />
            )}
            <Button
              onClick={() => {
                setMediaPreview(null)
                setFieldValue('mediaFile', null)
                setFieldValue('media', '')
              }}
              className="absolute -top-2 -right-2 text-white bg-destructive/50! rounded-full p-2! w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
