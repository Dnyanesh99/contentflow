export interface BaseNodeData {
  label: string;
}

export interface TriggerNodeData extends BaseNodeData {
  type: 'Trigger';
  contentType?: string;
  action?: string;
  triggerField?: string;
}

export interface SlackNodeData extends BaseNodeData {
  type: 'Slack.Notify';
  webhookUrl: string;
  messageTemplate: string;
  channelName?: string;
}

export interface AITaskNodeData extends BaseNodeData {
  type: 'LLM.Prompt';
  provider: 'openai' | 'anthropic' | 'ollama' | 'gemini';
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface ContentfulWriteBackNodeData extends BaseNodeData {
  type: 'Contentful.WriteBack';
  entryId: string;
  field: string;
  locale: string;
  value: string;
}

export interface CustomCodeNodeData extends BaseNodeData {
  type: 'Custom.Code';
  code: string;
}

export type NodeData = TriggerNodeData | SlackNodeData | AITaskNodeData | ContentfulWriteBackNodeData | CustomCodeNodeData;

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger_type: string;
  definition: {
    nodes: Node[];
    edges: Edge[];
  };
  is_active: boolean;
}

export interface ExecutionLogStep {
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: 'Success' | 'Failed' | 'Pending';
  startTime: string;
  endTime: string;
  input?: any;
  output?: any;
  error?: string;
}

export interface Execution {
  id: string;
  workflow_id: string;
  workflow_name: string;
  correlation_id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  logs: ExecutionLogStep[];
  created_at: string;
}
