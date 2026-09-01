'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { RoleModalProps } from '@/types/role'
import { Loader2, ShieldCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, role, isLoading = false }) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (role) {
      setTimeout(() => {
        setName(role.name)
        setDescription(role.description)
      }, 100)
    } else {
      setTimeout(() => {
        setName('')
        setDescription('')
      }, 100)
    }
  }, [role, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      description,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-hidden flex flex-col border-none shadow-2xl rounded-border-radius!">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl font-medium text-title-color dark:text-white">
              {role ? t('edit_role') : t('add_role')}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="name" className="text-sm  mb-2 text-foreground">
                  {t('name')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enter_role_name')}
                  required
                  className="h-10 rounded-[8px] border-input-border-color focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2 flex flex-col">
                <Label htmlFor="description" className="text-sm  mb-2 text-foreground">
                  {t('description')}
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('enter_role_description')}
                  className="h-10 rounded-[8px]  border-input-border-color "
                />
              </div>
            </div>
          </div>

          <DialogFooter className="  gap-3 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className=" w-full mr-[7px] rtl:mr-0 rtl:ml-[7px] h-12 p-button-padding! bg-light-gray! border-light-border-color dark:border-none transition-all font-medium"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className=" w-full h-12 p-button-padding! border border-light-border-color! bg-primary! text-white transition-all font-medium dark:border-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}...
                </>
              ) : role ? (
                t('update')
              ) : (
                t('save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RoleModal
