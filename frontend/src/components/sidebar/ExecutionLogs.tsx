import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Spinner, Flex } from '@contentful/f36-components';
import { useExecutionsQuery } from '../../queries/useExecutionsQuery';
import { useUIStore } from '../../store/useUIStore';
import { getRelativeTime, getExecutionDuration } from '../../utils/dateUtils';
import type { Execution, ExecutionLogStep } from '../../types/workflow';

import {
  LogsFloatingPanel,
  ToggleButton,
  PanelHeader,
  CloseButton,
  FiltersContainer,
  FilterButton,
  ScrollableList,
  LogCard,
  LogHeader,
  LogId,
  StepsContainer,
  StepItem,
  StepHeader,
  StepDetail,
  StyledSidebarHeading,
  LoadingContainer,
  ErrorText,
  EmptyText,
  LogTitle,
  CorrelationId,
  StepsCountTitle,
  NoStepsText,
  StepNodeLabel,
  ErrorDetail
} from './ExecutionLogs.styles';



export const ExecutionLogs: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: executions = [], isLoading, isError } = useExecutionsQuery(isOpen);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED'>('ALL');
  const setNodeExecutionStatus = useUIStore(state => state.setNodeExecutionStatus);

  const handleCardClick = (exec: Execution) => {
    const isExpanding = expandedId !== exec.id;
    setExpandedId(isExpanding ? exec.id : null);
    
    if (isExpanding) {
      let steps: ExecutionLogStep[] = [];
      if (exec.logs) {
        try {
          steps = typeof exec.logs === 'string' ? JSON.parse(exec.logs) : exec.logs;
        } catch {}
      }
      const statusMap: Record<string, 'Success' | 'Failed' | 'Pending'> = {};
      steps.forEach(s => {
        if (s.nodeId) statusMap[s.nodeId] = s.status;
      });
      setNodeExecutionStatus(statusMap);
    } else {
      setNodeExecutionStatus({});
      setExpandedId(null);
    }
  };

  const getBadgeVariant = (status: string) => {
    if (status === 'SUCCESS') return 'positive';
    if (status === 'FAILED') return 'negative';
    return 'warning';
  };

  if (isLoading) {
    return (
      <>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? t('logs.closeLogs') : `📜 ${t('logs.showLogs')}`}
        </ToggleButton>
        <LogsFloatingPanel isOpen={isOpen}>
          <PanelHeader>
            <StyledSidebarHeading level="h2">
              {t('logs.title')}
            </StyledSidebarHeading>
            <CloseButton onClick={() => setIsOpen(false)} aria-label={t('logs.aria.close')}>&times;</CloseButton>
          </PanelHeader>
          <LoadingContainer>
            <Spinner size="medium" />
          </LoadingContainer>
        </LogsFloatingPanel>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <ToggleButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? t('logs.closeLogs') : `📜 ${t('logs.showLogs')}`}
        </ToggleButton>
        <LogsFloatingPanel isOpen={isOpen}>
          <PanelHeader>
            <StyledSidebarHeading level="h2">
              {t('logs.title')}
            </StyledSidebarHeading>
            <CloseButton onClick={() => setIsOpen(false)} aria-label={t('logs.aria.close')}>&times;</CloseButton>
          </PanelHeader>
          <ErrorText>
            {t('logs.error')}
          </ErrorText>
        </LogsFloatingPanel>
      </>
    );
  }

  return (
    <>
      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? t('logs.closeLogs') : `📜 ${t('logs.showLogs')}`}
      </ToggleButton>
      
      <LogsFloatingPanel isOpen={isOpen}>
        <PanelHeader>
          <StyledSidebarHeading level="h2">
            {t('logs.title')}
          </StyledSidebarHeading>
          <CloseButton onClick={() => setIsOpen(false)} aria-label={t('logs.aria.close')}>&times;</CloseButton>
        </PanelHeader>
        {executions.length > 0 && (
          <FiltersContainer>
            <FilterButton active={filter === 'ALL'} onClick={() => setFilter('ALL')}>{t('logs.filterAll')}</FilterButton>
            <FilterButton active={filter === 'SUCCESS'} onClick={() => setFilter('SUCCESS')}>{t('logs.filterSuccess')}</FilterButton>
            <FilterButton active={filter === 'FAILED'} onClick={() => setFilter('FAILED')}>{t('logs.filterFailed')}</FilterButton>
          </FiltersContainer>
        )}
        
        <ScrollableList>
          {executions.length === 0 ? (
            <EmptyText>
              {t('logs.empty')}
            </EmptyText>
          ) : (
            executions
              .filter((exec: Execution) => filter === 'ALL' || exec.status === filter)
              .map((exec: Execution) => {
              const isExpanded = expandedId === exec.id;
              
              let steps: ExecutionLogStep[] = [];
              if (exec.logs) {
                try {
                  steps = typeof exec.logs === 'string' ? JSON.parse(exec.logs) : exec.logs;
                } catch (err) {
                  console.error('Error parsing execution step logs:', err);
                }
              }

              return (
                <LogCard
                  key={exec.id}
                  status={exec.status}
                  isExpanded={isExpanded}
                  onClick={() => handleCardClick(exec)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(exec); } }}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <LogHeader>
                  <Flex flexDirection="column" gap="spacing2Xs">
                    <LogTitle>
                      {exec.workflow_name}
                    </LogTitle>
                    <Flex gap="spacingXs" alignItems="center">
                      <LogId>{getRelativeTime(exec.created_at, t)}</LogId>
                      {steps.length > 0 && (
                        <LogId>&bull; {getExecutionDuration(steps)}</LogId>
                      )}
                    </Flex>
                  </Flex>
                  <Badge variant={getBadgeVariant(exec.status)}>
                    {exec.status}
                  </Badge>
                </LogHeader>
                <CorrelationId>Corr: {exec.correlation_id.substring(0, 8)}...</CorrelationId>

                  {isExpanded && (
                    <StepsContainer
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <StepsCountTitle>
                        {t('logs.steps', { count: steps.length })}
                      </StepsCountTitle>
                      {steps.length === 0 ? (
                        <NoStepsText>{t('logs.noSteps')}</NoStepsText>
                      ) : (
                        steps.map((step, idx) => (
                          <StepItem key={idx} status={step.status}>
                            <StepHeader>
                              <StepNodeLabel>
                                {step.nodeLabel}
                              </StepNodeLabel>
                              <Badge size="small" variant={getBadgeVariant(step.status)}>
                                {step.status}
                              </Badge>
                            </StepHeader>
                            {step.error && (
                              <ErrorDetail>
                                {t('logs.errorLabel')} {step.error}
                              </ErrorDetail>
                            )}
                            {!step.error && step.output && (
                              <StepDetail>
                                {t('logs.outputLabel')} {JSON.stringify(step.output, null, 2)}
                              </StepDetail>
                            )}
                          </StepItem>
                        ))
                      )}
                    </StepsContainer>
                  )}
                </LogCard>
              );
            })
          )}
        </ScrollableList>
      </LogsFloatingPanel>
    </>
  );
};
