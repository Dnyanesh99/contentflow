import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowCanvas } from '../../components/canvas/WorkflowCanvas';

// Mock Zustand store for canvas
vi.mock('../../store/useWorkflowStore', () => ({
  useWorkflowStore: (selector: any) => {
    const state = {
      nodes: [],
      edges: [],
      onNodesChange: vi.fn(),
      onEdgesChange: vi.fn(),
      onConnect: vi.fn(),
      setSelectedNodeId: vi.fn(),
      selectedNodeId: null,
      workflowId: '1',
    };
    return selector(state);
  }
}));

globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe('WorkflowCanvas Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<WorkflowCanvas />);
    // Check if react-flow wrapper is rendered
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });
});
