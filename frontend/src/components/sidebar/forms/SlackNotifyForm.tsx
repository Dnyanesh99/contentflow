import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, FormGroup, Label, FormError } from '../../ui';

interface SlackNotifyFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const SlackNotifyForm: React.FC<SlackNotifyFormProps> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormGroup>
        <Label>{t('sidebar.slack.webhookUrl')}</Label>
        <Input {...register('webhookUrl')} placeholder={t('sidebar.slack.webhookPlaceholder')} />
        {errors.webhookUrl && (
          <FormError>
            {t(errors.webhookUrl.message as string)}
          </FormError>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>{t('sidebar.slack.messageTemplate')}</Label>
        <Input {...register('messageTemplate')} placeholder={t('sidebar.slack.messagePlaceholder')} />
        {errors.messageTemplate && (
          <FormError>
            {t(errors.messageTemplate.message as string)}
          </FormError>
        )}
      </FormGroup>
    </>
  );
};
