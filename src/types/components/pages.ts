import { Page } from "../api";

export type ViewType = 'list' | 'create' | 'edit';

export interface PageFormProps {
  page: Page | null
  onClose: () => void
}