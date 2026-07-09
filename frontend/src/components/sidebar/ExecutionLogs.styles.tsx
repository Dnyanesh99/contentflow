import styled from '@emotion/styled';
import { Heading, Flex } from '@contentful/f36-components';
import { theme } from '../../styles/theme';

export const LogsFloatingPanel = styled.aside<{ isOpen: boolean }>`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  width: 90%;
  max-width: 380px;
  max-height: calc(100% - ${theme.spacing.md} * 2);
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
  z-index: 30;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(120%)')};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.isOpen ? 'auto' : 'none')};

  @media (max-width: 768px) {
    right: 5%;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.15s ease;
    transform: none;
  }
`;

export const ScrollableList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  bottom: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50px;
  /* Minimum 44x44px touch target per WCAG 2.5.5 */
  min-height: 44px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: ${theme.shadows.glowPrimary};
  z-index: 20;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const PanelHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${theme.colors.primary};
  padding-bottom: ${theme.spacing.xs};
`;

export const SidebarHeading = styled(Heading)`
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.textMuted};
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  /* Minimum 44x44px touch target */
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.danger};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const FiltersContainer = styled(Flex)`
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

export const FilterButton = styled.button<{ active?: boolean }>`
  background: ${(props) => (props.active ? 'rgba(255,255,255,0.1)' : 'transparent')};
  border: 1px solid
    ${(props) => (props.active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)')};
  color: ${(props) => (props.active ? '#fff' : theme.colors.textMuted)};
  padding: 6px 12px;
  /* Minimum height for touch target */
  min-height: 32px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const LogCard = styled.div<{ status: string; isExpanded: boolean }>`
  background: ${(props) =>
    props.status === 'Success'
      ? 'rgba(52, 211, 153, 0.05)'
      : props.status === 'Failed'
        ? 'rgba(248, 113, 113, 0.05)'
        : 'rgba(251, 191, 36, 0.05)'};
  backdrop-filter: blur(8px);
  border: 1px solid
    ${(props) =>
      props.isExpanded
        ? props.status === 'Success'
          ? theme.colors.success
          : props.status === 'Failed'
            ? theme.colors.danger
            : theme.colors.warning
        : theme.colors.border};
  border-left: 4px solid
    ${(props) =>
      props.status === 'Success'
        ? theme.colors.success
        : props.status === 'Failed'
          ? theme.colors.danger
          : theme.colors.warning};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  transition: ${theme.animation.spring};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const LogHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const LogId = styled.div`
  font-size: 10px;
  color: ${theme.colors.textMuted};
  font-family: monospace;
`;

export const StepsContainer = styled.div`
  margin-top: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.border};
  padding-top: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

export const StepItem = styled.div<{ status: string }>`
  font-size: 11px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${theme.borderRadius.sm};
  border-left: 3px solid ${(props) => {
    switch (props.status) {
      case 'SUCCESS': return theme.colors.success;
      case 'FAILED': return theme.colors.danger;
      default: return theme.colors.warning;
    }
  }};
`;

export const StepHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

export const StepDetail = styled.div`
  margin-top: 4px;
  font-size: 10px;
  font-family: monospace;
  word-break: break-all;
  white-space: pre-wrap;
  color: ${theme.colors.textMuted};
`;

export const StyledSidebarHeading = styled(Heading)`
  color: ${theme.colors.text} !important;
  margin-bottom: 0;
`;

export const LoadingContainer = styled(Flex)`
  justify-content: center;
  margin-top: 40px;
`;

export const ErrorText = styled.p`
  color: ${theme.colors.danger};
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
`;

export const EmptyText = styled.p`
  color: ${theme.colors.textMuted};
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
`;

export const LogTitle = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const CorrelationId = styled(LogId)`
  margin-top: ${theme.spacing.xs};
  font-size: 9px;
`;

export const StepsCountTitle = styled.span`
  font-size: 10px;
  font-weight: bold;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
`;

export const NoStepsText = styled.span`
  font-size: 10px;
  color: ${theme.colors.textMuted};
`;

export const StepNodeLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const ErrorDetail = styled(StepDetail)`
  color: ${theme.colors.danger};
`;
