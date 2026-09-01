export interface AnalysisResult {
  aiDetection: {
    aiWriting: string;
    humanWriting: string;
    total: string;
  };
  plagiarismReport: {
    plagiarized: string;
    unique: string;
    sources: Array<{
      title: string;
      url: string;
      score: number;
    }>;
  };
}

export interface Source {
  title: string;
  url: string;
  score: number;
}

export interface DetectionMatrixItem {
  label: string;
  val: string;
  level: 'good' | 'bad';
}

export interface FeatureItem {
  icon: React.FC<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
}

export interface SemiCircleGaugeProps {
  value: number;
  label: string;
  type?: 'ai' | 'plag';
  size?: number;
}

export interface DetectAIHeaderProps {
  onClear: () => void;
}

export interface ContentEditorProps {
  text: string;
  isLoading: boolean;
  onTextChange: (value: string) => void;
  onAnalyze: () => void;
  canVerify: boolean;
}

export interface DetectionMatrixProps {
  aiScore: number;
  plagScore: number;
}

export interface ResultsDisplayProps {
  result: AnalysisResult | null;
  aiScore: number;
  plagScore: number;
}

export interface TopSourcesProps {
  result: AnalysisResult;
}