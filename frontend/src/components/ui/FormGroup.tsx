import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${theme.spacing.md};
`;

export const Label = styled.label`
  display: block;
  color: ${theme.colors.textMuted};
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

export const FormError = styled.div`
  color: ${theme.colors.danger};
  font-size: 11px;
  margin-top: 4px;
`;
