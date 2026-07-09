import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '../../components/layout/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

// ─── Store mock ───────────────────────────────────────────────────────────────
vi.mock('../../store/useWorkflowStore', () => ({
  useWorkflowStore: (selector: (s: object) => unknown) => {
    const state = {
      workflowId: '1',
      workflowName: 'Test Workflow',
      nodes: [],
      edges: [],
      toast: null,
      setWorkflowName: vi.fn(),
      saveWorkflow: vi.fn(),
      loadWorkflow: vi.fn(),
      clearCanvas: vi.fn(),
      deleteWorkflow: vi.fn(),
      runWorkflow: vi.fn(),
      showToast: vi.fn(),
      hideToast: vi.fn(),
    };
    return selector(state);
  },
}));

// ─── Contentful context mock ──────────────────────────────────────────────────
vi.mock('../../context/ContentfulContext', () => ({
  useContentful: () => ({ sdk: null, isInContentful: false, isReady: true }),
}));

// ─── Query and mutation mocks ─────────────────────────────────────────────────
vi.mock('../../queries/useWorkflowsQuery', () => ({
  useWorkflowsQuery: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock('../../mutations/useSaveWorkflowMutation', () => ({
  useSaveWorkflowMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../../mutations/useDeleteWorkflowMutation', () => ({
  useDeleteWorkflowMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('../../mutations/useTriggerWebhookMutation', () => ({
  useTriggerWebhookMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

// ─── i18n mock ────────────────────────────────────────────────────────────────
// Returns actual English text so tests match realistic rendered output.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'header.title': 'ContentFlow',
        'header.namePlaceholder': 'Workflow name...',
        'header.loadWorkflow': 'Load workflow...',
        'header.noWorkflows': 'No saved workflows',
        'header.new': 'New',
        'header.delete': 'Delete',
        'header.testTrigger': 'Test Trigger',
        'header.deploy': 'Deploy',
        'header.deploying': 'Deploying...',
        'header.deleteTitle': 'Delete Workflow',
        'header.deleteConfirm': `Delete "${opts?.name as string}"?`,
        'header.deleteSuccess': 'Workflow deleted',
        'header.deploySuccess': 'Workflow deployed',
        'header.webhookTriggered': 'Webhook triggered',
        'header.errorEmpty': 'Canvas is empty',
        'header.errorNoTrigger': 'Add a trigger first',
        'header.cancel': 'Cancel',
      };
      return translations[key] ?? key;
    },
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

const renderHeader = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>,
  );

describe('Header Layout Component', () => {
  it('renders the branding correctly', () => {
    renderHeader();
    expect(screen.getByText(/ContentFlow/i)).toBeInTheDocument();
  });

  it('renders deploy and test trigger buttons', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /deploy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test trigger/i })).toBeInTheDocument();
  });
});
