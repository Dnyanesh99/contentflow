import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;
  padding: 8px 12px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
    outline: none;
  }
  
  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
