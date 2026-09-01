'use client'

import { usePermission } from '@/hooks/usePermission'
import { useTranscribeAudioMutation } from '@/redux/api/aiContentApi'
import { ApiError } from '@/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import FileManagement from './components/FileManagement'
import SpeechToTextHeader from './components/SpeechToTextHeader'
import TranscriptionHistory from './components/TranscriptionHistory'
import TranscriptionResult from './components/TranscriptionResult'

  const SpeechToText = () => {
    const { t } = useTranslation()
    const { hasPermission } = usePermission()
    const canTranscribe = hasPermission('Generate Text Transcripts', 'write')
    const canDownload = hasPermission('Download Results', 'write')
    const [file, setFile] = useState<File | null>(null)
    const [transcription, setTranscription] = useState('')
    const [transcribeAudio, { isLoading }] = useTranscribeAudioMutation()

    const handleFileSelect = (selectedFile: File | null) => {
      setFile(selectedFile)
      setTranscription('')
    }

    const handleTranscribe = async () => {
      if (!canTranscribe) return
      if (!file) {
        toast.error(t('select_audio_video_file'))
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await transcribeAudio(formData).unwrap()
        setTranscription(response.data.content)
        toast.success(response.message || t('transcription_completed'))
      } catch (error) {
        const apiError = error as ApiError
        toast.error(apiError?.data?.message || t('failed_to_transcribe'))
      }
    }

    const handleClear = () => {
      setFile(null)
      setTranscription('')
    }

    return (
      <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      <SpeechToTextHeader onClear={handleClear} showClear={!!transcription} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-5 space-y-6">
            <FileManagement
              file={file}
              onFileSelect={handleFileSelect}
              onTranscribe={handleTranscribe}
              isLoading={isLoading}
              canTranscribe={canTranscribe}
            />
          </div>

          <div className="xl:col-span-7 h-full">
            <TranscriptionResult transcription={transcription} isLoading={isLoading} canDownload={canDownload} />
          </div>
        </div>

        <TranscriptionHistory onSelect={(content) => setTranscription(content)} />
      </div>
    )
  }

  export default SpeechToText
