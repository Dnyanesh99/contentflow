import React from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { NodeIcon } from './NodeIcon';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useUIStore } from '../../store/useUIStore';
import { v4 as uuidv4 } from 'uuid';
import type { NodeData } from '../../types/workflow';


const PanelContainer = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 180px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    width: 140px;
  }
`;

const PanelTitle = styled.h3`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  margin: 0 0 ${theme.spacing.xs} 0;
  letter-spacing: 0.5px;
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.xs};
`;

const PaletteItem = styled.button<{ color: string }>`
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  transition: all 0.2s;
  color: ${(props) => props.color};
  width: 100%;

  &:hover:not(:disabled) {
    background-color: ${theme.colors.surfaceHover};
    border-color: ${(props) => props.color};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: ${theme.colors.textMuted};
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: ${theme.spacing.xs};
    gap: ${theme.spacing.xs};
  }
`;

// ─── Node Definitions ─────────────────────────────────────────────────────────

interface NodeDefinition {
  type: string;
  labelKey: string;
  color: string;
  defaultData: Partial<NodeData>;
}

const NODE_DEFINITIONS: NodeDefinition[] = [
  {
    type: 'Trigger',
    labelKey: 'palette.trigger',
    color: theme.colors.contentful,
    defaultData: {},
  },
  {
    type: 'Slack.Notify',
    labelKey: 'palette.slack',
    color: theme.colors.slack,
    defaultData: {
      webhookUrl: '',
      messageTemplate: 'New entry published in Contentful: {{fields.title}}',
    } as Partial<NodeData>,
  },
  {
    type: 'LLM.Prompt',
    labelKey: 'palette.llm',
    color: theme.colors.openai,
    defaultData: {
      provider: 'openai',
      model: 'gpt-4o',
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Translate this to Spanish: {{fields.title}}',
      baseUrl: '',
    } as Partial<NodeData>,
  },
  {
    type: 'Contentful.WriteBack',
    labelKey: 'palette.writeback',
    color: theme.colors.contentful,
    defaultData: {
      entryId: '{{sys.id}}',
      field: 'title',
      locale: 'es-ES',
      value: '{{LLM.Prompt.text}}',
    } as Partial<NodeData>,
  },
  {
    type: 'Custom.Code',
    labelKey: 'palette.customCode',
    color: theme.colors.warning,
    defaultData: {
      code: 'function transform(input) {\n  return input;\n}',
    } as Partial<NodeData>,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const NodePalette: React.FC = () => {
  const { t } = useTranslation();
  const nodes = useWorkflowStore((state) => state.nodes);
  const addNode = useWorkflowStore((state) => state.addNode);
  const showToast = useUIStore((state) => state.showToast);
  const getNextPosition = useWorkflowStore((state) => state.getNextPosition);

  const hasTrigger = nodes.some((n) => n.data.type === 'Trigger');

  const handleAddNode = (def: NodeDefinition, label: string) => {
    if (def.type === 'Trigger' && hasTrigger) {
      showToast(t('palette.errorOnlyOneTrigger'), true);
      return;
    }

    addNode({
      id: uuidv4(),
      type: 'ActionNode',
      position: getNextPosition(),
      data: { label, type: def.type, ...def.defaultData } as NodeData,
    });
  };

  return (
    <PanelContainer>
      <PanelTitle>{t('palette.title')}</PanelTitle>
      {NODE_DEFINITIONS.map((def) => {
        const label = t(def.labelKey);
        const isDisabled = def.type === 'Trigger' && hasTrigger;
        return (
          <PaletteItem
            key={def.type}
            color={def.color}
            onClick={() => handleAddNode(def, label)}
            disabled={isDisabled}
            title={isDisabled ? t('palette.errorOnlyOneTrigger') : label}
            aria-label={`Add ${label} node`}
          >
            <NodeIcon type={def.type} />
            {label}
          </PaletteItem>
        );
      })}
    </PanelContainer>
  );
};
