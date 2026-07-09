import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, Select, FormGroup, Label, FormError } from '../../ui';

interface TriggerFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const TriggerForm: React.FC<TriggerFormProps> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormGroup>
        <Label>{t('sidebar.trigger.contentType')}</Label>
        <Input {...register('contentType')} placeholder={t('sidebar.trigger.contentTypePlaceholder')} />
        {errors.contentType && (
          <FormError>
            {t(errors.contentType.message as string)}
          </FormError>
        )}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.trigger.eventAction')}</Label>
        <Select {...register('action')}>
          <option value="">{t('sidebar.trigger.anyEvent')}</option>
          <option value="publish">{t('sidebar.trigger.publish')}</option>
          <option value="unpublish">{t('sidebar.trigger.unpublish')}</option>
          <option value="save">{t('sidebar.trigger.saveCreate')}</option>
          <option value="archive">{t('sidebar.trigger.archive')}</option>
        </Select>
        {errors.action && (
          <FormError>
            {t(errors.action.message as string)}
          </FormError>
        )}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.trigger.targetField')}</Label>
        <Input {...register('triggerField')} placeholder={t('sidebar.trigger.targetFieldPlaceholder')} />
        {errors.triggerField && (
          <FormError>
            {t(errors.triggerField.message as string)}
          </FormError>
        )}
      </FormGroup>
    </>
  );
};
