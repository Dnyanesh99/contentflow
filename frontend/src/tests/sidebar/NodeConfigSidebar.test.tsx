import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeConfigSidebar } from '../../components/sidebar/NodeConfigSidebar';

// Mock @monaco-editor/react to prevent it from loading in tests and hanging Vitest
vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="mock-monaco-editor">Mock Monaco Editor</div>,
}));

const mockWorkflowState = {
  nodes: [
    {
      id: '1',
      type: 'customNode',
      data: { type: 'Trigger', label: 'My Trigger' },
    },
  ],
  selectedNodeId: '1', // Simulate a selected node
  updateNodeData: vi.fn(),
  setSelectedNodeId: vi.fn(),
};

vi.mock('../../store/useWorkflowStore', () => ({
  useWorkflowStore: (selector: any) => selector(mockWorkflowState),
}));

// We must mock ResizeObserver for React Flow and Monaco
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

const mockUIState = {
  selectedNodeId: '1',
  setSelectedNodeId: vi.fn(),
};

vi.mock('../../store/useUIStore', () => ({
  useUIStore: (selector: any) => selector(mockUIState),
}));

describe('NodeConfigSidebar Layout Component', () => {
  it('renders the sidebar modal with the selected node type', () => {
    render(<NodeConfigSidebar />);
    expect(screen.getByRole('heading', { name: /Trigger/i })).toBeInTheDocument();
  });

  it('renders the form inputs properly', () => {
    render(<NodeConfigSidebar />);
    // Testing the node label input (react-i18next returns the key in tests)
    expect(screen.getByPlaceholderText('sidebar.nodeTitlePlaceholder')).toBeInTheDocument();
  });
});
