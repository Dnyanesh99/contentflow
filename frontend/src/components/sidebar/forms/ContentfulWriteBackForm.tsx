import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, FormGroup, Label, FormError } from '../../ui';

interface ContentfulWriteBackFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const ContentfulWriteBackForm: React.FC<ContentfulWriteBackFormProps> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormGroup>
        <Label>{t('sidebar.writeback.entryId')}</Label>
        <Input {...register('entryId')} placeholder={t('sidebar.writeback.entryIdPlaceholder')} />
        {errors.entryId && (
          <FormError>
            {t(errors.entryId.message as string)}
          </FormError>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>{t('sidebar.writeback.field')}</Label>
        <Input {...register('field')} placeholder={t('sidebar.writeback.fieldPlaceholder')} />
        {errors.field && (
          <FormError>
            {t(errors.field.message as string)}
          </FormError>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>{t('sidebar.writeback.locale')}</Label>
        <Input {...register('locale')} placeholder={t('sidebar.writeback.localePlaceholder')} />
        {errors.locale && (
          <FormError>
            {t(errors.locale.message as string)}
          </FormError>
        )}
      </FormGroup>
      
      <FormGroup>
        <Label>{t('sidebar.writeback.value')}</Label>
        <Input {...register('value')} placeholder={t('sidebar.writeback.valuePlaceholder')} />
        {errors.value && (
          <FormError>
            {t(errors.value.message as string)}
          </FormError>
        )}
      </FormGroup>
    </>
  );
};
