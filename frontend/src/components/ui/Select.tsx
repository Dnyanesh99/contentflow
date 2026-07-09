import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';

const NativeSelect = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 13px;
  border-radius: ${theme.borderRadius.md};
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  padding: 0 32px 0 12px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  appearance: none;

  &:hover {
    background-color: ${(props) =>
      props.disabled
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(255, 255, 255, 0.06)'};
    border-color: ${(props) =>
      props.disabled
        ? theme.colors.border
        : 'rgba(255, 255, 255, 0.2)'};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
  }

  option {
    background: rgba(17, 24, 39, 0.95);
    color: ${theme.colors.text};
  }
`;

const SelectContainer = styled.div`
  position: relative;
  width: auto;
  flex-shrink: 0;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${theme.colors.text};
    transform: translateY(-50%);
    pointer-events: none;
  }

  &[aria-disabled="true"]::after {
    border-top-color: ${theme.colors.textMuted};
  }
`;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {

}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, style, disabled, ...rest }, ref) => {
    return (
      <SelectContainer className={className} style={style} aria-disabled={disabled}>
        <NativeSelect ref={ref} disabled={disabled} {...rest}>
          {children}
        </NativeSelect>
      </SelectContainer>
    );
  },
);

Select.displayName = 'Select';
