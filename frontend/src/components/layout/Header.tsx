import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@contentful/f36-components';
import {
  PlusIcon,
  TrashSimpleIcon,
  MonitorPlayIcon,
  CheckIcon,
} from '@contentful/f36-icons';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useUIStore } from '../../store/useUIStore';
import { useWorkflowsQuery } from '../../queries/useWorkflowsQuery';
import { useSaveWorkflowMutation } from '../../mutations/useSaveWorkflowMutation';
import { useDeleteWorkflowMutation } from '../../mutations/useDeleteWorkflowMutation';
import { useTriggerWebhookMutation } from '../../mutations/useTriggerWebhookMutation';
import { useContentful } from '../../context/ContentfulContext';
import {
  HeaderContainer,
  Branding,
  AppTitle,
  AppDivider,
  ActionDivider,
  Actions,
  StyledInput,
  StyledButton,
  ToastWrapper,
  LangSelect,
  WorkflowSelect,
  StyledModalContent,
  StyledModalParagraph,
  StyledModalControls
} from './Header.styles';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const workflowId = useWorkflowStore((state) => state.workflowId);
  const workflowName = useWorkflowStore((state) => state.workflowName);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setWorkflowName = useWorkflowStore((state) => state.setWorkflowName);
  const clearCanvas = useWorkflowStore((state) => state.clearCanvas);
  const loadWorkflow = useWorkflowStore((state) => state.loadWorkflow);
  
  const toast = useUIStore((state) => state.toast);
  const showToast = useUIStore((state) => state.showToast);

  const { sdk, isInContentful } = useContentful();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: workflows = [] } = useWorkflowsQuery();
  const saveMutation = useSaveWorkflowMutation();
  const deleteMutation = useDeleteWorkflowMutation();
  const testMutation = useTriggerWebhookMutation();

  const isPending =
    saveMutation.isPending || deleteMutation.isPending || testMutation.isPending;

  const notify = (text: string, isError = false) => {
    if (isInContentful && sdk) {
      if (isError) {
        sdk.notifier.error(text);
      } else {
        sdk.notifier.success(text);
      }
    } else {
      showToast(text, isError);
    }
  };

  const handleDeploy = () => {
    if (nodes.length === 0) {
      notify(t('header.errorEmpty'), true);
      return;
    }
    if (!nodes.some((n) => n.data.type === 'Trigger')) {
      notify(t('header.errorNoTrigger'), true);
      return;
    }
    saveMutation.mutate(
      {
        id: workflowId,
        name: workflowName,
        nodes: nodes.map((n) => ({
          id: n.id,
          type: n.type || 'ActionNode',
          position: n.position,
          data: n.data,
        })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      },
      {
        onSuccess: () => notify(t('header.deploySuccess')),
        onError: (error: Error) => notify(error.message || 'Deployment failed.', true),
      },
    );
  };

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    deleteMutation.mutate(workflowId, {
      onSuccess: () => {
        notify(t('header.deleteSuccess'));
        clearCanvas();
      },
      onError: (error: Error) => notify(error.message || 'Deletion failed.', true),
    });
  };

  const handleTest = () => {
    const entryId =
      isInContentful && sdk
        ? (sdk as import('@contentful/app-sdk').EditorAppSDK).ids?.entry ?? null
        : null;

    const testPayload = entryId
      ? {
          sys: { type: 'Entry', id: entryId },
          fields: { title: 'Hello from native Contentful App Testing!' },
        }
      : {
          sys: { type: 'Entry', id: `mock-entry-id-${Math.floor(Math.random() * 1000)}` },
          fields: { title: 'Hello from ContentFlow Testing!' },
        };

    testMutation.mutate(testPayload, {
      onSuccess: () => notify(t('header.webhookTriggered')),
      onError: (error: Error) => notify(error.message || 'Test trigger failed.', true),
    });
  };

  const isSavedWorkflow = workflows.some((w) => w.id === workflowId);
  const deployLabel = saveMutation.isPending ? t('header.deploying') : t('header.deploy');

  return (
    <>
      <HeaderContainer>
        <Branding>
          <AppTitle>{t('header.title')}</AppTitle>
          <AppDivider />
          <StyledInput
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder={t('header.namePlaceholder')}
            aria-label={t('header.aria.workflowName')}
          />
        </Branding>

       
        <Actions>
          {/* Group 1: Selectors */}
          <LangSelect
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label={t('header.aria.selectLanguage')}
          >
            <option value="en">{t('header.languages.en')}</option>
            <option value="de">{t('header.languages.de')}</option>
            <option value="fr">{t('header.languages.fr')}</option>
          </LangSelect>

          <WorkflowSelect
            value={isSavedWorkflow ? workflowId : ''}
            onChange={(e) => {
              const selected = workflows.find((w) => w.id === e.target.value);
              if (selected) loadWorkflow(selected);
            }}
            aria-label={t('header.aria.loadWorkflow')}
          >
            <option value="" disabled>
              {t('header.loadWorkflow')}
            </option>
            {workflows.length === 0 ? (
              <option value="" disabled>
                {t('header.noWorkflows')}
              </option>
            ) : (
              workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))
            )}
          </WorkflowSelect>

          <ActionDivider />

          {/* Group 2: Canvas management */}
          <StyledButton
            variant="secondary"
            onClick={clearCanvas}
            disabled={isPending}
            title={t('header.new')}
            aria-label={t('header.new')}
          >
            <PlusIcon />
            <span className="btn-label">{t('header.new')}</span>
          </StyledButton>

          {isSavedWorkflow && (
            <StyledButton
              variant="danger"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isPending}
              title={t('header.delete')}
              aria-label={t('header.delete')}
            >
              <TrashSimpleIcon />
              <span className="btn-label">{t('header.delete')}</span>
            </StyledButton>
          )}

          <ActionDivider />

          {/* Group 3: Execution */}
          {(import.meta.env.DEV || import.meta.env.MODE === 'test') && (
            <StyledButton
              variant="secondary"
              onClick={handleTest}
              disabled={isPending}
              title={t('header.testTrigger')}
              aria-label={t('header.testTrigger')}
            >
              <MonitorPlayIcon />
              <span className="btn-label">{t('header.testTrigger')}</span>
            </StyledButton>
          )}

          <StyledButton
            variant="primary"
            onClick={handleDeploy}
            disabled={isPending}
            title={deployLabel}
            aria-label={deployLabel}
          >
            <CheckIcon />
            <span className="btn-label">{deployLabel}</span>
          </StyledButton>
        </Actions>
      </HeaderContainer>

      {/* Toast — outside Contentful only */}
      {!isInContentful && toast && (
        <ToastWrapper
          isError={toast.isError}
          role="status"
          aria-live={toast.isError ? 'assertive' : 'polite'}
        >
          {toast.text}
        </ToastWrapper>
      )}

      {/* Delete confirmation */}
      <Modal isShown={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        {() => (
          <>
            <Modal.Header
              title={t('header.deleteTitle')}
              onClose={() => setIsConfirmOpen(false)}
            />
            <StyledModalContent>
              <StyledModalParagraph>
                {t('header.deleteConfirm', { name: workflowName })}
              </StyledModalParagraph>
            </StyledModalContent>
            <StyledModalControls>
              <StyledButton
                variant="danger"
                onClick={handleConfirmDelete}
                aria-label={t('header.delete')}
                title={t('header.delete')}
              >
                <span className="btn-label">{t('header.delete')}</span>
              </StyledButton>
              <StyledButton
                variant="secondary"
                onClick={() => setIsConfirmOpen(false)}
                aria-label={t('header.cancel')}
                title={t('header.cancel')}
              >
                <span className="btn-label">{t('header.cancel')}</span>
              </StyledButton>
            </StyledModalControls>
          </>
        )}
      </Modal>
    </>
  );
};
