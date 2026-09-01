'use client'

import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MenuButtonProps, RichTextEditorProps, ToolbarProps } from '@/types'
import { Mark, mergeAttributes } from '@tiptap/core'
import BubbleMenuExtension from '@tiptap/extension-bubble-menu'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Maximize,
  Minimize,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'


const InlineQuote = Mark.create({
  name: 'inlineQuote',
  parseHTML() {
    return [{ tag: 'q' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['q', mergeAttributes(HTMLAttributes), 0]
  },
})

const MenuButton = ({ onClick, isActive = false, disabled = false, children, className = '' }: MenuButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'h-9 w-9 transition-all duration-200',
      isActive
        ? 'bg-primary/10 text-primary hover:bg-primary/20'
        : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800',
      className,
    )}
  >
    {children}
  </Button>
)


const Toolbar = ({ editor, isFullScreen, setIsFullScreen }: ToolbarProps) => {
  const { t } = useTranslation()
  if (!editor) return null

  return (
    <div
      className={cn(
        'flex items-center flex-wrap gap-1 p-2 border-b border-zinc-200/50 dark:border-light-border-color z-30 transition-colors bg-white dark:bg-black-jet sticky top-0',
      )}
    >
      <div className="flex items-center gap-1 mr-2 px-1">
        <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </MenuButton>
      </div>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />

      <div className="flex items-center gap-1">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        >
          <UnderlineIcon className="w-4 h-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
          <Strikethrough className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
        >
          <Highlighter className="w-4 h-4" />
        </MenuButton>
      </div>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => {
            if (editor.isActive('inlineQuote')) {
              editor.chain().focus().toggleMark('inlineQuote').run()
              return
            }

            const { from, to, $from, $to } = editor.state.selection
            const isTextSelection = from !== to
            const isWholeBlock =
              $from.parent === $to.parent && $from.parentOffset === 0 && $to.parentOffset === $from.parent.content.size
            const spansMultipleBlocks = $from.parent !== $to.parent

            if (isTextSelection && !isWholeBlock && !spansMultipleBlocks) {
              editor.chain().focus().toggleMark('inlineQuote').run()
            } else {
              editor.chain().focus().toggleBlockquote().run()
            }
          }}
          isActive={editor.isActive('blockquote') || editor.isActive('inlineQuote')}
        >
          <Quote className="w-4 h-4" />
        </MenuButton>
      </div>

      <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

      <div className="flex items-center gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="w-4 h-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="w-4 h-4" />
        </MenuButton>
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="h-9 px-3 flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
      >
        {isFullScreen ? (
          <>
            <Minimize className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('exit_focus')}</span>
          </>
        ) : (
          <>
            <Maximize className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('focus_mode')}</span>
          </>
        )}
      </Button>
    </div>
  )
}

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder,
  minHeight = '500px',
  maxHeight,
}: RichTextEditorProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 10)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      BubbleMenuExtension,
      Placeholder.configure({
        placeholder: placeholder || 'Neural synapses awaiting input...',
      }),
      InlineQuote,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          'ProseMirror prose dark:prose-invert max-w-none focus:outline-none p-6 sm:p-8 leading-relaxed text-zinc-800 dark:text-zinc-200 outline-none',
        ),
        style: !isFullScreen ? `min-height: ${minHeight};` : 'min-height: 100%;',
      },
    },
  })

  // Update content when value prop changes (e.g. from AI generation)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  if (!editor) return null

  return (
    <div
      className={cn('flex flex-col h-full w-full', !isFullScreen && `min-h-[${minHeight}]`)}
      style={{ minHeight: !isFullScreen ? minHeight : 'auto' }}
    >
      {label && (
        <Label className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4">
          {label}
        </Label>
      )}

      {isFullScreen && mounted ? (
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-white dark:bg-zinc-950 flex flex-col animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-black-jet">
              <Toolbar editor={editor} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
              <div className="flex-1 overflow-y-auto custom-scrollbar relative selection:bg-primary/20 max-w-4xl mx-auto w-full glass-card glass-dark-card my-8 rounded-border-radius p-4 sm:p-12 mb-20">
                {editor && (
                  <BubbleMenu
                    editor={editor}
                    className="flex overflow-hidden scale-90 sm:scale-100 origin-bottom bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl shadow-2xl border border-white/10 p-1"
                  >
                    <Button
                      type="button"
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={cn(
                        'p-2 hover:bg-white/10 rounded-lg transition-colors',
                        editor.isActive('bold') && 'text-primary',
                      )}
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className={cn(
                        'p-2 hover:bg-white/10 rounded-lg transition-colors',
                        editor.isActive('italic') && 'text-primary',
                      )}
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => editor.chain().focus().toggleStrike().run()}
                      className={cn(
                        'p-2 hover:bg-white/10 rounded-lg transition-colors',
                        editor.isActive('strike') && 'text-primary',
                      )}
                    >
                      <Strikethrough className="w-4 h-4" />
                    </Button>
                  </BubbleMenu>
                )}
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>,
          document.body,
        )
      ) : (
        <div className="flex-1 min-h-0 relative group transition-all duration-700 w-full border-none rounded-none flex flex-col">
          <div className="flex flex-col h-full w-full bg-transparent">
            <Toolbar editor={editor} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />

            <div
              className="flex-1 overflow-y-auto custom-scrollbar relative selection:bg-primary/20 p-0"
              style={{ maxHeight: isFullScreen ? 'none' : maxHeight, minHeight: isFullScreen ? '100%' : 'auto' }}
            >
              {editor && (
                <BubbleMenu
                  editor={editor}
                  className="flex overflow-hidden scale-90 sm:scale-100 origin-bottom bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl shadow-2xl border border-white/10 p-1"
                >
                  <Button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                      'p-2 hover:bg-white/10 rounded-lg transition-colors',
                      editor.isActive('bold') && 'text-primary',
                    )}
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                      'p-2 hover:bg-white/10 rounded-lg transition-colors',
                      editor.isActive('italic') && 'text-primary',
                    )}
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(
                      'p-2 hover:bg-white/10 rounded-lg transition-colors',
                      editor.isActive('strike') && 'text-primary',
                    )}
                  >
                    <Strikethrough className="w-4 h-4" />
                  </Button>
                </BubbleMenu>
              )}
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
