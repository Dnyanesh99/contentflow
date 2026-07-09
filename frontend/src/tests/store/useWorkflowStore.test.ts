import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useUIStore } from '../../store/useUIStore';
import { act } from '@testing-library/react';

describe('useWorkflowStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useWorkflowStore.getState();
    act(() => {
      store.clearCanvas();
    });
  });

  it('initializes with a default workflow state', () => {
    const state = useWorkflowStore.getState();
    expect(state.workflowName).toBe('New ContentFlow');
    expect(state.nodes.length).toBe(0);
    expect(state.edges.length).toBe(0);
  });

  it('sets a new workflow name', () => {
    act(() => {
      useWorkflowStore.getState().setWorkflowName('My Test Workflow');
    });
    expect(useWorkflowStore.getState().workflowName).toBe('My Test Workflow');
  });

  it('selects a node correctly', () => {
    act(() => {
      useUIStore.getState().setSelectedNodeId('node-123');
    });
    expect(useUIStore.getState().selectedNodeId).toBe('node-123');
  });
});
