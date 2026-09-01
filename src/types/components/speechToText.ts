export interface SpeechToTextHeaderProps {
  onClear: () => void
  showClear?: boolean
}

export interface FileManagementProps {
  file: File | null
  onFileSelect: (file: File | null) => void
  onTranscribe: () => void
  isLoading: boolean
  canTranscribe: boolean
}

export interface TranscriptionResultProps {
  transcription: string
  isLoading: boolean
  canDownload: boolean
}

export interface TranscriptionHistoryProps {
  onSelect: (content: string) => void
}
