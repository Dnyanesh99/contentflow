import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label, Input, Textarea, Select, FormError } from '../../ui';

interface AITaskFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export const AITaskForm: React.FC<AITaskFormProps> = ({ register, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormGroup>
        <Label>{t('sidebar.ai.provider')}</Label>
        <Select {...register('provider')}>
          <option value="openai">{t('sidebar.ai.providers.openai')}</option>
          <option value="anthropic">{t('sidebar.ai.providers.anthropic')}</option>
          <option value="ollama">{t('sidebar.ai.providers.ollama')}</option>
        </Select>
        {errors.provider && <FormError>{t(errors.provider.message as string)}</FormError>}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.ai.model')}</Label>
        <Input {...register('model')} placeholder={t('sidebar.ai.modelPlaceholder')} />
        {errors.model && <FormError>{t(errors.model.message as string)}</FormError>}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.ai.systemPrompt')}</Label>
        <Textarea 
          {...register('systemPrompt')} 
          placeholder={t('sidebar.ai.systemPlaceholder')}
          rows={3}
        />
        {errors.systemPrompt && <FormError>{t(errors.systemPrompt.message as string)}</FormError>}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.ai.userPrompt')}</Label>
        <Textarea 
          {...register('userPrompt')} 
          placeholder={t('sidebar.ai.userPlaceholder')}
          rows={3}
        />
        {errors.userPrompt && <FormError>{t(errors.userPrompt.message as string)}</FormError>}
      </FormGroup>

      <FormGroup>
        <Label>{t('sidebar.ai.baseUrl')}</Label>
        <Input {...register('baseUrl')} placeholder={t('sidebar.ai.baseUrlPlaceholder')} />
        {errors.baseUrl && <FormError>{t(errors.baseUrl.message as string)}</FormError>}
      </FormGroup>
    </>
  );
};
