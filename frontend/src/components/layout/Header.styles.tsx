import styled from '@emotion/styled';
import { Modal, Paragraph } from '@contentful/f36-components';
import { Select } from '../ui';
import { theme } from '../../styles/theme';

export const LangSelect = styled(Select)`
  width: 72px;
  flex-shrink: 0;
  height: 36px;
`;

export const WorkflowSelect = styled(Select)`
  width: 180px;
  flex-shrink: 0;
  height: 36px;
`;

export const StyledModalContent = styled(Modal.Content)`
  background-color: ${theme.colors.surfaceSolid};
  color: ${theme.colors.text};
`;

export const StyledModalParagraph = styled(Paragraph)`
  color: ${theme.colors.text};
`;

export const StyledModalControls = styled(Modal.Controls)`
  background-color: ${theme.colors.surfaceSolid};
`;

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.lg};
  min-height: 60px;
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 24px rgba(0, 0, 0, 0.35);
  z-index: 100;
  position: relative;
  /* overflow: visible so the Select dropdown can render below the header
     without being clipped by the 60px height constraint. */
  overflow: visible;

  @media (max-width: 640px) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    flex-wrap: wrap;
    gap: 10px;
  }
`;

export const Branding = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-shrink: 0;
`;

export const AppTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: ${theme.colors.primary};
  line-height: 1;
  white-space: nowrap;
`;

export const AppDivider = styled.div`
  height: 20px;
  width: 1px;
  background-color: ${theme.colors.border};
  flex-shrink: 0;
`;

export const Actions = styled.div`
  /* Push actions to the right of Branding. */
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  /* Wrapping allows items to naturally flow on small devices without horizontal overflow. */
  
  .btn-label {
    @media (max-width: 900px) {
      display: none;
    }
  }

  button {
    @media (max-width: 900px) {
      padding: 0 10px;
      gap: 0;
    }
  }
`;

export const ActionDivider = styled.div`
  height: 18px;
  width: 1px;
  background-color: ${theme.colors.border};
  flex-shrink: 0;
  margin: 0 2px;
`;

export const StyledInput = styled.input`
  width: clamp(100px, 16vw, 200px);
  flex-shrink: 0;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 13px;
  border-radius: ${theme.borderRadius.md};
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  padding: 0 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export const StyledButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
  white-space: nowrap;
  height: 36px;
  padding: 0 14px;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.02em;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  ${(props) =>
    props.variant === 'primary' &&
    `
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 2px 8px rgba(129, 140, 248, 0.35);
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      box-shadow: 0 4px 14px rgba(129, 140, 248, 0.5);
      transform: translateY(-1px);
    }
  `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background: rgba(255, 255, 255, 0.06);
    color: ${theme.colors.text};
    border-color: ${theme.colors.border};
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }
  `}

  ${(props) =>
    props.variant === 'danger' &&
    `
    background: rgba(248, 113, 113, 0.08);
    color: ${theme.colors.danger};
    border-color: rgba(248, 113, 113, 0.18);
    &:hover:not(:disabled) {
      background: rgba(248, 113, 113, 0.18);
      border-color: rgba(248, 113, 113, 0.3);
    }
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

export const ToastWrapper = styled.div<{ isError: boolean }>`
  position: fixed;
  top: 72px;
  right: ${theme.spacing.lg};
  background-color: ${(props) => (props.isError ? theme.colors.danger : theme.colors.success)};
  color: white;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.lg};
  z-index: 1000;
  font-size: 13px;
  font-weight: 600;
  animation: slideInToast 0.25s ease-out;

  @keyframes slideInToast {
    from {
      transform: translateX(110%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
