import * as yup from 'yup'
import { TFunction } from 'i18next'

export const authSchemas = {
  login: (t: TFunction) =>
    yup
      .object({
        email: yup.string().email(t('invalid_email')).required(t('email_required')),
        password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
      })
      .required(),

  register: (t: TFunction) =>
    yup
      .object({
        name: yup.string().required(t('name_required')),
        email: yup.string().email(t('invalid_email')).required(t('email_required')),
        password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], t('passwords_must_match'))
          .required(t('confirm_password_required')),
      })
      .required(),

  forgotPassword: (t: TFunction) =>
    yup
      .object({
        email: yup.string().email(t('invalid_email')).required(t('email_required')),
      })
      .required(),

  verifyOtp: (t: TFunction) =>
    yup
      .object({
        otp: yup.string().required(t('otp_required')).length(6, t('otp_length_6')),
      })
      .required(),

  resetPassword: (t: TFunction) =>
    yup
      .object({
        password: yup.string().min(6, t('password_too_short')).required(t('password_required')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], t('passwords_must_match'))
          .required(t('confirm_password_required')),
      })
      .required(),
}

export const faqSchemas = {
  create: (t: TFunction) =>
    yup.object({
      title: yup.string().required(t('title_required')),
      description: yup.string().required(t('description_required')),
      status: yup.boolean(),
    }),
}
export const pageSchemas = {
  create: (t: TFunction) =>
    yup.object({
      title: yup.string().required(t('title_required')),
      slug: yup.string().required(t('slug_required')),
      content: yup.string().nullable(),
      meta_title: yup.string().nullable(),
      meta_description: yup.string().nullable(),
      status: yup.boolean(),
    }),
}

export const userSchemas = {
  create: (t: TFunction) =>
    yup.object({
      name: yup.string().required(t('name_required')),
      email: yup.string().email(t('invalid_email')).required(t('email_required')),
      password: yup.string().when('isEditing', {
        is: (isEditing: boolean) => !isEditing,
        then: (schema) => schema.min(6, t('password_too_short')).required(t('password_required')),
        otherwise: (schema) => schema.min(6, t('password_too_short')).optional(),
      }),
      confirmPassword: yup.string().when('isEditing', {
        is: (isEditing: boolean) => !isEditing,
        then: (schema) =>
          schema.oneOf([yup.ref('password')], t('passwords_must_match')).required(t('confirm_password_required')),
        otherwise: (schema) => schema.optional(),
      }),
      roleId: yup.string().required(t('role_required')),
      isActive: yup.boolean(),
      tags: yup.array().of(yup.string()).optional(),
    }),
}

export const contactSchemas = {
  create: (t: TFunction, type?: 'email' | 'whatsapp') =>
    yup.object({
      name: yup
        .string()
        .min(2, t('name_too_short', { defaultValue: 'Name must be at least 2 characters' }))
        .required(t('name_required')),
      email: yup
        .string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('invalid_email'))
        .when([], {
          is: () => type === 'whatsapp',
          then: (schema) => schema.optional(),
          otherwise: (schema) => schema.required(t('email_required')),
        }),
      phone: yup
        .string()
        .matches(/^[0-9]+$/, {
          message: t('invalid_phone', { defaultValue: 'Phone must contain only digits' }),
          excludeEmptyString: true,
        })
        .when([], {
          is: () => type === 'whatsapp',
          then: (schema) =>
            schema
              .min(7, t('phone_too_short', { defaultValue: 'Phone is too short' }))
              .required(t('phone_required', { defaultValue: 'Phone number is required' })),
          otherwise: (schema) => schema.optional(),
        }),
      tags: yup.array().of(yup.string()).optional(),
    }),
}

export const contactGroupSchemas = {
  create: (t: TFunction) =>
    yup.object({
      name: yup.string().required(t('name_required')),
      description: yup.string().required(t('description_required')),
      type: yup
        .string()
        .oneOf(['email', 'whatsapp'])
        .required(t('type_required', { defaultValue: 'Type is required' })),
      contactIds: yup.array().of(yup.string()).optional(),
    }),
}

export const segmentSchemas = {
  create: (t: TFunction) =>
    yup.object({
      name: yup.string().required(t('name_required')),
      description: yup.string().required(t('description_required')),
      conditions: yup.array().optional(),
    }),
}

export const emailConfigSchemas = {
  update: (t: TFunction) =>
    yup.object().shape({
      emailProvider: yup.string().required(t('email_provider_required')),
      fromName: yup.string().required(t('from_name_required')),
      fromEmail: yup
        .string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('invalid_email'))
        .required(t('from_email_required')),
      config: yup
        .object()
        .when('emailProvider', {
          is: (emailProvider: string) => emailProvider === 'nodemailer',
          then: (schema) =>
            schema.shape({
              smtp_host: yup.string().required(t('smtp_host_required')),
              smtp_port: yup.number().typeError(t('must_be_number')).required(t('smtp_port_required')),
              smtp_user: yup.string().required(t('smtp_user_required')),
              smtp_pass: yup.string().required(t('smtp_pass_required')),
              mail_encryption: yup.string().required(t('encryption_required')),
            }),
          otherwise: (schema) => schema,
        })
        .when('emailProvider', {
          is: (emailProvider: string) => emailProvider === 'sendgrid',
          then: (schema) =>
            schema.shape({
              sendgrid_api_key: yup.string().required(t('sendgrid_api_key_required')),
            }),
          otherwise: (schema) => schema,
        }),
    }),
}

export * from './campaign'
export const profileSchemas = {
  update: (t: TFunction) =>
    yup.object({
      name: yup.string().required(t('name_required')),
      email: yup.string().email(t('invalid_email')).required(t('email_required')),
    }),
  changePassword: (t: TFunction) =>
    yup.object({
      oldPassword: yup.string().required(t('old_password_required', { defaultValue: 'Old password is required' })),
      newPassword: yup
        .string()
        .min(6, t('password_too_short'))
        .required(t('new_password_required', { defaultValue: 'New password is required' })),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], t('passwords_must_match'))
        .required(t('confirm_password_required')),
    }),
}

export const adminSettingSchemas = {
  general: (t: TFunction) =>
    yup.object({
      app_name: yup.string().required(t('app_name_required')),
      app_email: yup.string().email(t('invalid_email')).required(t('app_email_required')),
      support_email: yup.string().email(t('invalid_email')).required(t('support_email_required')),
      landing_page_enabled: yup.boolean().optional(),
      document_file_limit: yup
        .number()
        .min(1)
        .max(50, t('cannot_exceed_50_mb', { defaultValue: "can't exceed more than 50 mb" }))
        .required(),
      audio_file_limit: yup
        .number()
        .min(1)
        .max(50, t('cannot_exceed_50_mb', { defaultValue: "can't exceed more than 50 mb" }))
        .required(),
      video_file_limit: yup
        .number()
        .min(1)
        .max(50, t('cannot_exceed_50_mb', { defaultValue: "can't exceed more than 50 mb" }))
        .required(),
      image_file_limit: yup
        .number()
        .min(1)
        .max(50, t('cannot_exceed_50_mb', { defaultValue: "can't exceed more than 50 mb" }))
        .required(),
      smtp_host: yup.string().nullable().optional(),
      smtp_port: yup.number().typeError(t('must_be_number')).min(1).max(65535).nullable().optional(),
      smtp_user: yup.string().nullable().optional(),
      smtp_pass: yup.string().nullable().optional(),
      mail_from_name: yup.string().nullable().optional(),
      mail_from_email: yup
        .string()
        .email(t('invalid_email', { defaultValue: 'Invalid email' }))
        .nullable()
        .optional(),
      mail_encryption: yup.string().oneOf(['ssl', 'tls']).nullable().optional(),
      otp_message: yup.string().nullable().optional(),
      multiple_file_share_limit: yup.number().min(1).max(10).required(),
      maximum_message_length: yup.number().min(1).max(40000).required(),
      session_expiration_days: yup.number().min(1).max(30).required(),
      session_limit: yup.number().min(1).max(10).required(),
      demo_user_email: yup.string().email(t('invalid_email')).nullable().optional(),
      demo_user_password: yup.string().nullable().optional(),
    }),
  credits: (t: TFunction) =>
    yup.object({
      free_credits: yup.number().min(0).required(),
      article_generate_credit: yup.number().min(0).required(),
      publish_post_per_day_limit: yup.number().min(0).required(),
      campaign_per_day_limit: yup.number().min(0).required(),
      code_generate_credit: yup.number().min(0).required(),
      analyze_content_credit: yup.number().min(0).required(),
      speech_text_credit: yup.number().min(0).required(),
      chatbot_creation_limit: yup.number().min(0).required(),
      file_chat_credit: yup.number().min(0).required(),
      generate_email_credit: yup.number().min(0).required(),
    }),
}
