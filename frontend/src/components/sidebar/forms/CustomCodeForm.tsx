import React from 'react';
import styled from '@emotion/styled';
import Editor from '@monaco-editor/react';
import type { UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormGroup, Label } from '../../ui';

interface CustomCodeFormProps {
  codeValue: string;
  setValue: UseFormSetValue<any>;
}

const EditorWrapper = styled.div`
  height: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

export const CustomCodeForm: React.FC<CustomCodeFormProps> = ({ codeValue, setValue }) => {
  const { t } = useTranslation();

  return (
    <FormGroup>
      <Label>{t('sidebar.code.title')}</Label>
      <EditorWrapper 
        className="nodrag nopan"
        onKeyDown={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={codeValue}
          onChange={(value) => setValue('code', value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </EditorWrapper>
    </FormGroup>
  );
};
