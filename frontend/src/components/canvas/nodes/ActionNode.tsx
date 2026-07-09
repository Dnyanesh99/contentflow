import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import styled from '@emotion/styled';
import type { NodeData } from '../../../types/workflow';
import { theme } from '../../../styles/theme';
import { useWorkflowStore } from '../../../store/useWorkflowStore';
import { useUIStore } from '../../../store/useUIStore';
import { useTranslation } from 'react-i18next';
import { NodeIcon } from '../NodeIcon';


const TargetHandle = styled(Handle)`
  background: ${theme.colors.border} !important;
  width: 8px !important;
  height: 8px !important;
`;

const SourceHandle = styled(Handle)`
  background: ${theme.colors.primary} !important;
  width: 8px !important;
  height: 8px !important;
`;

const NodeIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NodeContainer = styled.div<{ selected: boolean; nodeType: string; execStatus?: string }>`
  background: rgba(17, 24, 39, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
  min-width: 220px;
  box-shadow: ${(props) => {
    if (props.execStatus === 'Success') return '0 0 20px rgba(52, 211, 153, 0.6)';
    if (props.execStatus === 'Failed') return '0 0 20px rgba(248, 113, 113, 0.6)';
    return props.selected ? theme.shadows.glowPrimary : theme.shadows.lg;
  }};
  border: 1px solid ${(props) => {
    if (props.execStatus === 'Success') return theme.colors.success;
    if (props.execStatus === 'Failed') return theme.colors.danger;
    if (props.selected) return theme.colors.primary;
    if (props.nodeType === 'Trigger') return theme.colors.contentful;
    if (props.nodeType === 'Slack.Notify') return theme.colors.slack;
    if (props.nodeType === 'LLM.Prompt') return theme.colors.openai;
    if (props.nodeType === 'Contentful.WriteBack') return theme.colors.contentful;
    if (props.nodeType === 'Custom.Code') return theme.colors.warning;
    return 'rgba(255, 255, 255, 0.15)';
  }};
  transition: ${theme.animation.spring};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) => {
      if (props.execStatus === 'Success') return '0 0 25px rgba(52, 211, 153, 0.8)';
      if (props.execStatus === 'Failed') return '0 0 25px rgba(248, 113, 113, 0.8)';
      return `0 16px 32px rgba(0, 0, 0, 0.4), ${props.selected ? theme.shadows.glowPrimary : '0 0 20px rgba(255,255,255,0.05)'}`;
    }};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => {
      let color = theme.colors.primary;
      if (props.nodeType === 'Trigger') color = theme.colors.contentful;
      if (props.nodeType === 'Slack.Notify') color = theme.colors.slack;
      if (props.nodeType === 'LLM.Prompt') color = theme.colors.openai;
      if (props.nodeType === 'Contentful.WriteBack') color = theme.colors.contentful;
      if (props.nodeType === 'Custom.Code') color = theme.colors.warning;
      return `linear-gradient(90deg, transparent, ${color} 50%, transparent)`;
    }};
  }
`;

const NodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${theme.colors.textMuted};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.xs};
  margin-top: ${theme.spacing.xs};
`;

const NodeBody = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const SubText = styled.div`
  font-size: 10px;
  color: ${theme.colors.textMuted};
  font-family: monospace;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 4px;
  /* Ensure minimum 44x44px touch target */
  min-width: 28px;
  min-height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: ${theme.colors.danger};
    background-color: rgba(239, 68, 68, 0.1);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;


function getSubtext(data: NodeData): string {
  if (data.type === 'Slack.Notify') return data.channelName || '#general';
  if (data.type === 'LLM.Prompt') return `Model: ${data.model || 'gpt-4o'}`;
  if (data.type === 'Contentful.WriteBack') return `Locale: ${data.locale || 'es-ES'}`;
  if (data.type === 'Trigger') return 'Contentful Webhook';
  if (data.type === 'Custom.Code') return 'JS Transformation';
  return '';
}

export const ActionNode = ({ id, data, selected }: NodeProps<NodeData>) => {
  const { t } = useTranslation();
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const nodeExecutionStatus = useUIStore((state) => state.nodeExecutionStatus);
  const execStatus = nodeExecutionStatus[id];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <NodeContainer selected={selected} nodeType={data.type} execStatus={execStatus}>
      {data.type !== 'Trigger' && (
        <TargetHandle type="target" position={Position.Top} />
      )}

      <NodeHeader>
        <NodeIconContainer>
          <NodeIcon type={data.type} />
          <span>{data.type}</span>
        </NodeIconContainer>
        <DeleteButton
          onClick={handleDelete}
          aria-label={t('canvas.deleteNodeAria', { label: data.label })}
          title={t('canvas.deleteNode')}
        >
          &times;
        </DeleteButton>
      </NodeHeader>

      <NodeBody>{data.label}</NodeBody>
      <SubText>{getSubtext(data)}</SubText>

      <SourceHandle type="source" position={Position.Bottom} />
    </NodeContainer>
  );
};
