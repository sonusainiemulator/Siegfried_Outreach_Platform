import * as yup from 'yup'
import { TFunction } from 'i18next'

export const campaignSchemas = {
  create: (t: TFunction) =>
    yup.object().shape({
      name: yup.string().required(t('campaign_name_required')),
      subject: yup.string().required(t('campaign_subject_required')),
      contacts: yup.array(),
      segments: yup.array(),
      lists: yup.array(),
      htmlTemplate: yup.string().required(t('email_content_required')),
    }),
  update: (t: TFunction) =>
    yup.object().shape({
      name: yup.string().required(t('campaign_name_required')),
      subject: yup.string().required(t('campaign_subject_required')),
      contacts: yup.array(),
      segments: yup.array(),
      lists: yup.array(),
      htmlTemplate: yup.string().required(t('email_content_required')),
    }),
  whatsapp: (t: TFunction) =>
    yup.object().shape({
      name: yup.string().required(t('campaign_name_required')),
      content: yup.string().required(t('campaign_content_required')),
      contacts: yup.array().when(['segments', 'lists'], {
        is: (segments: string[], lists: string[]) => 
          (!segments || segments.length === 0) && (!lists || lists.length === 0),
        then: (schema) => schema.min(1, t('at_least_one_contact_or_group_required')),
        otherwise: (schema) => schema,
      }),
      segments: yup.array(),
      lists: yup.array(),
    }),
  telegram: (t: TFunction) =>
    yup.object().shape({
      name: yup.string().required(t('campaign_name_required')),
      content: yup.string().required(t('campaign_content_required')),
      contacts: yup.array().min(1, t('at_least_one_contact_required')),
    }),
}
