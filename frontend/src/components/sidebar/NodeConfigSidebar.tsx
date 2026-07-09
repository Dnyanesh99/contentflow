import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Flex } from '@contentful/f36-components';
import { Button, Input, FormGroup, Label, FormError } from '../ui';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useUIStore } from '../../store/useUIStore';
import type { NodeData } from '../../types/workflow';
import { PopupContainer, StyledSidebarHeading, SaveButton } from './NodeConfigSidebar.styles';

import { TriggerForm } from './forms/TriggerForm';
import { SlackNotifyForm } from './forms/SlackNotifyForm';
import { AITaskForm } from './forms/AITaskForm';
import { ContentfulWriteBackForm } from './forms/ContentfulWriteBackForm';
import { CustomCodeForm } from './forms/CustomCodeForm';

import { getValidationSchema } from '../../schemas/nodeSchemas';

const HEADING_ID = 'node-config-dialog-title';

export const NodeConfigSidebar: React.FC = () => {
  const { t } = useTranslation();
  const nodes = useWorkflowStore((state) => state.nodes);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const setSelectedNodeId = useUIStore((state) => state.setSelectedNodeId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = !!selectedNode;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectedNodeId(null);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (dialog && e.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      
      if (!isInDialog) {
        handleClose();
      }
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: selectedNode
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? zodResolver(getValidationSchema(selectedNode.data.type) as any)
      : undefined,
    defaultValues: selectedNode?.data ?? { label: '', type: 'Trigger' },
  });

  useEffect(() => {
    if (selectedNode) {
      reset(selectedNode.data);
    }
  }, [selectedNode, reset]);

  const onSubmit = (data: unknown) => {
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, data as Partial<NodeData>);
      handleClose();
    }
  };

  // We still render the dialog in DOM when closed so the ref is maintained,
  // but if there's no selected node, we don't render its contents.
  if (!selectedNode) {
    return <PopupContainer ref={dialogRef} />;
  }

  return (
    <PopupContainer
      ref={dialogRef}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby={HEADING_ID}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <StyledSidebarHeading id={HEADING_ID} level="h2">
          {selectedNode.data.type}
        </StyledSidebarHeading>
        <Button variant="secondary" type="button" onClick={handleClose}>
          {t('sidebar.close')}
        </Button>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label>{t('sidebar.nodeLabel')}</Label>
          <Input {...register('label')} placeholder={t('sidebar.nodeTitlePlaceholder')} />
          {errors.label && <FormError>{t(errors.label.message as string)}</FormError>}
        </FormGroup>

        {selectedNode.data.type === 'Trigger' && (
          <TriggerForm register={register} errors={errors} />
        )}

        {selectedNode.data.type === 'Slack.Notify' && (
          <SlackNotifyForm register={register} errors={errors} />
        )}

        {selectedNode.data.type === 'LLM.Prompt' && (
          <AITaskForm register={register} errors={errors} />
        )}

        {selectedNode.data.type === 'Contentful.WriteBack' && (
          <ContentfulWriteBackForm register={register} errors={errors} />
        )}

        {selectedNode.data.type === 'Custom.Code' && (
          <CustomCodeForm
            codeValue={(selectedNode.data as { code?: string }).code ?? ''}
            setValue={setValue}
          />
        )}

        <SaveButton variant="primary" type="submit">
          {t('sidebar.save')}
        </SaveButton>
      </form>
    </PopupContainer>
  );
};
