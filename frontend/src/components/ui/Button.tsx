import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  ${(props) =>
    (!props.variant || props.variant === 'primary') &&
    `
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 4px 14px rgba(129, 140, 248, 0.4);
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
      transform: translateY(-1px);
    }
  `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.text};
    border-color: ${theme.colors.border};
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  `}

  ${(props) =>
    props.variant === 'danger' &&
    `
    background: rgba(248, 113, 113, 0.1);
    color: ${theme.colors.danger};
    border-color: rgba(248, 113, 113, 0.2);
    &:hover:not(:disabled) {
      background: rgba(248, 113, 113, 0.2);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
