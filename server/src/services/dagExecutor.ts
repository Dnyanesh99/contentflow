import { IntegrationRegistry } from "../integrations/registry.js";
import { WorkflowDefinition } from "../schemas/workflow.schema.js";
import { ExecutionLogStep } from "../schemas/execution.schema.js";

export type WebhookPayload = Record<string, unknown>;

function buildAdjacencyList(
  nodes: WorkflowDefinition["nodes"],
  edges: WorkflowDefinition["edges"],
) {
  const adjacencyList: Record<string, string[]> = {};

  for (const node of nodes) {
    adjacencyList[node.id] = [];
  }

  for (const edge of edges) {
    if (adjacencyList[edge.source]) {
      adjacencyList[edge.source].push(edge.target);
    }
  }

  return { adjacencyList };
}

async function executeNode(
  currentNode: WorkflowDefinition["nodes"][0],
  payload: WebhookPayload,
  nodeResults: Record<string, any>,
): Promise<{ result: any; output: any }> {
  console.log(
    `[DAG] Executing node: ${currentNode.id} of type: ${currentNode.type}`,
  );

  const context = {
    payload,
    ...payload,
    ...nodeResults,
  };

  if (currentNode.type === "Trigger") {
    return { result: payload, output: payload };
  } else {
    const handler = IntegrationRegistry[currentNode.type];
    if (handler) {
      return await handler(currentNode.data || {}, context);
    } else {
      throw new Error(`Unsupported/unknown node type: ${currentNode.type}`);
    }
  }
}

export const executeDAG = async (
  definition: WorkflowDefinition,
  payload: WebhookPayload,
): Promise<ExecutionLogStep[]> => {
  const { nodes, edges } = definition;
  const logs: ExecutionLogStep[] = [];
  const nodeResults: Record<string, any> = {};

  const { adjacencyList } = buildAdjacencyList(nodes, edges);

  const triggerNode = nodes.find((n) => n.type === "Trigger");

  if (!triggerNode) {
    const err: any = new Error("Invalid DAG: No Trigger node found");
    err.logs = logs;
    throw err;
  }

  const queue: string[] = [triggerNode.id];
  const executed = new Set<string>();

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (executed.has(nodeId)) {
      continue; // Prevent infinite loops in cyclic graphs
    }
    executed.add(nodeId);

    const currentNode = nodes.find((n) => n.id === nodeId);
    if (!currentNode) continue;

    const startTime = new Date().toISOString();
    const stepLog: ExecutionLogStep = {
      nodeId: currentNode.id,
      nodeType: currentNode.type,
      nodeLabel: (currentNode.data?.label as string) || currentNode.type,
      status: "Success",
      startTime,
      endTime: startTime,
      input: currentNode.data || {},
    };

    try {
      const { result, output } = await executeNode(
        currentNode,
        payload,
        nodeResults,
      );
      nodeResults[currentNode.id] = result;
      nodeResults[currentNode.type] = result;
      stepLog.output = output;
    } catch (error: any) {
      stepLog.status = "Failed";
      stepLog.error = error.message || String(error);
      logs.push({ ...stepLog, endTime: new Date().toISOString() });
      const err: any = new Error(
        `Node ${currentNode.id} (${currentNode.type}) failed: ${error.message}`,
      );
      err.logs = logs;
      throw err;
    }

    stepLog.endTime = new Date().toISOString();
    logs.push(stepLog);

    const outgoingNodeIds = adjacencyList[nodeId] || [];
    for (const neighborId of outgoingNodeIds) {
      queue.push(neighborId);
    }
  }

  return logs;
};
