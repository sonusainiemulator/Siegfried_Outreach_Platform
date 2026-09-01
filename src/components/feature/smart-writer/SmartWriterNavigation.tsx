import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { count } from '@/data/dashboard'
import { cn } from '@/lib/utils'
import { SmartWriterNavigationProps, Template } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronDown, LayoutGrid, Search, Star as StarIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const SmartWriterNavigation: React.FC<SmartWriterNavigationProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  showTemplateTray,
  setShowTemplateTray,
  filteredTemplates,
  handleTemplateSelect,
  handleToggleFavorite,
  templatesLoading,
}) => {
  const { t } = useTranslation()
  const scrollCategoriesRef = useRef<HTMLDivElement>(null)
  const scrollTemplatesRef = useRef<HTMLDivElement>(null)

  const [scrollCategories, setScrollCategories] = React.useState({ left: false, right: false })
  const [scrollTemplates, setScrollTemplates] = React.useState({ left: false, right: false })

  const checkScroll = React.useCallback((ref: React.RefObject<HTMLDivElement | null>, setter: React.Dispatch<React.SetStateAction<{ left: boolean; right: boolean }>>) => {
    if (!ref.current) return
    const { scrollLeft, scrollWidth, clientWidth } = ref.current
    setter({
      left: scrollLeft > 1,
      right: Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1
    })
  }, [])

  React.useEffect(() => {
    checkScroll(scrollCategoriesRef, setScrollCategories)
    checkScroll(scrollTemplatesRef, setScrollTemplates)

    const timer = setTimeout(() => {
      checkScroll(scrollCategoriesRef, setScrollCategories)
      checkScroll(scrollTemplatesRef, setScrollTemplates)
    }, 500)

    return () => clearTimeout(timer)
  }, [categories, filteredTemplates, showTemplateTray, checkScroll])

  const scrollContainer = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8
      const target = ref.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      ref.current.scrollTo({ left: target, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full  z-[70] shrink-0">
      <div className="relative w-full group/dock">
        <div className="absolute -left-6 inset-y-0 flex items-center z-[80]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollContainer('left', scrollCategoriesRef)}
            className={cn(
              "w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-700 transition-all hover:scale-110",
              scrollCategories.left ? "opacity-0 group-hover/dock:opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute -right-6 inset-y-0 flex items-center z-[80]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollContainer('right', scrollCategoriesRef)}
            className={cn(
              "w-10 h-10 rounded-full bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-200 dark:border-zinc-700 transition-all hover:scale-110",
              scrollCategories.right ? "opacity-0 group-hover/dock:opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 p-2 inner-card glass-dark-card rounded-border-radius overflow-hidden">
          <div
            ref={scrollCategoriesRef}
            onScroll={() => checkScroll(scrollCategoriesRef, setScrollCategories)}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-2"
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="ghost"
                onClick={() => {
                  if (activeCategory === cat) {
                    setShowTemplateTray(!showTemplateTray)
                  } else {
                    setActiveCategory(cat)
                    setShowTemplateTray(true)
                  }
                }}
                className={cn(
                  'h-10 px-4 rounded-[8px] font-medium text-sm capitalize transition-all flex items-center gap-2 whitespace-nowrap',
                  activeCategory === cat
                    ? 'bg-primary text-white scale-[1.03] hover:bg-primary hover:text-white'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                )}
              >
                {cat === t('writer_all') && <LayoutGrid className="w-4 h-4" />}
                {cat === t('writer_favorites') && (
                  <StarIcon className={cn('w-4 h-4', activeCategory === cat ? 'fill-current' : 'fill-none')} />
                )}
                {cat}
                <ChevronDown
                  className={cn(
                    'w-4 h-4 opacity-50 transition-all',
                    showTemplateTray && activeCategory === cat ? 'rotate-180 text-white' : '',
                  )}
                />
              </Button>
            ))}
          </div>

          <div className="items-center relative min-w-[180px] hidden sm:flex ms-auto me-2">
            <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Find Module..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowTemplateTray(true)
              }}
              className="h-11 w-full bg-zinc-100/50 dark:bg-zinc-800/50 border-none rounded-[8px] text-xs font-medium capitalize  focus:ring-2 focus:ring-primary/20 outline-none ps-11 pe-4"
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTemplateTray && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.98 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.98 }}
            className="relative w-full sm:p-6 p-4 inner-card glass-dark-card rounded-border-radius overflow-hidden group/tray"
          >
            <div className="absolute left-0 inset-y-0 flex items-center z-[80]">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollContainer('left', scrollTemplatesRef)}
                className={cn(
                  "w-10 h-10 rounded-full bg-primary text-white shadow-xl transition-all hover:scale-110",
                  scrollTemplates.left ? "opacity-0 group-hover/tray:opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute right-0 inset-y-0 flex items-center z-[80]">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => scrollContainer('right', scrollTemplatesRef)}
                className={cn(
                  "w-10 h-10 rounded-full bg-primary text-white shadow-xl transition-all hover:scale-110",
                  scrollTemplates.right ? "opacity-0 group-hover/tray:opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <ArrowRight className="w-6 h-6" />
              </Button>
            </div>

            <div
              ref={scrollTemplatesRef}
              onScroll={() => checkScroll(scrollTemplatesRef, setScrollTemplates)}
              className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pt-1 mx-5"
            >
              {templatesLoading ? (
                <div className="flex gap-3">
                  {count.map((i) => (
                    <div key={i} className="w-56 h-24 rounded-[8px] glass-card glass-dark-crad  animate-pulse" />
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                filteredTemplates.map((template: Template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleTemplateSelect(template)
                      setShowTemplateTray(false)
                    }}
                    className="w-64 shrink-0 p-5 inner-card glass-dark-card rounded-[8px] cursor-pointer hover:bg-primary/5 transition-all border-2 border-transparent hover:border-primary! group/card relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium rounded-full px-2 border border-primary text-xs text-primary capitalize">
                        {template.category}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleToggleFavorite(e, template.id)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-all ',
                          template.isFavorite ? 'text-yellow-500 fill-current' : 'text-zinc-300',
                        )}
                      >
                        <StarIcon className={cn('w-4 h-4', template.isFavorite && 'fill-current')} />
                      </Button>
                    </div>
                    <h4 className="font-medium text-lg text-title-color dark:text-white capitalize tracking-tight line-clamp-1">
                      {template.title}
                    </h4>
                    <p className="text-sm font-medium text-subtitle-color line-clamp-1">
                      {template.description}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-8 text-center animate-in fade-in duration-500">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h4 className="font-semibold text-base text-title-color dark:text-white capitalize tracking-tight mb-1">
                    {t('no_results_found', { defaultValue: 'No Results Found' })}
                  </h4>
                  <p className="text-xs font-medium text-subtitle-color">
                    {searchQuery ? t('try_adjusting_search') : t('no_modules_in_category')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SmartWriterNavigation
