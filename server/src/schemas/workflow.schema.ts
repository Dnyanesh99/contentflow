import { z } from 'zod';

export const NodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
});

export const EdgeSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
});

export const WorkflowDefinitionSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
}).superRefine((data, ctx) => {
  // 1. Check for exactly one Trigger node
  const triggerNodes = data.nodes.filter(n => n.type === 'Trigger');
  if (triggerNodes.length !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Workflow must have exactly one Trigger node',
      path: ['nodes'],
    });
  }

  // 2. Check that all edges refer to existing nodes
  const nodeIds = new Set(data.nodes.map(n => n.id));
  data.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.source)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge source ${edge.source} does not exist in nodes`,
        path: ['edges', index, 'source'],
      });
    }
    if (!nodeIds.has(edge.target)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge target ${edge.target} does not exist in nodes`,
        path: ['edges', index, 'target'],
      });
    }
  });

  // 3. Cycle Detection (DFS)
  const adjacencyList: Record<string, string[]> = {};
  nodeIds.forEach(id => { adjacencyList[id] = []; });
  data.edges.forEach(edge => {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = adjacencyList[nodeId] || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const nodeId of nodeIds) {
    if (hasCycle(nodeId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Workflow contains cyclical dependencies, which are not allowed in a DAG.',
        path: ['edges'],
      });
      break;
    }
  }
});

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  trigger_type: z.string().min(1),
  definition: WorkflowDefinitionSchema,
  is_active: z.boolean(),
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type DAGNode = z.infer<typeof NodeSchema>;
export type DAGEdge = z.infer<typeof EdgeSchema>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;
