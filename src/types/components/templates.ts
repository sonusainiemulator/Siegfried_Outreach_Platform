export interface Template {
    id: string
    title: string
    description: string
    category: string
    icon: string
    slug: string
    isFavorite?: boolean
}

export interface TemplateCardProps {
    template: Template
    onClick: (template: Template) => void
    onToggleFavorite: (e: React.MouseEvent, id: string) => void
}