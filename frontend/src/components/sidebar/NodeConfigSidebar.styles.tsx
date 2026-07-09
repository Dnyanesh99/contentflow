import styled from '@emotion/styled';
import { Heading } from '@contentful/f36-components';
import { Button } from '../ui';
import { theme } from '../../styles/theme';

export const PopupContainer = styled.dialog`
  width: 90%;
  max-width: 450px;
  max-height: 85%;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: ${theme.colors.text};
  margin: auto;

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
    max-height: 95%;
  }

  @keyframes popIn {
    0% {
      transform: scale(0.95) translateY(10px);
      opacity: 0;
    }
    100% {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SidebarHeading = styled(Heading)`
  border-bottom: 2px solid ${theme.colors.primary};
  padding-bottom: ${theme.spacing.xs};
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.5px;
  color: ${theme.colors.text} !important;
`;

export const StyledSidebarHeading = styled(SidebarHeading)`
  color: ${theme.colors.text};
  border-bottom: none;
  padding: 0;
`;

export const SaveButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;
