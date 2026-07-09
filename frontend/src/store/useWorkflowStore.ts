import { create } from "zustand";
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "reactflow";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";
import type { NodeData, Workflow } from "../types/workflow";
import { v4 as uuidv4 } from "uuid";

export type AppNode = Node<NodeData>;

function getNextNodePosition(existingNodes: AppNode[]): {
  x: number;
  y: number;
} {
  const COLUMN_X = 250;
  const ROW_HEIGHT = 160;
  const BASE_Y = 80;
  return {
    x: COLUMN_X,
    y: BASE_Y + existingNodes.length * ROW_HEIGHT,
  };
}

interface WorkflowState {
  workflowId: string;
  workflowName: string;
  nodes: AppNode[];
  edges: Edge[];

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: AppNode) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  clearCanvas: () => void;
  setWorkflowId: (id: string) => void;
  setWorkflowName: (name: string) => void;
  loadWorkflow: (workflow: Workflow) => void;
  getNextPosition: () => { x: number; y: number };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflowId: uuidv4(),
  workflowName: "New ContentFlow",
  nodes: [
    {
      id: "default-trigger-node",
      type: "ActionNode",
      position: { x: 250, y: 80 },
      data: { label: "Contentful Webhook", type: "Trigger" },
    },
    {
      id: "default-slack-node",
      type: "ActionNode",
      position: { x: 250, y: 240 },
      data: {
        label: "Notify Slack",
        type: "Slack.Notify",
        channelName: "#general",
        webhookUrl: "",
        messageTemplate: "",
      },
    },
  ],
  edges: [],

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as AppNode[],
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge({ ...connection, type: "smoothstep" }, state.edges),
    }));
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
    }));
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } as NodeData }
          : node,
      ),
    }));
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  setWorkflowId: (id) => {
    set({ workflowId: id });
  },

  setWorkflowName: (name) => {
    set({ workflowName: name });
  },

  clearCanvas: () => {
    set({
      workflowId: uuidv4(),
      workflowName: "New ContentFlow",
      nodes: [],
      edges: [],
    });
  },

  loadWorkflow: (workflow) => {
    const nodes = workflow.definition.nodes.map((n, index) => ({
      id: n.id,
      type: "ActionNode",
      position: n.position || { x: 250, y: 80 + index * 160 },
      data: n.data || {
        label: (n.data as NodeData | undefined)?.label ?? n.type,
        type: n.type,
      },
    })) as AppNode[];

    const edges = workflow.definition.edges.map((e) => ({
      id: `${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
    }));

    set({
      workflowId: workflow.id,
      workflowName: workflow.name,
      nodes,
      edges,
    });
  },

  getNextPosition: () => getNextNodePosition(get().nodes),
}));
