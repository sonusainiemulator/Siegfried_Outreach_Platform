'use client'

import PasskeyManager from '@/components/feature/profile/PasskeyManager'

import Spinner from '@/components/reusable/Spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import PasswordInput from '@/components/ui/PasswordInput'
import { ROUTES } from '@/constants/routes'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { useChangePasswordMutation, useGetProfileQuery, useUpdateProfileMutation } from '@/redux/api/authApi'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setAuth } from '@/redux/slices/authSlice'
import { ApiError } from '@/types'
import { authUtils, getMediaUrl } from '@/utils'
import { profileSchemas } from '@/utils/validation-schemas'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { ArrowLeft, Camera, Loader2, Lock, Mail, Save, User, X } from 'lucide-react'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const ProfilePage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { data, isLoading: isFetching } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()
  const { user: authUser, token } = useAppSelector((state) => state.auth)

  const user = data?.user || authUser

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setRemoveAvatar(false)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangePassword = async (values: any, { resetForm }: any) => {
    try {
      const response = await changePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap()
      resetForm()
      toast.success(
        response.message || t('password_changed_successfully', { defaultValue: 'Password changed successfully' }),
      )
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_change_password', { defaultValue: 'Failed to change password' }))
    }
  }

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      if (selectedFile) {
        formData.append('avatar', selectedFile)
      } else if (removeAvatar) {
        formData.append('remove_avatar', 'true')
      }

      const response = await updateProfile(formData).unwrap()

      // Update local storage and redux state to reflect changes immediately
      if (response.user) {
        authUtils.setUser(response.user)
        dispatch(setAuth({ user: response.user, token: token || authUtils.getToken() }))
      }

      setSelectedFile(null)
      setAvatarPreview(null)
      setRemoveAvatar(false)
      resetForm({ values })

      toast.success(response.message || t('profile_updated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_profile'))
    }
  }

  if (isFetching) {
    return <Spinner className="min-h-[60vh]" />
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-muted-foreground">{t('something_went_wrong')}</p>
        <Link href={ROUTES.DASHBOARD}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back_to_dashboard')}
          </Button>
        </Link>
      </div>
    )
  }

  const initialValues = {
    name: user.name || '',
    email: user.email || '',
  }

  const passwordInitialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={ROUTES.DASHBOARD}>
          <Button variant="ghost" className="rounded-xl h-9 w-11 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary dark:bg-primary/20 rounded-[8px] transition-all shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="space-y-1">
          <h2 className="text-3xl font-medium title-color">{t('edit_profile')}</h2>
          <p className="text-subtitle-color text-base">{t('manage_profile')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-glass-border glass-card glass-dark-card bg-glass-bg backdrop-blur-xl  rounded-border-radius overflow-hidden animate-in fade-in slide-in-from-left duration-500">
          <CardContent className="pt-10 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              {(() => {
                const displayAvatar = removeAvatar ? null : (avatarPreview || (user?.avatar && user.avatar !== 'null' ? getMediaUrl(user.avatar) : null))
                return (
                  <>
                    <div className="w-32 h-32 rounded-full  overflow-hidden relative transition-transform duration-500 group-hover:scale-105">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={displayAvatar || undefined} className="object-cover" />
                        <AvatarFallback className={cn('text-4xl font-bold', getAvatarColorClass(user.name))}>
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                        </Avatar>
                <div
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                value={''}
                onChange={handleFileChange}
              />
              <Button
                size="icon"
                variant="premium"
                className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 shadow-lg border-2 border-background"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              {displayAvatar && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-0 right-0 rounded-full h-8 w-8 shadow-lg border-2 border-background z-10 hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setRemoveAvatar(true)
                    setAvatarPreview(null)
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </>
          )
        })()}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 glass-card glass-dark-card border-glass-border bg-glass-bg backdrop-blur-xl rounded-border-radius animate-in fade-in slide-in-from-right duration-500">
          <CardHeader>
            <CardTitle>{t('profile_details', { defaultValue: 'Profile Details' })}</CardTitle>
            <CardDescription>
              {t('update_profile_info', { defaultValue: 'Update your personal information below.' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={initialValues}
              enableReinitialize={true}
              validationSchema={profileSchemas.update(t)}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2 group flex flex-col">
                      <Label htmlFor="name" className="text-xs font-medium  text-foreground">
                        {t('full_name')}
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 transition-colors" />
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          placeholder={t('enter_name')}
                          className={cn(
                            'pl-10 h-10 bg-accent/5 focus:bg-accent/10 border-transparent focus-visible:ring-primary/20 rounded-[8px] transition-all',
                            errors.name && touched.name && 'border-destructive/50 focus-visible:ring-destructive/20',
                          )}
                        />
                      </div>
                      <ErrorMessage name="name" component="div" className="text-destructive text-xs italic ml-1" />
                    </div>

                    <div className="space-y-2 group flex flex-col">
                      <Label htmlFor="email" className="text-xs font-medium text-foreground">
                        {t('email_address')}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 transition-colors" />
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder={t('email_placeholder')}
                          className={cn(
                            'pl-10 h-10 bg-accent/5 focus:bg-accent/10 border-transparent focus-visible:ring-primary/20 rounded-[8px] transition-all',
                            errors.email && touched.email && 'border-destructive/50 focus-visible:ring-destructive/20',
                          )}
                        />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-destructive text-xs italic ml-1" />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdating || (!dirty && !selectedFile && !removeAvatar)}
                      variant="premium"
                      className="w-full md:w-auto min-w-40 h-12 rounded-2xl shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[11px] group transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('updating')}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                          {t('update_profile')}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass-card glass-dark-card border-glass-border bg-glass-bg backdrop-blur-xl rounded-border-radius animate-in fade-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle>{t('security', { defaultValue: 'Security' })}</CardTitle>
            <CardDescription>
              {t('change_password_desc', { defaultValue: 'Update your password to keep your account secure.' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={passwordInitialValues}
              validationSchema={profileSchemas.changePassword(t)}
              onSubmit={handleChangePassword}
            >
              {({ errors, touched, dirty }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group flex flex-col">
                      <Label htmlFor="oldPassword" className="text-xs font-medium text-foreground">
                        {t('old_password')}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 z-10" />
                        <Field
                          as={PasswordInput}
                          id="oldPassword"
                          name="oldPassword"
                          placeholder={t('enter_old_password', { defaultValue: 'Enter old password' })}
                          className={cn(
                            'pl-10 rounded-[8px]',
                            errors.oldPassword && touched.oldPassword && 'border-destructive/50',
                          )}
                        />
                      </div>
                      <ErrorMessage
                        name="oldPassword"
                        component="div"
                        className="text-destructive text-xs italic ml-1"
                      />
                    </div>

                    <div className="space-y-2 group flex flex-col">
                      <Label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                        {t('new_password')}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 z-10" />
                        <Field
                          as={PasswordInput}
                          id="newPassword"
                          name="newPassword"
                          placeholder={t('enter_new_password', { defaultValue: 'Enter new password' })}
                          className={cn(
                            'pl-10 rounded-[8px]',
                            errors.newPassword && touched.newPassword && 'border-destructive/50',
                          )}
                        />
                      </div>
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-destructive text-xs italic ml-1"
                      />
                    </div>

                    <div className="space-y-2 group flex flex-col">
                      <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                        {t('confirm_new_password', { defaultValue: 'Confirm New Password' })}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 z-10" />
                        <Field
                          as={PasswordInput}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder={t('confirm_password_placeholder')}
                          className={cn(
                            'pl-10 rounded-[8px]',
                            errors.confirmPassword && touched.confirmPassword && 'border-destructive/50',
                          )}
                        />
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-destructive text-xs italic ml-1"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isChangingPassword || !dirty}
                      variant="premium"
                      className="w-full md:w-auto min-w-40 h-11 rounded-xl shadow-lg shadow-primary/20 font-bold uppercase tracking-widest text-[10px] active:scale-95 disabled:opacity-50"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t('changing')}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {t('change_password', { defaultValue: 'Change Password' })}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>

        <PasskeyManager />
      </div>
    </div>
  )
}

export default ProfilePage
