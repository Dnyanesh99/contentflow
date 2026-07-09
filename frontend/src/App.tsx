import React, { Suspense } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Flex, Spinner, Text } from '@contentful/f36-components';
import { Header } from './components/layout/Header';
import { NodeConfigSidebar } from './components/sidebar/NodeConfigSidebar';
import { ExecutionLogs } from './components/sidebar/ExecutionLogs';
import { useUIStore } from './store/useUIStore';
import { theme } from './styles/theme';

const WorkflowCanvas = React.lazy(() =>
  import('./components/canvas/WorkflowCanvas').then((module) => ({
    default: module.WorkflowCanvas,
  })),
);

const AppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const LoadingContainer = styled(Flex)`
  flex: 1;
  height: 100%;
  background-color: ${theme.colors.surfaceSolid};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const LoadingText = styled(Text)`
  color: ${theme.colors.text};
  font-weight: 600;
`;

const App: React.FC = () => {
  const { t } = useTranslation();
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);

  return (
    <AppLayout>
      <Header />
      <MainContent>
        <Suspense
          fallback={
            <LoadingContainer>
              <Spinner size="large" />
              <LoadingText>
                {t('canvas.loading')}
              </LoadingText>
            </LoadingContainer>
          }
        >
          <WorkflowCanvas />
        </Suspense>
        <NodeConfigSidebar key={selectedNodeId || 'none'} />
        <ExecutionLogs />
      </MainContent>
    </AppLayout>
  );
};

export default App;
