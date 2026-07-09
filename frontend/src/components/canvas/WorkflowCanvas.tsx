import React, { useCallback, useMemo } from 'react';
import ReactFlow, { Background, Controls, Panel } from 'reactflow';
import type { NodeMouseHandler } from 'reactflow';
import 'reactflow/dist/style.css';
import styled from '@emotion/styled';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { useUIStore } from '../../store/useUIStore';
import { ActionNode } from './nodes/ActionNode';
import { theme } from '../../styles/theme';
import { NodePalette } from './NodePalette';

const CanvasWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  position: relative;
  background-color: ${theme.colors.background};

  /* React Flow Controls Override */
  .react-flow__controls {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: rgba(11, 15, 25, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .react-flow__controls-button {
    background: transparent;
    border: none;
    border-bottom: none;
    color: ${theme.colors.text};
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s ease, color 0.2s ease;
    padding: 0; /* Reset padding to prevent overlapping if box-sizing is border-box */
    box-sizing: border-box;

    svg {
      fill: ${theme.colors.text};
      width: 16px;
      height: 16px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 1px;
    }
  }

  /* Remove default borders that reactflow puts between buttons */
  .react-flow__controls-button:not(:last-child) {
    border-bottom: none;
  }
`;

export const WorkflowCanvas: React.FC = () => {
  const nodeTypes = useMemo(() => ({ ActionNode }), []);

  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const onNodesChange = useWorkflowStore((state) => state.onNodesChange);
  const onEdgesChange = useWorkflowStore((state) => state.onEdgesChange);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const setSelectedNodeId = useUIStore((state) => state.setSelectedNodeId);



  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <CanvasWrapper>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1f2937" gap={16} size={1} />
        <Controls />
        <Panel position="top-left">
          <NodePalette />
        </Panel>
      </ReactFlow>
    </CanvasWrapper>
  );
};
